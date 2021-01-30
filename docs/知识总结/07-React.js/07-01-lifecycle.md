# 生命周期函数

> 生命周期函数指在某一个时刻会自动执行的函数，其中 **render 函数**是不可缺少的

## 生命周期演变

### react-15 版本的生命后期

![img](https://tva1.sinaimg.cn/large/0081Kckwgy1gm2epz8ic3j319q0qodjg.jpg)

### react-16 的生命周期

#### react-16.3 的生命周期变更

- 以下生命周期函数不再推荐使用，因此添加别名：
  - `UNSAFE_componentWillMount`
  - `UNSAFE_componentWillReceiveProps`
  - `UNSAFE_componentWillUpdate`
- 引入两个新的生命周期：
  - 静态方法 `getDerivedStateFromProps`
  - `getSnapshotBeforeUpdate`

#### react-16.4 的生命周期变更

这与 16.3 版本的唯一区别是静态方法 `getDerivedStateFromProps()` 除了在初始化和 props 更新时触发的基础上，增加了 state 更新和 `forceUpdate()` 时也可以触发此方法。如下图所示

![img](https://tva1.sinaimg.cn/large/0081Kckwgy1gm2erelcijj315s0nqwh9.jpg)

#### react-17 版本

react-17 版本则正式废弃了 `componentWillMount()`、`componentWillReceiveProps()` 和 `componentWillUpdate()` 这三个生命周期方法。

## Mounting 挂载

- **componentWillMount**：在组件即将挂载到页面前执行（react-16 后 unsafe，17 后正式废弃）
- **执行 render 函数**挂载组件
- **componentDidMount**：在组件挂载到页面后执行

## Updating 更新

- **componentWillReceiveProps**：当一个组件从父组件接收参数时使用，只要父组件的 **render** 函数重新执行，子组件的这个生命周期函数就会执行（react-16 后 unsafe，17 后正式废弃）
- **shouldComponentUpdate**：组件即将变更前执行，返回一个**布尔值**决定是否更新组件
- **componentWillUpdate**：在组件更新前执行（react-16 后 unsafe，17 后正式废弃）
- **执行 render 函数**更新组件
- **componentDidUpdate**：在组件更新后执行

## Unmounting 卸载

- **componentWillUnmount**：当组件即将被从页面中剔除时执行

## 新增方法

### getDerivedStateFromProps

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps()` 会在调用 render 方法之前调用，并且**在初始挂载及后续更新时都会被调用**。它应返回一个对象来更新 state，如果返回 `null` 则不更新任何内容。

此方法适用 state 的值在任何时候都取决于 props 的情况。

> **请注意，不管原因是什么，都会在每次渲染前触发此方法**

### getSnapshotBeforeUpdate

```js
getSnapshotBeforeUpdate(prevProps, prevState);
```

`getSnapshotBeforeUpdate()` 在最近一次渲染输出（提交到 DOM 节点）之前调用，它使得组件能在发生更改之前从 DOM 中捕获一些信息（比如，滚动位置）。

此生命周期的任何返回值将作为参数转递给 `componentDidUpdate()` 。此方法并不常用，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。
