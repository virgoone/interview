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


<br />`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选<br />

#### 2.1  `flex: 0 1 auto` 表示什么意思？
`flex: 0 1 auto` 其实是弹性盒子的默认值，表示 `flex-grow` ， `flex-shrink`， `flex-basis` 的简写，分别表示**放大比例**、**缩小比例**和**分配多余空间前的占据的主轴空间**<br />

#### 2.2 flex 的主轴方向默认是哪里？可调节吗？
flex 主轴的默认方向是水平方向，可通过属性 `flex-direction` 调节，它的四个值：

- `row`（默认值）：主轴为水平方向，起点在左端。<br />
- `row-reverse`：主轴为水平方向，起点在右端。<br />
- `column`：主轴为垂直方向，起点在上沿。<br />
- `column-reverse`：主轴为垂直方向，起点在下沿。

### 3. display:none 和 visibility:hidden 区别
1、 `display:none` 的子孙节点消失，这是由于元素从渲染树中消失造成， `visibility:hidden` 的子孙节点消失是由于继承性，可以设置 `visibility：visible` 让子孙节点显示；<br />2、 `display：none` 不占据任何空间； `visibility：hidden` 仍占据空间；<br />3、 `display:none` 会引起回流和重绘， `visibility:hidden` 会引起重绘。

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
### 5. 单位PX、PT、EM、REM，VW区别

- px: 相对长度单位。像素 px 是相对于显示器屏幕分辨率而言的
- pt: point，是一个标准的长度单位，1pt＝1/72 英寸，用于印刷业，非常简单易用
- em: 相对长度单位。相对于当前对象内文本的字体尺寸
- rem: 相对于 HTML 根元素的字体尺寸
- vw: 相对于视窗窗口的比例，最大是 100
### 6. CSS实现三角形
宽度设置为 0，设置边框的大小，相邻边框宽度交叉会相互重叠
### 7. position 定位有哪些值？分别代表什么含义？

- **static**：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right, z-index 声明）
- **absolute**：生成绝对定位的元素，**相对于值不为 static 的第一个父元素进行定位**
- **fixed**：（老IE不支持）生成绝对定位的元素，**相对于浏览器窗口进行定位**
- **relative**：生成相对定位的元素，相对于其正常位置进行定位。
- **inherit**：规定从父元素继承 position 属性的值



### 8. CSS 中伪类与伪元素的区别

1. 表示方法：CSS2.1 及之后规定伪类用单冒号`:` 表示，伪元素用 `::` 表示
1. **伪类即假的类**，是**基于普通 DOM 元素⽽产⽣的不同状态**
1. **伪元素即假元素**，**创建在 DOM 树中不存在的抽象对象**，⽽且这些抽象对象是能够访问到的



### 9. 控制属性的继承： inherit、initial 和 unset 的区别

1. `initial` ：初始化到该属性时**浏览器默认定义的值**
1. `inherit` ： 每个 CSS 属性都有，是**默认继承**或**默认不继承**，可以通过该属性来决定继承父元素
1. `unset` ： unset 可以理解为**不设置**，设置它则会**优先用 inherit 关键字的样式，其次使用 initial 关键字的样式**
## 重绘和回流
### 1. 什么是重绘和回流？

- **回流**：当 `Render Tree` 中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为**回流**。
- 重**绘**：当页面中元素样式的改变并不影响它在文档流中的位置时（例如：`color`、`background-color`、`visibility` 等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为**重绘**。
### 2. 怎样避免不必要的重绘和回流？
## BFC
### 1. BFC是什么？
BFC是**块级格式化上下文**，脱离文档上下流，独立的渲染区域，它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干
### 2. BFC 的触发条件是什么？
满足下列条件之一就可触发BFC

- 根元素
- 浮动元素（ `float` 不取值为 `none` ）
- 绝对定位元素（ `position` 取值为 `absolute` 或 `fixed` ）
- `display` 取值为 `inline-block` 、 `table-cell` 、 `table-caption` 、 `flex` 、`inline-flex` 之一的元素
- `overflow` 不取值为 `visible` 的元素



### 3. BFC 的应用？

- **清除元素内部浮动**
- **解决外边距合并（塌陷）**问题
- 制作**右侧自适应的两栏盒子**问题



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
transition : property duration timing-function delay
```

- `animation` ：类似但区别于 `transition` , `animation` **作用于元素本身**而不是样式属性, 可以使用关键帧的概念 , 更加强大。
```css
animation : name duration timing-function delay iteration-count direction
```
### 3.  `requestAnimationFrame` 实现动画的优势是什么？ 
`requestAnimation`  可以说是为 动画量身打造的 `setTimeout` , 不同的是 `requestAnimationFrame`  是跟着**浏览器内建的刷新频率来执行回调函数，**这就是**浏览器实现动画的最佳效果**。
### 4. 常用的动画库及其特性？
### 5. 动画有什么优化的方式？
## 移动端适配
### 1. rem 方案和 vw 方案，各自的优缺点是什么？
### 2. 1px 问题的实现方案有哪些？
**1.局部处理**

- `meta`标签中的 `viewport`属性 ，`initial-scale` 设置为 `1`
- `rem`按照设计稿标准走，外加利用`transfrome` 的`scale(0.5)` 缩小一倍即可；

**2.全局处理**

- `mate`标签中的 `viewport`属性 ，`initial-scale` 设置为 `0.5`
- `rem` 按照设计稿标准走即可