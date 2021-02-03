# 动画

通常我们在前端实现动画效果的几种主要实现方式如下：

- JavaScript：通过定时器（**setTimeout** 和 **setIterval**）来间隔来改变元素样式，或者使用**requestAnimationFrame**；
- CSS3：**transition** 和 **animation**；
- HTML5：使用 HTML5 提供的绘图方式（**canvas**、**svg**、**webgl**）；

## requestAnimationFrame

`requestAnimationFrame` 是浏览器用于定时循环操作的一个接口，类似于 setTimeout，主要用途是按帧对网页进行重绘。

设置这个 API 的目的是**为了让各种网页动画效果（DOM 动画、Canvas 动画、SVG 动画、WebGL 动画）能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果**。代码中使用这个 API，就是告诉浏览器希望执行一个动画，让浏览器在下一个动画帧安排一次网页重绘。

`requestAnimationFrame` 使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用，由于功效只是一次性的，所以想实现连续的动效，需要**递归调用**。

```js
window.requestAnimationFrame(callback);
```

- callback：下一次重绘之前更新动画帧所调用的函数，callback 仅有一个参数，为 `DOMHighResTimeStamp` 参数，表示 `requestAnimationFrame()` 开始执行回调函数的时刻。
- 返回值：一个 long 类型整数，唯一标志元组在列表中的位置，你可以传这个值给 `cancelAnimationFrame()` 以取消动画。

在使用和实现上， `requestAnimationFrame` 与 `setTimeout` 类似。我们看个例子：

```js
let count = 0;
let rafId = null;
// requestAnimationFrame 调用该函数时，自动传入的一个时间
function requestAnimation(time) {
  console.log(time); // 打印执行requestAnimation函数的时刻
  // 动画没有执行完，则递归渲染
  if (count < 10) {
    count++;
    // 渲染下一帧
    rafId = window.requestAnimationFrame(requestAnimation);
  }
}
// 渲染第一帧
window.requestAnimationFrame(requestAnimation);
```

### requestAnimationFrame 的执行

1. 首先判断 `document.hidden` 属性是否可见（`true`），可见状态下才能继续执行以下步骤
2. 浏览器清空上一轮的动画函数
3. `requestAnimationFrame` 将回调函数追加到动画帧请求回调函数列表的末尾

> 我们需要注意的是：当执行 `requestAnimationFrame(callback)` 的时候，不会立即调用 callback 回调函数，只是将其放入回调函数队列而已，同时注意，每个 callback 回调函数都有一个 `cancelled` 标志符，初始值为 `false，并对外不可见。

4. 当页面可见并且动画帧请求 callback 回调函数列表不为空时，浏览器会定期将这些回调函数加入到浏览器 UI 线程的队列中（由系统来决定回调函数的执行时机）。当浏览器执行这些 callback 回调函数的时候，会判断每个元组的 callback 的 `cancelled` 标志符，只有 `cancelled` 为 `false` 时，才执行 callback 回调函数。

### requestAnimationFrame 优点

1. `requestAnimationFrame` 自带函数**节流**功能，采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间的过短，造成过度绘制，增加页面开销，也不会因为间隔时间过长，造成动画卡顿，不流程，影响页面美观

- 浏览器的重绘频率一般会和显示器的刷新率保持同步。大多数采用 W3C 规范，浏览器的渲染页面的标准频率也为 60 FPS（frames/per second）即每秒重绘 60 次，`requestAnimationFrame` 的基本思想是**让页面重绘的频率和刷新频率保持同步**，即每 1000ms / 60 = 16.7ms 执行一次。
- 通过 `requestAnimationFrame` 调用回调函数引起的页面重绘或回流的时间间隔和显示器的刷新时间间隔相同。所以 `requestAnimationFrame` 不需要像 `setTimeout` 那样传递时间间隔，而是浏览器通过系统获取并使用显示器刷新频率。例如在某些高频事件（resize，scroll 等）中，使用 `requestAnimationFrame` **可以防止在一个刷新间隔内发生多次函数执行**，这样保证了流程度，也节省了开销

2. 该函数的**延时效果是精确**的，没有 `setTimeout` 或 `setInterval` 不准的情况

- `setTimeout` 的执行只是在内存中对图像属性进行改变，这个改变必须要等到下次浏览器重绘时才会被更新到屏幕上。如果和屏幕刷新步调不一致，就可能导致中间某些帧的操作被跨越过去，直接更新下下一帧的图像。即**掉帧**
- 使用 `requestAnimationFrame` 执行动画，最大优势是**能保证回调函数在屏幕每一次刷新间隔中只被执行一次**，这样就不会引起丢帧，动画也就不会卡顿

3. **节省资源，节省开销**

- 在之前介绍 `requestAnimationFrame` 执行过程，我们知道只有当页面激活的状态下，页面刷新任务才会开始，才执行 `requestAnimationFrame`，当页面隐藏或最小化时，会被暂停，页面显示，会继续执行。节省了 CPU 开销。

4. 能够在动画流刷新之后执行，即**上一个动画流会完整执行**

### requestAnimationFrame 实现 setInterval 及 setTimeout

这个问题就比较容易考察到，我们可以使用 `requestAnimationFrame` 实现 setInterval 及 setTimeout。

下面是 setInterval 实现

```js
// setInterval 实现
function setInterval(callback, interval) {
  let timer;
  const now = Date.now;
  let startTime = now();
  let endTime = startTime;
  const loop = () => {
    timer = window.requestAnimationFrame(loop);
    endTime = now();
    if (endTime - startTime >= interval) {
      startTime = endTime = now();
      callback(timer);
    }
  };
  timer = window.requestAnimationFrame(loop);
  return timer;
}

