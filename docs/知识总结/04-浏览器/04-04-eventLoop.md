# 事件轮询

## 浏览器中的 Event-Loop

众所周知 JS 是门**非阻塞单线程语言**，因为在最初 JS 就是为了和浏览器交互而诞生的。如果 JS 是门多线程的语言话，我们在多个线程中处理 DOM 就可能会发生问题（一个线程中新加节点，另一个线程中删除节点），当然可以引入读写锁解决这个问题。

JS 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到调用栈中。如果遇到异步的代码，会被挂起并加入到 Task（有多种 task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 **JS 中的异步还是同步行为**。

### 事件轮询中的角色

在浏览器的事件循环中，首先要认清楚 3 个角色：**函数调用栈**、**宏任务（macro-task)队列**和**微任务(micro-task)队列**。

在 ES6 规范中，micro-task 称为 `jobs`，macro-task 称为 `task`。

#### 函数调用栈

当引擎第一次遇到 JS 代码时，会产生一个全局执行上下文并压入调用栈。后面每遇到一个函数调用，就会往栈中压入一个新的函数上下文。JS 引擎会执行栈顶的函数，执行完毕后，弹出对应的上下文。一句话：如果你有一坨需要被执行的逻辑，它首先需要被推入函数调用栈，后续才能被执行。

#### 宏任务队列与微任务队列

JS 的特性就是**单线程 + 异步**。在 JS 中，异步任务不需要立刻被执行，所以它们在刚刚被派发的时候，并不具备进入调用栈的“资格”。

于是这些待执行的任务，按照一定的规则，乖乖排起长队，等待着被推入调用栈的时刻到来——这个队列，就叫做“**任务队列**”。

<img src="https://tva1.sinaimg.cn/large/0081Kckwgy1gl8htdar71j30lo0hsaaz.jpg" alt="宏任务队列 macro-task" style="zoom: 50%;" />

常见的 **macro-task** 比如：

- `setTimeout`
- `setInterval`
- `setImmediate`
- `script`（整体代码）
- I/O 操作等

<img src="https://tva1.sinaimg.cn/large/0081Kckwgy1gl8htt25f0j30j40dkq3l.jpg" alt="微任务队列 micro-task" style="zoom: 50%;" />

常见的 **micro-task** 比如:

- `process.nextTick`
- `Promise`
- `MutationObserver` 等

> 注意：`script`（整体代码）它也是一个宏任务；此外，宏任务中的 `setImmediate`、微任务中的 `process.nextTick` 这些都是 Node 独有的。

### 轮询流程

基于对 micro 和 macro 的认知，我们来走一遍完整的事件循环过程。

一个完整的 Event Loop 过程，可以概括为以下阶段：

1. **执行并出队一个 macro-task**。注意如果是初始状态：调用栈空。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。这时首先执行并出队的就是 script 脚本；
2. **全局上下文（script 标签）被推入调用栈，同步代码执行**。在执行的过程中，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。这个过程本质上是队列的 macro-task 的执行和出队的过程；
3. **执行 micro-task 队列**。但需要注意的是：当 macro-task 出队时，任务是一个一个执行的；而 micro-task 出队时，任务是一队一队执行的（如下图所示）。因此，我们处理 micro 队列这一步，会逐个执行队列中的任务并把它出队，直到**队列被清空**；
4. **执行渲染操作，更新界面**；
5. **检查是否存在 Web worker 任务**，如果有，则对其进行处理；
6. **开始下一轮 Event loop**，执行宏任务中的异步代码

## Node 中的 Event-Loop

### Node 架构 - libuv

简化的 Node 架构图：

