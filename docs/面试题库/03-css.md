# CSS 常见问题

## 布局

### 1. 盒子模型是什么

盒模型构成：content+padding+border+margin<br />特点：

- 标准盒模型宽度：content 部分
- IE 盒模型宽度：content+padding+border

box-sizing 属性值：

- `content-box` ,设置为标准盒模型
- `border-box` ，设置为 IE 盒模型的宽高计算方式

### 2. Flex 布局是什么

Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

- `flex-grow` 属性定义项目的放大比例，默认为 `0`，即如果存在剩余空间，也不放大
- `flex-shrink` 属性定义了项目的缩小比例，默认为 `1`，即如果空间不足，该项目将缩小
- `flex-basis` 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 `auto`，即项目的本来大小。

<br />`flex`属性是`flex-grow`, `flex-shrink`  和  `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选<br />

#### 2.1 `flex: 0 1 auto` 表示什么意思？

`flex: 0 1 auto` 其实是弹性盒子的默认值，表示 `flex-grow` ， `flex-shrink`， `flex-basis`  的简写，分别表示**放大比例**、**缩小比例**和**分配多余空间前的占据的主轴空间**<br />

#### 2.2 flex 的主轴方向默认是哪里？可调节吗？

flex 主轴的默认方向是水平方向，可通过属性 `flex-direction`  调节，它的四个值：

- `row`（默认值）：主轴为水平方向，起点在左端。<br />
- `row-reverse`：主轴为水平方向，起点在右端。<br />
- `column`：主轴为垂直方向，起点在上沿。<br />
- `column-reverse`：主轴为垂直方向，起点在下沿。

### 3. display:none 和 visibility:hidden 区别

1. `display：none`  不占据任何空间，`visibility：hidden` 仍占据空间
2. `display:none`  会引起回流和重绘，`visibility:hidden`  只会引起重绘

### 4. 垂直居中方案

- position 设置为 absolute 或者 fixed，然后设置 margin 或者 transform

```css
position: absolute;
width: 200px;
height: 100px;
margin-top: -50px;
margin-left: -100px;
left: 50%;
top: 50%;
```

- display: flex

```css
display: flex;
align-items: center;
```

- display: tabl

### 5. 单位 PX、PT、EM、REM，VW 区别

- px: 相对长度单位。像素 px 是相对于显示器屏幕分辨率而言的
- pt: point，是一个标准的长度单位，1pt ＝ 1/72 英寸，用于印刷业，非常简单易用
- em: 相对长度单位。相对于当前对象内文本的字体尺寸
- rem: 相对于 HTML 根元素的字体尺寸
- vw: 相对于视窗窗口的比例，最大是 100

### 6. CSS 实现三角形

宽度设置为 0，设置边框的大小，相邻边框宽度交叉会相互重叠

### 7. position 定位有哪些值？分别代表什么含义？

- **static**：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right, z-index 声明）
- **absolute**：生成绝对定位的元素，**相对于值不为 static 的第一个父元素进行定位**
- **fixed**：（老 IE 不支持）生成绝对定位的元素，**相对于浏览器窗口进行定位**
- **relative**：生成相对定位的元素，相对于其正常位置进行定位。
- **inherit**：规定从父元素继承 position 属性的值

### 7.1 绝对定位和 float 有什么异同？

相同点：都可以让元素脱离文档流，并且可以设置其宽高
不同点：float 仍会占据位置，而绝对定位会覆盖文档流中的其他元素

### 8. CSS 中伪类与伪元素的区别

1. 表示方法：CSS2.1 及之后规定伪类用单冒号`:` 表示，伪元素用 `::` 表示
1. **伪类即假的类**，是**基于普通 DOM 元素⽽产⽣的不同状态**
1. **伪元素即假元素**，**创建在 DOM 树中不存在的抽象对象**，⽽且这些抽象对象是能够访问到的

### 9. 控制属性的继承： inherit、initial 和 unset 的区别

1. `initial` ：初始化到该属性时**浏览器默认定义的值**
1. `inherit` ： 每个 CSS 属性都有，是**默认继承**或**默认不继承**，可以通过该属性来决定继承父元素
1. `unset` ： unset 可以理解为**不设置**，设置它则会**优先用 inherit 关键字的样式，其次使用 initial 关键字的样式**

### 10. link 和 @import 有什么区别

1. link 属于 HTML 标签，而 @import 是 CSS 提供的
2. 页面被加载的时，link 会同时被加载，而 @import 引用的 CSS 会等到页面被加载完再加载
3. import 只在 IE5 以上才能识别，而 link 是 HTML 标签，无兼容问题
4. link 方式的样式的权重高于 @import 的权重

### 11. CSS3 有什么新特性

- CSS3 实现**圆角**（border-radius），**阴影**（box-shadow）
- 对文字加特效（text-shadow），线性渐变（gradient），旋转（transform）
- 在 CSS3 中唯一引入的伪元素是 `::selection`
- **媒体查询**，多栏布局
- **动画** animation

### 12. 什么是 CSS sprites？

CSS Sprites 就是把**网页中一些背景图片整合到一张图片文件**中，再利用 CSS 的 `background-image`，`background-repeat`，`background-position` 的组合进行背景定位，`background-position` 可以用数字能精确的定位出背景图片的位置。

这样可以**减少很多图片请求的开销**，因为请求耗时比较长；请求虽然可以并发，但是也有限制，一般浏览器都是 6 个。对于未来而言，就不需要这样做了，因为有了 HTTP/2。

### 13. 如何清除浮动？

1. 使用空标签清除浮动：这种方法是在所有浮动标签后面添加一个空标签定义 CSS `clear:both`，弊端就是增加了无意义标签。 2.使用 overflow（创建 BFC）： 给包含浮动元素的父标签添加 CSS 属性 `overflow:auto` 或者 `overflow: hidden` 3.使用 after 伪对象清除浮动：该方法只适用于非 IE 浏览器

```CSS
.clearfix:after{
  content: "";
  display: block;
  clear: both;
 }
