# React 相关

## 基础问题
### 1. setState 是异步还是同步的

#### （1）通常情况下，setState 是异步更新的
setState 通过一个**队列机制**来实现 state 更新，当执行 setState() 时，会将需要更新的 state **浅合并**后放入 状态队列，而不会立即更新 state，队列机制可以高效的**批量更新** state。而如果不通过setState，直接修改this.state 的值，则不会放入状态队列，当下一次调用 setState 对状态队列进行合并时，之前对 this.state 的修改将会被忽略，造成无法预知的错误。
#### （2）在 `setTimeout` 和原生事件中可以直接获取最新 state
`setTimeout` 中调用以及原生事件中调用的话，是可以立马获取到最新的state的。根本原因在于，setState并不是真正意义上的异步操作，它只是模拟了异步的行为。React中会去维护一个标识（`isBatchingUpdates`），判断是直接更新还是先暂存state进队列。`setTimeout`以及原生事件都会直接去更新state，因此可以立即得到最新state。而合成事件和React生命周期函数中，是受React控制的，其会将`isBatchingUpdates`设置为 `true`，从而走的是类似异步的那一套。<br />

### 2. setState批任务更新的时机
会有一个任务队列，大概在render之前

### 什么是高阶组件？

- 高阶组件(HOC)应该是无副作用的纯函数，且不应该修改原组件<br />
- 高阶组件(HOC)不关心你传递的数据(props)是什么，并且被包装组件不关心数据来源<br />
- 高阶组件(HOC)接收到的 props 应该透传给被包装组件<br />

### 虚拟 DOM
TBD

### React 16 之前的生命周期
#### Mounting 挂载：

- **componentWillMount**：在组件即将挂载到页面前执行（react-16 后 unsafe，17 后正式废弃）
- **执行 render 函数**挂载组件
- **componentDidMount**：在组件挂载到页面后执行
#### Updating 更新：

- **componentWillReceiveProps**：当一个组件从父组件接收参数时使用，只要父组件的 **render** 函数重新执行，子组件的这个生命周期函数就会执行（react-16 后 unsafe，17 后正式废弃）
- **shouldComponentUpdate**：组件即将变更前执行，返回一个**布尔值**决定是否更新组件
- **componentWillUpdate**：在组件更新前执行（react-16 后 unsafe，17 后正式废弃）
- **执行 render 函数**更新组件
- **componentDidUpdate**：在组件更新后执行
#### Unmounting 卸载：

- **componentWillUnmount**：当组件即将被从页面中剔除时执行


### React 16 之后的生命周期变更
**16.3: **

- 以下生命周期函数不再推荐使用，因此添加别名：
   - `UNSAFE_componentWillMount`
   - `UNSAFE_componentWillReceiveProps`
   - `UNSAFE_componentWillUpdate`
- 引入两个新的生命周期：
   - 静态方法 `getDerivedStateFromProps`
   - `getSnapshotBeforeUpdate`


<br />**react-17** 版本则正式废弃了 `componentWillMount()` 、 `componentWillReceiveProps()`  和 `componentWillUpdate()`  这三个生命周期方法。

### react diff算法怎么实现的
主要通过三大策略

- tree diff 跨层级重新创建
- component diff，如果是同一类型的组件，按照原策略继续比较 virtual DOM tree。如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。或者通过shouldComponentUpdate来判断是否需要diff
- element diff，允许开发者对同一层级的同组子节点，添加唯一 key 进行区分，**INSERT_MARKUP**（插入）、**MOVE_EXISTING**（移动）和 **REMOVE_NODE**（删除）

### 新版本的React增加了什么

- Time Slicing（解决CPU速度问题）使得在执行任务的期间可以随时暂停，跑去干别的事情，这个特性使得react能在性能极其差的机器跑时，仍然保持有良好的性能
- Suspense （解决网络IO问题）和lazy配合，实现异步加载组件。 能暂停当前组件的渲染, 当完成某件事以后再继续渲染，解决从react出生到现在都存在的「异步副作用」的问题，而且解决得非常的优雅，使用的是「异步但是同步的写法」
- 此外，还提供了一个内置函数 componentDidCatch，当有错误发生时, 我们可以友好地展示 fallback 组件；可以捕捉到它的子元素（包括嵌套子元素）抛出的异常；可以复用错误组件。

### react-fiber
背景：

- react在进行组件渲染时，从setState开始到渲染完成整个过程是同步的（“一气呵成”）。如果需要渲染的组件比较庞大，js执行会占据主线程时间较长，会导致页面响应度变差，使得react在动画、手势等应用中效果比较差。
- 页面卡顿：Stack reconciler的工作流程很像函数的调用过程。父组件里调子组件，可以类比为函数的递归；对于特别庞大的vDOM树来说，reconciliation过程会很长(x00ms)，超过16ms,在这期间，主线程是被js占用的，因此任何交互、布局、渲染都会停止，给用户的感觉就是页面被卡住了。