![图片描述](https://tva1.sinaimg.cn/large/0081Kckwgy1gl8thhxyepj30nw0hemyb.jpg)

Node 整体上由这三部分组成：

- **应用层**：这一层就是大家最熟悉的 Node.js 代码，包括 Node 应用以及一些标准库。

- **桥接层**：Node 底层是用 C++ 来实现的。桥接层负责封装底层依赖的 C++ 模块的能力，将其简化为 API 向应用层提供服务。

- **底层依赖**：这里就是最最底层的 C++ 库了，支撑 Node 运行的最基本能力在此汇聚。其中需要特别引起大家注意的就是 V8 和 libuv：
  - **V8 是 JS 的运行引擎**，它负责把 JavaScript 代码转换成 C++，然后去跑这层 C++ 代码。
  - **libuv**：它对**跨平台的异步 I/O 能力进行封装**，Node 中的事件循环就是由 libuv 来初始化的。

> 注意：第一个区别——浏览器的 Event-Loop 由各个浏览器自己实现；而 Node 的 Event-Loop 由 libuv 来实现。

#### libuv 中的 Event-Loop 实现

libuv 主导循环机制共有六个循环阶段。这里引用 Node 官方（出处：https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/）的一张图给大家作说明：

![图片描述](https://tva1.sinaimg.cn/large/0081Kckwgy1gl8ttqep2uj316i0psmyo.jpg)

这六个阶段各自的作用：

- **timers 阶段**：**执行 `setTimeout` 和 `setInterval` 中定义的回调**；
- **pending callbacks**：直译过来是“**被挂起的回调**”，如果网络 I/O 或者文件 I/O 的过程中出现了错误，就会在这个阶段处理错误的回调（比较少见，可以略过）；
- **idle, prepare**：**仅系统内部使用**。这个阶段我们开发者不需要操心。（可以略过）；
- **poll （轮询阶段）**：重点阶段，这个阶段会**执行 I/O 回调**，同时还会**检查定时器是否到期**；
- **check（检查阶段）**：**处理 `setImmediate` 中定义的回调**；
- **close callbacks**：**处理一些“关闭”的回调**，比如`socket.on('close', ...)`就会在这个阶段被触发。

### 宏任务与微任务

和浏览器中一样，Node 世界里也有宏任务与微任务之分。划分依据与我们上文描述的其实是一致的：

常见的 macro-task 比如： `setTimeout`、`setInterval`、 `setImmediate`、 `script`（整体代码）、I/O 操作、UI 渲染等。

常见的 micro-task 比如: `process.nextTick`、`Promise`、`MutationObserver` 等

需要注意的是，`setImmediate` 和 `process.nextTick` 是 Node 独有的。

### Node 中的事件轮询流程

在这六个阶段中，需要重点关注的就是 **timers**、**poll** 和 **check** 这 三个阶段，相关的命题也基本上是围绕它们来做文章。流程如下：

1. **执行全局的 Script 代码**（与浏览器无差）； 2.** 把微任务队列清空**：注意，Node 清空微任务队列的手法比较特别。在浏览器中，我们只有一个微任务队列需要接受处理；但在 Node 中，有两类微任务队列：next-tick 队列和其它队列。其中这个 next-tick 队列，专门用来收敛 process.nextTick 派发的异步任务。**在清空队列时，优先清空 next-tick 队列中的任务**，随后才会清空其它微任务；
2. **开始执行 macro-task（宏任务）**。注意，Node 执行宏任务的方式与浏览器不同：在浏览器中，我们每次出队并执行一个宏任务；而在 Node 中，我们**每次会尝试清空当前阶段对应宏任务队列里的所有任务**（除非达到了系统限制）；
3. 步骤 3 开始，会进入 3 -> 2 -> 3 -> 2…的循环（整体过程如下所示）:

```js
micro-task-queue ----> timers-queue
                            |
                            |
micro-task-queue ----> pending-queue
                            |
                            |
micro-task-queue ---->  polling-queue
                            |
                            |
micro-task-queue ---->  check-queue
                            |
                            |
micro-task-queue ---->  close-queue
                            |
                            |
micro-task-queue ----> timers-queue

......
```

整体来看，Node 中每次执行异步任务都是以批量的形式，**“一队一队”地执行**。循环形式为：宏任务队列 -> 微任务队列 -> 宏任务队列 —> 微任务队列 … 这样交替进行。
