# React 相关

## 基础问题

### 1. setState 是异步还是同步的

#### （1）通常情况下，setState 是异步更新的

setState 通过一个**队列机制**来实现 state 更新，当执行 setState() 时，会将需要更新的 state **浅合并**后放入 状态队列，而不会立即更新 state，队列机制可以高效的**批量更新** state。而如果不通过 setState，直接修改 this.state 的值，则不会放入状态队列，当下一次调用 setState 对状态队列进行合并时，之前对 this.state 的修改将会被忽略，造成无法预知的错误。

#### （2）在 `setTimeout`  和原生事件中可以直接获取最新 state

`setTimeout` 中调用以及原生事件中调用的话，是可以立马获取到最新的 state 的。根本原因在于，setState 并不是真正意义上的异步操作，它只是模拟了异步的行为。React 中会去维护一个标识（`isBatchingUpdates`），判断是直接更新还是先暂存 state 进队列。`setTimeout`以及原生事件都会直接去更新 state，因此可以立即得到最新 state。而合成事件和 React 生命周期函数中，是受 React 控制的，其会将`isBatchingUpdates`设置为 `true`，从而走的是类似异步的那一套。<br />

### 2. setState 批任务更新的时机

会有一个任务队列，大概在 render 之前

### 3. setState 可以接受函数作为参数吗？有什么作用？

可以。

主要作用是：由于 setState 是异步更新的，依赖于 state 和 props 对值进行更新时可能会出现问题，因此可以使用函数，这个函**数用上一个 state 作为第一个参数**，将**此次更新被应用时的 props 做为第二个参数**，如下所示：

```javascript
this.setState((state, props) => ({
  count: state.count + props.count,
}));
```

### 4. 什么是高阶组件（HOC）？适用于什么场景？

具体而言，**高阶组件是参数为组件，返回值为新组件的函数**，用于**提取组件的公共逻辑**

特点：

- 高阶组件（HOC）应该是无副作用的纯函数，且不应该修改原组件
- 高阶组件（HOC）不关心你传递的数据（props）是什么，并且被包装组件不关心数据来源
- 高阶组件（HOC）接收到的 props 应该透传给被包装组件

### 5. React 组件做过什么优化？

- 使用唯一的键值迭代
- 不在 `render` 中处理数据
- 不必要的标签，使用 `React.Fragments`
- `suspence` 与 `lazy` 做懒加载动态组件

### 6. React 事件机制是怎样的？

**合成事件**： 我们在 JSX 中书写的事件都是合成事件（SyntheticEvent），它将浏览器的原生事件进行了跨浏览器的包装。

1. 当我们在组件上设置事件处理器时，React 并不会在该 DOM 元素上直接绑定事件处理器，而是在 React 内部自定义一套事件系统，在这个系统上进行统一的事件订阅和分发
2. React 利用事件委托机制在 Document 上统一监听 DOM 事件，再根据触发的 `target` 将事件分发到具体的组件实例，实际我们在事件里面拿到的 `event` 其实并不是原始的 DOM 事件对象，而是一个合成事件对象

### 6.1 为什么它要定义一套事件体系？

1. 抹平不同浏览器之间的兼容性差异。最主要的动机。
2. 事件"合成"，即事件自定义。事件合成既可以处理兼容性问题，也可以用来自定义事件（例如 React 的 onChange 事件）。
3. 提供一个抽象跨平台事件机制。类似 VirtualDOM 抽象了跨平台的渲染方式，合成事件（SyntheticEvent）提供一个抽象的跨平台事件机制。
4. 可以做更多优化。例如利用事件委托机制，几乎所有事件的触发都代理到了 document，而不是 DOM 节点本身，简化了 DOM 事件处理逻辑，减少了内存开销。（React 自身模拟了一套事件冒泡的机制）
5. 可以干预事件的分发。V16 引入 Fiber 架构，React 可以通过干预事件的分发以优化用户的交互体验

### 7. 说下 react 的生命周期

React 16 之前：

- Mounting 挂载

  - **componentWillMount**：在组件即将挂载到页面前执行（react-16 后 unsafe，17 后正式废弃）
  - **执行 render 函数**挂载组件
  - **componentDidMount**：在组件挂载到页面后执行

