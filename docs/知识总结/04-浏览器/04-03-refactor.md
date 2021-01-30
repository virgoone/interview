# 重排与重绘

在页面初始化完成后，我们可能会通过 CSS、JS 来对页面中的元素进行修改，这些修改会重新触发页面的一部分生命周期，进而带来性能上的开销。

重走页面生命周期的这个过程，有两种主要的形式——**重排与重绘**。

### 什么是重排？

当我们的操作**引发了 DOM 几何尺寸的变化**（比如修改元素的宽、高或隐藏元素等）时，浏览器需要重新计算元素的几何属性（其他元素的几何属性和位置也会因此受到影响），然后再将计算的结果绘制出来。这个过程就是**重排**（也叫**回流**）。

简而言之，**重排多数情况下是由对元素几何属性的修改引发的**。

比如说这种操作：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>重排demo</title>
    <style>
      #target {
        width: 100px;
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div id="target">
      <span id="targetText">我是一个小测试</span>
    </div>
  </body>
</html>
<script>
  var targetDom = document.getElementById('target');
  targetDom.style.width = '200px';
</script>
```

这样的一个修改宽度的动作，不仅影响了盒模型本身的“占地面积”、还会整个页面中其它元素的布局形式。浏览器不得不重新针对布局信息进行计算，这就是典型的重排过程。

当重排发生时，“重新来过”的流程如下图所示：

![图片描述](https://tva1.sinaimg.cn/large/0081Kckwgy1gl9rbddh90j30r005s3z4.jpg)

#### 还有什么动作会触发重排？

注意，重排多数情况下是由对元素几何属性的修改引发的，但不总是由此引发的。这个知识点很多同学都不知道，也是面试官区分新手和老手的关键。大家谨记，以下操作也会触发重排：

##### · 改变 DOM 树的结构

这里主要指的是**节点的增减、移动**等操作。

#### ·获取一些特定属性的值（重要）

如 offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight 等属性（挑几个背下来，答题的时候不要哑了）。

这些属性有一个共性，就是需要通过**即时计算**得到。因此浏览器为了获取这些值，也会进行回流。

除此之外，当我们调用了 `getComputedStyle` 方法，或者 IE 里的 `currentStyle` 时，也会触发回流。原理是一样的，都为求一个**“即时性”和“准确性”**。

### 什么是重绘？

当我们**对 DOM 的修改导致了样式的变化、却并未影响其几何属性**（比如修改了**颜色或背景色**）时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式（跳过了上图所示的回流环节）。这个过程叫做**重绘**。

简而言之，**重绘是由对元素绘制属性的修改引发的**。

举个例子，咱们仍然沿用上文的 demo，假如咱们修改了 `targetText` 的颜色：

```js
var targetDom = document.getElementById('targetText');
targetDom.style.color = 'red';
```

浏览器要想改变文字的颜色，只需要去变更像素点的色值即可，不涉及任何布局计算。因此，这是一个典型的重绘过程。

当重绘发生时，“重新来过”的流程如下图所示：

![图片描述](https://tva1.sinaimg.cn/large/0081Kckwgy1gl9rbeec6vj30r806ajrz.jpg)