旧版 React 通过递归的方式进行渲染，使用的是 JS 引擎自身的函数调用栈，它会一直执行到栈空为止。而Fiber实现了自己的组件调用栈，它以链表的形式遍历组件树，可以灵活的暂停、继续和丢弃执行的任务。实现方式是使用了浏览器的requestIdleCallback这一 API。<br />

## Hooks
### Hooks 的好处

- 不需要基于 Class 的组件、生命周期钩子和 this 关键字
- 通过将公共函数抽象到自定义 Hooks 中，使重用逻辑变得更容易
- 通过能够将逻辑与组件本身分离出来，使代码更具可读性和可测试性

### 常用的Hooks

- useState
- useMemo
- useCallback
- useEffect等

### 如何通过hooks模拟React生命周期
可以通过useEffect来模拟，改变依赖的方式，依赖设置成空数组，模拟didMount等

### hook缺点，hook代码难维护怎么解决【描述】
这种开放性和经验积累的题目真的是最难的，平时大家知道标准答案的题目和这种对比起来，没得比的。这个需要团队的积累，我们这边暂时没什么很大问题，所以感受不到。最基本的，eslint一定要开启，不然会莫名其妙的dep导致更新。其次是根据情况来说一下，function的场景

### useCallback 和 useMemo 区别

- useCallback缓存函数的引用，一般用于子组件渲染
- useMemo缓存计算数据的值，计算量密集型

### 为什么不能在 if 条件或者 for 循环中写 hooks
因为 react 内部是用一个链表来维护 hooks，要不然 react 没办法把两次 render 的 hooks 对应起来

### React组件做过什么优化

- 使用唯一的键值迭代
- 不在render中处理数据
- 不必要的标签，使用React.Fragments
- suspence与lazy做懒加载动态组件

<br />
### 写 React/ Vue 项目时为什么要在列表组件中写 key，其作用是什么

<br />vue 和 react 都是**采用 diff 算法来对比新旧虚拟节点**，从而更新节点。<br />
<br />在 vue 的 diff 函数中，在交叉对比中，当新节点跟旧节点**头尾交叉对比**没有结果时，会根据新节点的 key 去对比旧节点数组中的 key，从而找到相应旧节点（这里对应的是一个key => index 的 map 映射）。如果没找到就认为是一个新增节点。而如果没有 key，那么就会采用**遍历查找**的方式去找到对应的旧节点。<br />
<br />一种是 map 映射，另一种是遍历查找，相比而言，**map 映射的速度更快**。

###  受控组件和非受控组件有什么区别？
在 HTML 文档中，许多表单元素（例如`<select>、<textrarea>、<input>`）都保持自己的状态。不受控制的组件将 DOM 视为这些输入状态的真实源。在受控组件中，内部状态用于跟踪元素值。当输入值改变时，React 会重新渲染输入。<br />在与非 React 代码集成时，不受控制的组件非常有用（例如，如果您需要支持某种 jQuery 表单插件）。


### 前端性能优化做过哪些

- 制定开发规范，js lint、css lint等，统一，做好打包、构建等工具链
- js异步加载、公有文件请求CDN，压缩混淆，预加载资源等
- 合理利用浏览器缓存，做了些离线缓存
- 减少网络请求次数
- 减小文件体积

### Redux和Mobx区别
mobx与redux的功能相似，mobx的实现思想和Vue几乎一样，所以其优点跟Vue也差不多：通过监听数据（对象、数组）的属性变化，可以通过直接在数据上更改就能触发UI的渲染，从而做到MVVM、响应式、上手成本低、开发效率高

- redux将数据保存在单一的store中；mobx将数据保存在分散的多个store中
- redux使用plain object保存数据，需要手动处理变化后的操作；mobx使用observable保存数据，数据变化后自动处理响应的操作
- redux使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数；mobx中的状态是可变的，可以直接对其进行修改
- mobx相对来说比较简单，在其中有很多的抽象，mobx更多的使用面向对象的编程思维；redux会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
- mobx中有更多的抽象和封装，调试会比较困难，同时结果也难以预测；而redux提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易；

#### Redux三大原则

- 单一数据源 : 整个应用的 `state` 都存储在一颗 state tree 中，并且只存在与唯一一个 store 中<br />
- state 是只读的 : 唯一改变 state 的方法只能通过触发 `action`，然后通过 action 的 `type` 进而分发 dispatch 。不能直接改变应用的状态<br />
- 状态修改均由纯函数完成 : 为了描述 action 如何改变 state tree，需要编写 `reducers`<br />


