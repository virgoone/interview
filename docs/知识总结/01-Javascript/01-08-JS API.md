# JS API

## DOM

### DOM 操作

DOM 可以理解为：浏览器拿到的 html 代码，结构化成一个**浏览器能识别**且**JS 可操作**的一个模型

### DOM 节点操作

#### 获取 DOM 节点

```js
document.getElementById(id); //根据id获取元素
document.getElementsByTagName('div'); //根据标签获取元素组
document.getElementsByClassName('active'); //根据class获取元素组
document.querySelector('#app'); //取符合元素选择器的第一个
document.queryselectorAll('.active'); //取元素选择器符合的全部
```

#### property 属性 - JS 对象的属性

```js
// 获取文本和 html
node.innerText(value);
node.innerHtml(value);
window.getComputedStyle(elem).color; //获取元素计算后的样式

// class 操作
node.classList.add('active');
node.classLisr.remove('active');
node.classList.taggle('active'); //有到无，无到有
node.classList.contain('active'); //判断是否拥有某个 class
```

#### attribute 属性 - HTML 标签的属性

```js
node.getAttribute('src');
node.setArrtibute('src', src);
node.createAttribute(name);
node.removeAttribute(name);
```

#### 创建节点

```js
document.createElement(tagName);

//生成一个不属于当前文档的DOM片段，可以先对其进行操作再插入当前文档，减少重绘
document.cteateDocumentFragment(tagName);
```

### DOM 结构操作

#### 新增节点

```js
elem = document.createElement(tagName);
parent.apendChild(elem);
parent.insertBefore(elem);
```

#### 获取父元素和子元素

```js
elem.parentElement(); //获取父元素
elem.childNodes(); //获取子元素
```

#### 替换和删除节点

```js
.replaceChild(newElem, oldElem)   //节点替换
.removeChild(elem)  //节点删除
```

## BOM 操作 Borwer Object Model 浏览器对象模型

### navigator

- `navagator.userAgent` 返回一个浏览器的 "**User-Agent**" 字符串,其中标识了浏览器种类

### screen

- `screen.width`
- `screen.height`

### location

- `window.location === document.location === location`
- `location.herf`：完整 URL
- `location.protocol`：协议 `http` `https` 等
- `location.host`：类似 `www.baidu.com`
- `location.pathName`：类似 `/learn/12`
- `location.search`：查询字符串，跟在 ？后面，类似 `?x=1&y=2`
- `location.hash`：哈希，跟在#后面，类似 `#234`

### history

- `history.back`
- `history.foreward`

## window

- `window.innerHeight` `window.innerWidth`：窗口大小的高度/宽度
- `window.scrollX` `window.scrollY`：滚动条横向/纵向的偏移
- `window.scrollTo(x, y)`：滚动到指定偏移位置
- `window.scrollBy(x, y)`：相对当前位置进行滚动

## 内置对象 API

### Date

```js
Date.now(); //获取当前时间毫秒数

let date = new Date();
date.getTime(); //获取 毫秒数
date.getFullYear(); //获取 年
date.getMonth(); //获取 月（0-11）
date.getDate(); //获取 日（0-31）
date.getHours(); //获取 小时（0-23）
date.getMinutes(); //获取 分钟（0-59）
date.getSeconds(); //获取 秒（0-59）
```

### Math

```js
Math.random(); //获取随机数
Math.floor(); //向下取整
```

### Array

- `.forEach(item, index)`：遍历所有元素
- `.every`：判断是否所有元素都满足条件，返回 false 或者遍历完成则结束
- `.some`：判断是否存在元素满足条件，返回 true 或者遍历完成则结束
- `sort`：排序，可接受函数作为排序依据
- `.map`：对元素重新组装，生成新数组
- `.filter`：过滤出符合条件的元素
- `.reduce / .reduceRight`：遍历，调用回调函数，将数组元素组合成一个值
- 栈方法：`.pop()` 出栈，删除尾部元素，`.push` 入栈，在尾部添加元素
- 队列方法：`.shift()` 出队，删除头部元素，`.unshift` 入队，在头部添加元素
- 终极神器：`.splice(start 开始索引,number 删除个数,newEl 插入新元素)`
- 其他：`.join(char)` 数组连接成字符串， `.concat(array)` 数组拼接， `.slice(start, end)` 返回字段，不改变原数组，生成新数组， `.reverse()` 逆序， `.indexOf(elem)/lastIndexOf(elem)` 返回指定元素下标

### Object

- `for(key in obj){...}`
- `.hasOwnProperty(key)`：判断属性是否属对象本身的属性
