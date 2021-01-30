# 源码学习

## React 理念

> React 是用 JavaScript 构建**快速响应**的大型 Web 应用程序的首选方式

主要需要解决的问题为：

- **CPU 的瓶颈**：在浏览器每一帧的时间中，预留一些时间给 JS 线程，React 利用这部分时间更新组件，当预留的时间不够用时，React 将线程控制权交还给浏览器使其有时间渲染 UI，React 则等待下一帧时间到来继续被中断的工作。
- **IO 的瓶颈**：[将人机交互研究的结果整合到真实的 UI 中 (opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html#putting-research-into-production)。

### React 16 架构

React16 架构可以分为三层：

- Scheduler（调度器）—— **调度任务的优先级**，高优任务优先进入 **Reconciler**
- Reconciler（协调器）—— **负责找出变化的组件**
- Renderer（渲染器）—— **负责将变化的组件渲染到页面上**

可以看到，相较于 React15，React16 中新增了 **Scheduler（调度器）**

#### Scheduler 调度器

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

React 实现了功能更完备的 `requestIdleCallback` 的 polyfill，这就是 Scheduler。除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置。

#### Reconciler 协调器

我们知道，在 React15 中 **Reconciler** 是递归处理虚拟 DOM 的。让我们看看 React16 的 **Reconciler** 。

我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用 `shouldYield` 判断当前是否有剩余时间。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么 React16 是如何解决中断更新时 DOM 渲染不完全的问题呢？

在 React16 中，**Reconciler **与 **Renderer** 不再是交替工作。当 **Scheduler** 将任务交给 **Reconciler** 后，**Reconciler** 会为变化的虚拟 DOM 打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

整个 **Scheduler** 与 **Reconciler** 的工作都在内存中进行。只有当所有组件都完成 **Reconciler** 的工作，才会统一交给 **Renderer**。

#### Renderer 渲染器

**Renderer** 根据 **Reconciler** 为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

在 React16 架构中整个更新流程为：

![更新流程](https://tva1.sinaimg.cn/large/008eGmZEgy1gmuiji26olj31rm0rejtw.jpg)

其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断，用户也不会看见更新不完全的 DOM（即上一节演示的情况）。

> 事实上，由于 **Scheduler** 和 **Reconciler** 都是平台无关的，所以`React`为他们单独发了一个包[react-Reconciler (opens new window)](https://www.npmjs.com/package/react-reconciler)。你可以用这个包自己实现一个`ReactDOM`

### React 的 Fiber 架构

> 从 React15 到 React16，协调器（Reconciler）重构的一大目的是：将老的**同步更新**的架构变为**异步可中断更新**。
>
> **异步可中断更新**可以理解为：**更新**在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态。

Fiber 并不是计算机术语中的新名词，他的中文翻译叫做**纤程**，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。

在很多文章中将纤程理解为协程的一种实现。在 JS 中，**协程的实现便是 Generator**。

所以，我们可以将纤程(Fiber)、协程(Generator)理解为代数效应思想在 JS 中的体现。

React Fiber 可以理解为：

**React 内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。**

其中每个任务更新单元为 React Element 对应的 Fiber 节点。

#### Fiber 的起源

在 React15 及以前，**Reconciler** 采用递归的方式创建虚拟 DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，React16 将**递归的无法中断的更新重构为异步的可中断更新**，由于曾经用于递归的虚拟 DOM 数据结构已经无法满足需要。于是，全新的 Fiber 架构应运而生。

#### Fiber 的含义

Fiber 包含三层含义：

- 作为架构来说，之前 React15 的 **Reconciler** 采用递归的方式执行，数据保存在递归调用栈中，所以被称为 **stack Reconciler**。React16 的 **Reconciler** 基于 Fiber 节点实现，被称为 **Fiber Reconciler**。
- 作为静态的数据结构来说，每个 Fibe r 节点对应一个 React Element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的 DOM 节点等信息。
- 作为动态的工作单元来说，每个 Fiber 节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

#### Fiber 的结构

你可以从这里看到[Fiber 节点的属性定义 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)。虽然属性很多，但我们可以按三层含义将他们分类来看

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

##### 作为架构来说

每个 Fiber 节点有个对应的 `React element`，多个 Fiber 节点是如何连接形成树呢？靠如下三个属性：

```js
// 指向父级 Fiber 节点
this.return = null;
// 指向子 Fibe r节点
this.child = null;
// 指向右边第一个兄弟 Fiber 节点
this.sibling = null;
```

举个例子，如下的组件结构：

```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  );
}
```

对应的`Fiber树`结构： ![Fiber架构](https://tva1.sinaimg.cn/large/008eGmZEgy1gmukl9nodyj310a0u0myl.jpg)

> 这里需要提一下，为什么父级指针叫做`return`而不是`parent`或者`father`呢？因为作为一个工作单元，`return`指节点执行完 `completeWork` 后会返回的下一个节点。子 Fiber 节点及其兄弟节点完成工作后会返回其父级节点，所以 `return` 指代父级节点。

##### 作为静态的数据结构

作为一种静态的数据结构，保存了组件相关的信息：

```js
// Fiber 对应组件的类型 Function/Class/Host...
this.tag = tag;
// key 属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身
// 对于ClassComponent，指class
// 对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

##### 作为动态的工作单元

作为动态的工作单元，`Fiber` 中如下参数保存了本次更新相关的信息

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

如下两个字段保存调度优先级相关的信息，会在讲解`Scheduler`时介绍。

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

#### Fiber 的工作原理

> `React` 使用“双缓存”来完成 `Fiber 树`的构建与替换——对应着 `DOM 树`的创建与更新。

## 双缓存 Fiber 树

在 `React` 中最多会同时存在两棵 `Fiber 树`。当前屏幕上显示内容对应的 `Fiber 树`称为 `current Fiber 树`，正在内存中构建的 `Fiber 树`称为 `workInProgress Fiber 树`。

`current Fiber 树`中的`Fiber 节点`被称为`current fiber`，`workInProgress Fiber 树`中的`Fiber 节点`被称为`workInProgress fiber`，他们通过 `alternate` 属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

`React` 应用的根节点通过 `current` 指针在不同 `Fiber 树`的 `rootFiber` 间切换来实现 `Fiber 树`的切换。

当 `workInProgress Fiber 树`构建完成交给 `Renderer` 渲染在页面上后，应用根节点的 `current` 指针指向 `workInProgress Fiber 树`，此时`workInProgress Fiber 树`就变为`current Fiber 树`。

每次状态更新都会产生新的 `workInProgress Fiber 树`，通过 `current` 与 `workInProgress` 的替换，完成 `DOM` 更新。

接下来我们以具体例子讲解 `mount` 时、`update` 时的构建/替换流程。

##### mount 时

考虑如下例子：

```js
function App() {
  const [num, add] = useState(0);
  return <p onClick={() => add(num + 1)}>{num}</p>;
}

ReactDOM.render(<App />, document.getElementById('root'));
```

1. 首次执行 `ReactDOM.render` 会创建 `fiberRootNode`（源码中叫 `fiberRoot`）和 `rootFiber`。其中 `fiberRootNode` 是整个应用的根节点，`rootFiber` 是 `<App/>` 所在组件树的根节点。

之所以要区分 `fiberRootNode` 与 `rootFiber`，是因为在应用中我们可以多次调用 `ReactDOM.render` 渲染不同的组件树，他们会拥有不同的 `rootFiber`。但是整个应用的根节点只有一个，那就是 `fiberRootNode`。

`fiberRootNode` 的 `current` 会指向当前页面上已渲染内容对应对 `Fiber 树`，被称为 `current Fiber 树`。

```js
fiberRootNode.current = rootFiber;
```

由于是首屏渲染，页面中还没有挂载任何 `DOM`，所以 `fiberRootNode.current` 指向的`rootFiber` 没有任何`子 Fiber 节点`（即 `current Fiber 树`为空）。

2. 接下来进入 `render 阶段`，根据组件返回的 `JSX` 在内存中依次创建 `Fiber 节点`并连接在一起构建`Fiber 树`，被称为 `workInProgress Fiber 树`。

在构建 `workInProgress Fiber 树`时会尝试复用 `current Fiber 树`中已有的 `Fiber 节点`内的属性，在`首屏渲染`时只有 `rootFiber` 存在对应的 `current fiber`（即 `rootFiber.alternate`）。

![workInProgressFiber](https://tva1.sinaimg.cn/large/008eGmZEgy1gmukrxx1bmj30jm0ofgln.jpg)

1. 图中右侧已构建完的`workInProgress Fiber树`在`commit阶段`渲染到页面。

此时`DOM`更新为右侧树对应的样子。`fiberRootNode`的`current`指针指向`workInProgress Fiber树`使其变为`current Fiber 树`。

##### update 时

1. 接下来我们点击 `p 节点`触发状态改变，这会开启一次新的 `render 阶段`并构建一棵新的`workInProgress Fiber 树`。

和 `mount` 时一样，`workInProgress fiber` 的创建可以复用 `current Fiber 树`对应的节点数据。

> 这个决定是否复用的过程就是 Diff 算法

2. `workInProgress Fiber 树`在 `render 阶段`完成构建后进入 `commit 阶段`渲染到页面上。渲染完毕后，`workInProgress Fiber 树`变为 `current Fiber 树`。

## render 阶段

`render 阶段` 开始于 `performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot` 方法的调用。这取决于本次更新是同步更新还是异步更新。

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

可以看到，他们唯一的区别是是否调用 `shouldYield`。如果当前浏览器帧没有剩余时间，`shouldYield` 会中止循环，直到浏览器有空闲时间后再继续遍历。

`workInProgress` 代表当前已创建的 `workInProgress fiber`。

`performUnitOfWork` 方法会创建下一个 `Fiber 节点` 并赋值给 `workInProgress`，并将 `workInProgress` 与已创建的 `Fiber节点` 连接起来构成 `Fiber树`。

我们知道`Fiber Reconciler`是从`Stack Reconciler`重构而来，通过遍历的方式实现可中断的递归，所以`performUnitOfWork`的工作可以分为两部分：**“递”**和**“归”**。

### “递”阶段

首先从 `rootFiber` 开始向下深度优先遍历。为遍历到的每个 `Fiber 节点` 调用 `beginWork` 方法。

该方法会根据传入的 `Fiber节点` 创建 `子Fiber节点`，并将这两个 `Fiber节点` 连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

### “归”阶段

在“归”阶段会调用 `completeWork` 处理 `Fiber 节点`。

当某个 `Fiber 节点` 执行完 `completeWork`，如果其存在 `兄弟 Fiber 节点`（即 `fiber.sibling !== null`），会进入其 `兄弟 Fiber` 的“递”阶段。

如果不存在 `兄弟 Fiber`，会进入 `父级 Fiber` 的“归”阶段。

“递”和“归”阶段会交错执行直到“归”到 `rootFiber`。至此，`render 阶段` 的工作就结束了。

### beginWork

> `beginWork` 的工作是传入当前 `Fiber 节点`，创建`子 Fiber 节点`

<img src="https://tva1.sinaimg.cn/large/008eGmZEgy1gmvoz423ubj30w00rb43o.jpg" alt="image-20210121223634526" style="zoom:150%;" />

#### 从传参看方法执行

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...省略函数体
}
```

其中传参：

- current：当前组件对应的 `Fiber 节点`在上一次更新时的 `Fiber 节点`，即 `workInProgress.alternate`
- workInProgress：当前组件对应的 `Fiber 节点`
- renderLanes：优先级相关，在讲解 `Scheduler` 时再讲解

我们知道，除 `rootFiber` 以外， 组件 `mount` 时，由于是首次渲染，是不存在当前组件对应的 `Fiber 节点`在上一次更新时的 `Fiber 节点`，即 `mount` 时 `current === null`。

组件 `update` 时，由于之前已经 `mount` 过，所以 `current !== null`。

所以我们可以通过 `current === null ?` 来区分组件是处于 `mount` 还是 `update`。

基于此原因，`beginWork` 的工作可以分为两部分：

- `update` 时：如果 `current` 存在，在满足一定条件时可以复用 `current` 节点，这样就能克隆 `current.child` 作为 `workInProgress.child`，而不需要新建 `workInProgress.child`。
- `mount` 时：除 `fiberRootNode` 以外，`current === null`。会根据 `fiber.tag` 不同，创建不同类型的 `子 Fiber 节点`

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    // ...省略

    // 复用current
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } else {
    didReceiveUpdate = false;
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    // ...省略
    case LazyComponent:
    // ...省略
    case FunctionComponent:
    // ...省略
    case ClassComponent:
    // ...省略
    case HostRoot:
    // ...省略
    case HostComponent:
    // ...省略
    case HostText:
    // ...省略
    // ...省略其他类型
  }
}
```

#### update 时

我们可以看到，满足如下情况时 `didReceiveUpdate === false`（即可以直接复用前一次更新的 `子 Fiber`，不需要新建 `子 Fiber`）

1. `oldProps === newProps && workInProgress.type === current.type`，即 `props` 与 `fiber.type` 不变
2. `!includesSomeLane(renderLanes, updateLanes)`，即当前 `Fiber 节点`优先级不够，会在讲解 `Scheduler` 时介绍

#### mount 时

当不满足优化路径时，我们就进入第二部分，新建 `子 Fiber`。

我们可以看到，根据 `fiber.tag` 不同，进入不同类型`Fiber`的创建逻辑。

> 可以从[这里 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactWorkTags.js)看到 `tag` 对应的组件类型

```js
// mount时：根据tag不同，创建不同的Fiber节点
switch (workInProgress.tag) {
  case IndeterminateComponent:
  // ...省略
  case LazyComponent:
  // ...省略
  case FunctionComponent:
  // ...省略
  case ClassComponent:
  // ...省略
  case HostRoot:
  // ...省略
  case HostComponent:
  // ...省略
  case HostText:
  // ...省略
  // ...省略其他类型
}
```

对于我们常见的组件类型，如（`FunctionComponent`/`ClassComponent`/`HostComponent`），最终会进入 `reconcileChildren` 方法。

#### reconcileChildren

从该函数名就能看出这是 `Reconciler` 模块的核心部分。那么他究竟做了什么呢？

- 对于 `mount` 的组件，他会创建新的 `子 Fiber 节点`
- 对于 `update` 的组件，他会将当前组件与该组件在上次更新时对应的 `Fiber 节点` 比较（也就是俗称的 `Diff` 算法），将比较的结果生成新 `Fiber 节点`

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes,
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

从代码可以看出，和 `beginWork` 一样，他也是通过 `current === null ?` 区分 `mount` 与 `update`。

不论走哪个逻辑，最终他会生成新的子 `Fiber 节点` 并赋值给 `workInProgress.child`，作为本次 `beginWork` 返回值，并作为下次 `performUnitOfWork` 执行时 `workInProgress` 的传参 。

> 注意
> 值得一提的是，`mountChildFibers` 与 `reconcileChildFibers` 这两个方法的逻辑基本一致。唯一的区别是：`reconcileChildFibers` 会为生成的 `Fiber 节点` 带上 `effectTag` 属性，而 `mountChildFibers` 不会。

#### effectTag

我们知道，`render` 阶段的工作是在内存中进行，当工作结束后会通知 `Renderer` 需要执行的 `DOM` 操作。要执行 `DOM` 操作的具体类型就保存在 `fiber.effectTag` 中。

比如：

```js
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

> 通过二进制表示 `effectTag`，可以方便的使用位操作为 `fiber.effectTag` 赋值多个 `effect`。

那么，如果要通知 `Renderer` 将 `Fiber 节点` 对应的 `DOM 节点` 插入页面中，需要满足两个条件：

1. `fiber.stateNode` 存在，即 `Fiber 节点` 中保存了对应的 `DOM 节点`
2. `(fiber.effectTag & Placement) !== 0`，即 `Fiber 节点` 存在 `Placement effectTag`

我们知道，`mount` 时，`fiber.stateNode === null`，且在 `reconcileChildren` 中调用的`mountChildFibers` 不会为 `Fiber 节点` 赋值 `effectTag`。那么首屏渲染如何完成呢？

针对第一个问题，`fiber.stateNode` 会在 `completeWork` 中创建。

第二个问题的答案十分巧妙：假设 `mountChildFibers` 也会赋值 `effectTag`，那么可以预见 `mount` 时整棵 `Fiber 树` 所有节点都会有 `Placement effectTag`。那么 `commit 阶段` 在执行 `DOM` 操作时每个节点都会执行一次插入操作，这样大量的 `DOM` 操作是极低效的。

为了解决这个问题，在 `mount` 时只有 `rootFiber` 会赋值 `Placement effectTag`，在 `commit 阶段` 只会执行一次插入操作。

### complateWork

![completeWork 流程图](https://tva1.sinaimg.cn/large/008eGmZEgy1gmxnkys2luj30y20u076s.jpg)

类似 `beginWork`，`completeWork` 也是针对不同 `fiber.tag` 调用不同的处理逻辑。

```js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      // ...省略
      return null;
    }
    case HostRoot: {
      // ...省略
      updateHostContainer(workInProgress);
      return null;
    }
    case HostComponent: {
      // ...省略
      return null;
    }
  // ...省略
```

我们重点关注页面渲染所必须的 `HostComponent`（即原生 `DOM 组件` 对应的 `Fiber 节点`），其他类型 `Fiber` 的处理留在具体功能实现时讲解。

#### 处理 HostComponent

和 `beginWork` 一样，我们根据 `current === null ?` 判断是 `mount` 还是 `update`。

同时针对 `HostComponent`，判断 `update` 时我们还需要考虑 `workInProgress.stateNode != null ?`（即该 `Fiber 节点` 是否存在对应的 `DOM 节点`）

```js
case HostComponent: {
  popHostContext(workInProgress);
  const rootContainerInstance = getRootHostContainer();
  const type = workInProgress.type;

  if (current !== null && workInProgress.stateNode != null) {
    // update的情况
    // ...省略
  } else {
    // mount的情况
    // ...省略
  }
  return null;
}
```

#### update 时

当 `update` 时，`Fiber 节点` 已经存在对应 `DOM 节点`，所以不需要生成 `DOM 节点`。需要做的主要是处理 `props`，比如：

- `onClick`、`onChange` 等回调函数的注册
- 处理 `style prop`
- 处理 `DANGEROUSLY_SET_INNER_HTML prop`
- 处理 `children prop`

我们去掉一些当前不需要关注的功能（比如 `ref`）。可以看到最主要的逻辑是调用 `updateHostComponent` 方法。

```js
if (current !== null && workInProgress.stateNode != null) {
  // update的情况
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );
}
```

在 `updateHostComponent` 内部，被处理完的 `props` 会被赋值给 `workInProgress.updateQueue`，并最终会在 `commit 阶段` 被渲染在页面上。

```ts
workInProgress.updateQueue = (updatePayload: any);
```

其中 `updatePayload` 为数组形式，他的**奇数索引**的值为变化的 `prop key`，**偶数索引**的值为变化的 `prop value`。

#### mount 时

同样，我们省略了不相关的逻辑。可以看到，`mount` 时的主要逻辑包括三个：

- 为 `Fiber 节点` 生成对应的 `DOM 节点`
- 将子孙 `DOM 节点` 插入刚生成的 `DOM 节点` 中
- 与 `update` 逻辑中的 `updateHostComponent` 类似的处理 `props` 的过程

```js
// mount的情况

// ...省略服务端渲染相关逻辑

const currentHostContext = getHostContext();
// 为fiber创建对应DOM节点
const instance = createInstance(
  type,
  newProps,
  rootContainerInstance,
  currentHostContext,
  workInProgress,
);
// 将子孙DOM节点插入刚生成的DOM节点中
appendAllChildren(instance, workInProgress, false, false);
// DOM节点赋值给fiber.stateNode
workInProgress.stateNode = instance;

// 与update逻辑中的updateHostComponent类似的处理props的过程
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
  )
) {
  markUpdate(workInProgress);
}
```

`mount` 时只会在 `rootFiber` 存在 `Placement effectTag`。那么 `commit 阶段` 是如何通过一次插入 `DOM` 操作（对应一个 `Placement effectTag`）将整棵 `DOM 树` 插入页面的呢？

原因就在于 `completeWork` 中的 `appendAllChildren` 方法。

由于 `completeWork` 属于“归”阶段调用的函数，每次调用 `appendAllChildren` 时都会将已生成的子孙 `DOM 节点` 插入当前生成的 `DOM 节点` 下。那么当“归”到 `rootFiber` 时，我们已经有一个构建好的离屏 `DOM 树`。

#### effectList

至此 `render 阶段` 的绝大部分工作就完成了。

还有一个问题：作为 `DOM` 操作的依据，`commit 阶段` 需要找到所有有 `effectTag` 的 `Fiber 节点` 并依次执行 `effectTag` 对应操作。难道需要在 `commit 阶段` 再遍历一次 `Fiber 树` 寻找 `effectTag !== null` 的 `Fiber 节点` 么？

这显然是很低效的。

为了解决这个问题，在 `completeWork` 的上层函数 `completeUnitOfWork` 中，每个执行完 `completeWork` 且存在 `effectTag` 的 `Fiber 节点` 会被保存在一条被称为`effectList` 的单向链表中。

`effectList` 中第一个 `Fiber 节点` 保存在 `fiber.firstEffect`，最后一个元素保存在 `fiber.lastEffect`。

类似 `appendAllChildren`，在“归”阶段，所有有 `effectTag` 的 `Fiber 节点` 都会被追加在 `effectList` 中，最终形成一条以 `rootFiber.firstEffect` 为起点的单向链表。

```js
                       nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
```

这样，在`commit阶段`只需要遍历`effectList`就能执行所有`effect`了。

借用 `React` 团队成员 **Dan Abramov** 的话：`effectList` 相较于 `Fiber 树`，就像圣诞树上挂的那一串彩灯。

#### 流程结尾

至此，`render 阶段` 全部工作完成。在 `performSyncWorkOnRoot` 函数中 `fiberRootNode` 被传递给 `commitRoot` 方法，开启 `commit 阶段` 工作流程。