```

### 14. 什么是 FOUC（无样式内容闪烁）？你如何来避免 FOUC？

引用 CSS 文件的 @import 就是造成这个问题的罪魁祸首。

IE 会先加载整个 HTML 文档的 DOM，然后再去导入外部的 CSS 文件，因此，在页面 DOM 加载完成到 CSS 导入完成中间会有一段时间页面上的内容是没有样式的，这段时间的长短跟网速，电脑速度都有关系。
解决方法：在 `<head>` 之间加入一个 `<link>` 或者 `<script>` 元素就可以了。

### 15. CSS 选择器权重。怎么计算

id>class>标签>通配符

## 重绘和回流

### 1. 什么是重绘和回流？

- **回流**：当 `Render Tree` 中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为**回流**。
- 重**绘**：当页面中元素样式的改变并不影响它在文档流中的位置时（例如：`color`、`background-color`、`visibility` 等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为**重绘**。

### 2. 怎样避免不必要的重绘和回流？

## BFC

### 1. BFC 是什么？

BFC 是**块级格式化上下文**，脱离文档上下流，独立的渲染区域，它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干

### 2. BFC 的触发条件是什么？

满足下列条件之一就可触发 BFC

- 根元素
- 浮动元素（ `float` 不取值为 `none` ）
- 绝对定位元素（ `position` 取值为 `absolute` 或 `fixed` ）
- `display` 取值为 `inline-block` 、 `table-cell` 、 `table-caption` 、 `flex` 、`inline-flex` 之一的元素
- `overflow` 不取值为 `visible` 的元素

### 3. BFC 的应用？

- **清除元素内部浮动**
- **解决外边距合并（塌陷）**问题
- 阻止元素被浮动的元素覆盖

## 动画

### 1. 前端实现动画的方式有哪些？

1. 使用 JavaScript
   1. 通过定时器（ `setTimeout` ， `setInterval` ）来间隔改变元素样式
   1. 使用 `requestAnimationFrame`
2. 使用 css3 的新特性
   1. **transition**
   1. **animation**
   1. **transform**
3. html5：使用 H5 提供的绘图方式
   1. **canvas**
   1. **webGL**
   1. **svg**

### 2. css3 transition 和 animation 的区别？

- `transition` ：允许**块级元素中的属性**在指定的时间内平滑的改变

```css
transition: property duration timing-function delay;
```

- `animation` ：类似但区别于 `transition` , `animation` **作用于元素本身**而不是样式属性, 可以使用关键帧的概念 , 更加强大。

```css
animation: name duration timing-function delay iteration-count direction;
```

### 3. `requestAnimationFrame`  实现动画的优势是什么？

`requestAnimation`  可以说是为 动画量身打造的 `setTimeout` , 不同的是 `requestAnimationFrame`  是跟着**浏览器内建的刷新频率来执行回调函数，**这就是**浏览器实现动画的最佳效果**。

### 3.1 `requestAnimationFrame` 是怎么调用的？

```js
window.requestAnimationFrame(callback);
```

- callback：下一次重绘之前更新动画帧所调用的函数，callback 仅有一个参数，为`DOMHighResTimeStamp` 参数，表示 `requestAnimationFrame()` 开始执行回调函数的时刻。

- 返回值：一个 `long` 类型整数，唯一标志元组在列表中的位置，你可以传这个值给`cancelAnimationFrame()` 以取消动画。

### 3.2 `requestAnimationFrame` 是怎么执行的？

1. 判断 `document.hidden` 属性是否可见，可见状态下才会执行后续的步骤
2. 浏览器清空上一轮的动画函数
3. `requestAnimationFrame` 将回调函数追加到动画帧请求回调列表的末尾
4. 当页面可见且动画帧请求 callback 回调函数列表不为空时，浏览器会定期将这些回调函数加入到浏览器 UI 线程的队列中（由系统决定回调函数的执行时机）。当浏览器执行这些 callback 回调函数的时候，会判断每个元组的 callback 的 `cancelled` 标志是否为 `false`，检查完成后执行回调函数。

> 当执行 `requestAnimationFrame` 的时候，不会立即调用 callback 函数，只是将其放进回调函数队列而已。
>
> 同时，每个 callback 回调函数都有一个默认为 `false` 且不可见的 `cancelled` 属性

### 4. 常用的动画库及其特性？

### 5. 动画有什么优化的方式？

## 移动端适配

### 1. rem 方案和 vw 方案，各自的优缺点是什么？

### 2. 什么是 1px 问题？为什么会出现 1px 问题？

现象：在一些 **Retina 屏幕**的机型上，移动端页面的 1px 会变得很粗，呈现出不止 1px 的效果。

原因：CSS 中的 1px 并不能和移动设备上的 1px 划等号。通过 `window.devicePixelRatio = 设备的物理像素 / CSS 像素` 来描述二者的关系。在部分机型中，dpr 可能为 2，这就意味着我设置的 1px CSS 像素，在这个设备上实际会用 2 个物理像素单元来进行渲染，所以实际看到的一定会比 1px 粗一些。

### 3. 1px 问题的解决方案有哪些？

**1. 直接写 0.5px**

可以先在 JS 中拿到 `window.devicePixelRatio` 的值，然后把这个值通过 `JSX` 或者模板语法给到 CSS 的 data 里，达到这样的效果：

```jsx
<div id="container" data-device={window.devicePixelRatio}></div>
```

然后你就可以在 CSS 中用属性选择器来命中 `devicePixelRatio` 为某一值的情况，比如说这里我尝试命中 `devicePixelRatio` 为 2 的情况：

```css
#container[data-device='2'] {
  border: 0.5px solid #333;
}
```

直接把 `1px` 改成 `1/devicePixelRatio` 后的值，这是目前为止最简单的一种方法。这种方法的缺陷在于兼容性不行，IOS 系统需要 8 及以上的版本，安卓系统则直接不兼容。

**2. 伪元素现放大后缩小**

1. 在目标元素的后面追加一个 `::after` 伪元素，让这个元素布局为 absolute
2. 整个伸展开铺在目标元素上，然后把它的宽和高都设置为目标元素的两倍，`border` 值设为 1px
3. 接着借助 CSS 动画特效中的放缩能力，**把整个伪元素缩小为原来的 50%**。此时，伪元素的宽高刚好可以和原有的目标元素对齐，而 `border` 也缩小为了 1px 的二分之一，间接地实现了 0.5px 的效果

```css
#container[data-device='2'] {
  position: relative;
}

#container[data-device='2']::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  transform: scale(0.5);
  transform-origin: left top;
  box-sizing: border-box;
  border: 1px solid #333;
}
```

**3. viewport 缩放：局部处理**

- `meta`标签中的 `viewport`属性 ，`initial-scale` 设置为 `1`
- `rem`按照设计稿标准走，外加利用`transfrome` 的`scale(0.5)` 缩小一倍即可；

**4. viewport 缩放：全局处理**

- `mate`标签中的 `viewport`属性 ，`initial-scale` 设置为 `0.5`
- `rem` 按照设计稿标准走即可