- Updating 更新

  - **componentWillReceiveProps**：当一个组件从父组件接收参数时使用，只要父组件的 **render** 函数重新执行，子组件的这个生命周期函数就会执行（react-16 后 unsafe，17 后正式废弃）
  - **shouldComponentUpdate**：组件即将变更前执行，返回一个**布尔值**决定是否更新组件
  - **componentWillUpdate**：在组件更新前执行（react-16 后 unsafe，17 后正式废弃）
  - **执行 render 函数**更新组件
  - **componentDidUpdate**：在组件更新后执行

- Unmounting 卸载：
  - **componentWillUnmount**：当组件即将被从页面中剔除时执行

**16.3**:

- 以下生命周期函数不再推荐使用，因此添加别名：
  - `UNSAFE_componentWillMount`
  - `UNSAFE_componentWillReceiveProps`
  - `UNSAFE_componentWillUpdate`
- 引入两个新的生命周期：
  - 静态方法 `getDerivedStateFromProps`
  - `getSnapshotBeforeUpdate`

**react-17**：正式废弃了 `componentWillMount()` 、 `componentWillReceiveProps()`  和 `componentWillUpdate()`  这三个生命周期方法。

### 8. 新版本的 React 增加了什么

- Time Slicing（解决 CPU 速度问题）使得在执行任务的期间可以随时暂停，跑去干别的事情，这个特性使得 react 能在性能极其差的机器跑时，仍然保持有良好的性能
- Suspense（解决网络 IO 问题）和 lazy 配合，实现异步加载组件。 能暂停当前组件的渲染, 当完成某件事以后再继续渲染，解决从 react 出生到现在都存在的「异步副作用」的问题，而且解决得非常的优雅，使用的是「异步但是同步的写法」
- 此外，还提供了一个内置函数 componentDidCatch，当有错误发生时, 我们可以友好地展示 fallback 组件；可以捕捉到它的子元素（包括嵌套子元素）抛出的异常；可以复用错误组件。

### 9. 受控组件和非受控组件有什么区别？

在 HTML 文档中，许多表单元素（例如`<select>、<textrarea>、<input>`）都保持自己的状态。不受控制的组件将 DOM 视为这些输入状态的真实源。在受控组件中，内部状态用于跟踪元素值。当输入值改变时，React 会重新渲染输入。
在与非 React 代码集成时，不受控制的组件非常有用（例如，如果您需要支持某种 jQuery 表单插件）。

### 10. shallowEqual 的实现

在学习 react PureComponent 的时候，看到有一句话，由于 PureComponent 的 shouldeComponentUpdate 里，实际是对 props/state 进行了一个浅对比，所以对于嵌套的对象不适用，没办法比较出来。那什么是浅对比呢，为什么对于嵌套的对象就不适用了呢？

```
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(inst.state, nextState);
}
```

当对比的类型为 `Object` 的时候并且key的长度相等的时候，浅比较也仅仅是用 `Object.is()` 对 `Object` 的 value 做了一个基本数据类型的比较，所以如果 key 里面是对象的话，有可能出现比较不符合预期的情况，所以浅比较是不适用于嵌套类型的比较的。

### 11. 什么是 render prop 的组件

术语“render prop” 是指一种技术，用于使用一个值为函数的prop 在React 组件之间的代码共享。 带有渲染属性(Render Props)的组件需要一个返回React 元素并调用它的函数，而不是实现自己的渲染逻辑。 使用render props 的库包括React Router 和Downshift。

### 12. React 中函数组件和普通组件有什么区别

两者最明显的不同就是在语法上，函数组件是一个纯函数，它接收一个 props 对象返回一个 react 元素。 而类组件需要去继承 React.Component 并且创建 render 函数返回 react 元素，这将会要更多的代码，虽然它们实现的效果相同

### 虚拟 DOM

### 1. 写 React/ Vue 项目时为什么要在列表组件中写 key，其作用是什么

vue 和 react 都是**采用 diff 算法来对比新旧虚拟节点**，从而更新节点。

在 vue 的 diff 函数中，在交叉对比中，当新节点跟旧节点**头尾交叉对比**没有结果时，会根据新节点的 key 去对比旧节点数组中的 key，从而找到相应旧节点（这里对应的是一个 key => index 的 map 映射）。如果没找到就认为是一个新增节点。而如果没有 key，那么就会采用**遍历查找**的方式去找到对应的旧节点。

一种是 map 映射，另一种是遍历查找，相比而言，**map 映射的速度更快**。

### 2. react diff 算法怎么实现的

主要通过三大策略