let a = 0;
setInterval(timer => {
  console.log(a);
  a++;
  if (a === 3) window.cancelAnimationFrame(timer);
}, 1000);
// 0
// 1
// 2
```

下面是 setTimeout 实现：

```js
// setTimeout 实现
function setTimeout(callback, interval) {
  let timer;
  const now = Date.now;
  let startTime = now();
  let endTime = startTime;
  const loop = () => {
    timer = window.requestAnimationFrame(loop);
    endTime = now();
    if (endTime - startTime >= interval) {
      callback(timer);
      window.cancelAnimationFrame(timer);
    }
  };
  timer = window.requestAnimationFrame(loop);
  return timer;
}

let a = 0;
setTimeout(timer => {
  console.log(a);
  a++;
}, 1000);
// 0
```

## CSS3

### Transition

CSS 中的 transition 属性**允许块级元素中的属性在指定的时间内平滑的改变**，简单看下其语法规则：

```css
transition: property duration timing-function delay;
```

具体属性值介绍如下：

| 值                         | 描述                                                                                            |
| -------------------------- | :---------------------------------------------------------------------------------------------- |
| transition-property        | 规定设置过渡效果的 CSS 属性的名称。（none / all / property）                                    |
| transition-duration        | 规定完成过渡效果需要多少秒或毫秒。                                                              |
| transition-timing-function | 规定速度效果的速度曲线。（linear、ease、ease-in、ease-out、ease-in-out、cubic-bezier(n,n,n,n)） |
| transition-delay           | 定义过渡效果何时开始。                                                                          |

### Animation

类似的 CSS 还提供了一个 Animation 属性，不过区别于 Transition，Animation 作用于元素本身而不是样式属性，可以使用关键帧的概念，应该说可以实现更自由的动画效果。

```css
animation: name duration timing-function delay iteration-count direction;
```

具体属性值介绍如下：

| 值                        | 描述                                                                                        |
| ------------------------- | :------------------------------------------------------------------------------------------ |
| animation-name            | 规定需要绑定到选择器的 keyframe 名称。（keyframename、none）                                |
| animation-duration        | 规定完成动画所花费的时间，以秒或毫秒计。                                                    |
| animation-timing-function | 规定动画的速度曲线。（linear、ease、ease-in、ease-out、ease-in-out、cubic-bezier(n,n,n,n)） |
| animation-delay           | 规定在动画开始之前的延迟。                                                                  |
| animation-iteration-count | 规定动画应该播放的次数。                                                                    |
| animation-direction       | 规定是否应该轮流反向播放动画。 （normal、alternate）                                        |