- tree diff 跨层级重新创建
- component diff，如果是同一类型的组件，按照原策略继续比较 virtual DOM tree。如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。或者通过 shouldComponentUpdate 来判断是否需要 diff
- element diff，允许开发者对同一层级的同组子节点，添加唯一 key 进行区分，**INSERT_MARKUP**（插入）、**MOVE_EXISTING**（移动）和  **REMOVE_NODE**（删除）

### react-fiber

背景：

- react 在进行组件渲染时，从 setState 开始到渲染完成整个过程是同步的（“一气呵成”）。如果需要渲染的组件比较庞大，js 执行会占据主线程时间较长，会导致页面响应度变差，使得 react 在动画、手势等应用中效果比较差。
- 页面卡顿：Stack reconciler 的工作流程很像函数的调用过程。父组件里调子组件，可以类比为函数的递归；对于特别庞大的 vDOM 树来说，reconciliation 过程会很长(x00ms)，超过 16ms,在这期间，主线程是被 js 占用的，因此任何交互、布局、渲染都会停止，给用户的感觉就是页面被卡住了。

旧版 React 通过递归的方式进行渲染，使用的是 JS 引擎自身的函数调用栈，它会一直执行到栈空为止。而 Fiber 实现了自己的组件调用栈，它以链表的形式遍历组件树，可以灵活的暂停、继续和丢弃执行的任务。实现方式是使用了浏览器的 requestIdleCallback 这一 API。<br />

## Hooks

### 1. Hooks 的好处是什么？

- 不需要基于 Class 的组件、生命周期钩子和 this 关键字
- 通过将公共函数抽象到自定义 Hooks 中，使重用逻辑变得更容易
- 通过能够将逻辑与组件本身分离出来，使代码更具可读性和可测试性

### 2. 请说出几个常用的 Hooks

- useState
- useMemo
- useCallback
- useEffect 等

### 3. 如何通过 hooks 模拟 React 生命周期？

可以通过 useEffect 来模拟，改变依赖的方式，依赖设置成空数组，模拟 didMount 等

### 4. hook 有什么缺点，hook 代码难维护怎么解决？

这种开放性和经验积累的题目真的是最难的，平时大家知道标准答案的题目和这种对比起来，没得比的。这个需要团队的积累，我们这边暂时没什么很大问题，所以感受不到。最基本的，eslint 一定要开启，不然会莫名其妙的 dep 导致更新。其次是根据情况来说一下，function 的场景

### 5. useCallback 和 useMemo 有什么区别？

- useCallback 缓存函数的引用，一般用于子组件渲染
- useMemo 缓存计算数据的值，计算量密集型

### 6. 为什么不能在 if 条件或者 for 循环中写 hooks？

因为 react 内部是用一个链表来维护 hooks，要不然 react 没办法把两次 render 的 hooks 对应起来

## Redux

### 1. Redux 和 Mobx 区别

mobx 与 redux 的功能相似，mobx 的实现思想和 Vue 几乎一样，所以其优点跟 Vue 也差不多：通过监听数据（对象、数组）的属性变化，可以通过直接在数据上更改就能触发 UI 的渲染，从而做到 MVVM、响应式、上手成本低、开发效率高

- redux 将数据保存在单一的 store 中；mobx 将数据保存在分散的多个 store 中
- redux 使用 plain object 保存数据，需要手动处理变化后的操作；mobx 使用 observable 保存数据，数据变化后自动处理响应的操作
- redux 使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数；mobx 中的状态是可变的，可以直接对其进行修改
- mobx 相对来说比较简单，在其中有很多的抽象，mobx 更多的使用面向对象的编程思维；redux 会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
- mobx 中有更多的抽象和封装，调试会比较困难，同时结果也难以预测；而 redux 提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易；

#### 2. Redux 三大原则

- 单一数据源 : 整个应用的 `state` 都存储在一颗 state tree 中，并且只存在与唯一一个 store 中
- state 是只读的 : 唯一改变 state 的方法只能通过触发 `action`，然后通过 action 的 `type` 进而分发 dispatch 。不能直接改变应用的状态
- 状态修改均由纯函数完成 : 为了描述 action 如何改变 state tree，需要编写 `reducers`

### 3. Redux 设计思想

它将整个应用状态存储到 `store` 里面，组件可以派发（ `dispatch` ）修改数据（ `state` ）的行为（ `action` ）给 `store` ， `store` 内部修改之后，其他组件可以通过订阅（ `subscribe` ）中的状态 `state` å来刷新（ `render` ）自己的视图。