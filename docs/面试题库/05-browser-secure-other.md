# 浏览器

### 1. 为什么一般把 css 放在<head></head>中，js 放在<body>底部？

- css 会阻塞页面渲染，越早加载越好
- js 会阻塞 DOM 树的生成以及渲染，放在底部更好

### 2. cookies，sessionStorage 和 localStorage 的区别

- `cookie` 是网站为了标示用户身份而储存在用户本地终端上的数据（通常经过加密）
- `cookie` 数据始终在同源的 http 请求中携带（即使不需要），记会在浏览器和服务器间来回传递（优化点）
- `sessionStorage` 和 `localStorage` 不会自动把数据发给服务器，仅在本地保存
- 存储大小：
  - `cookie` 数据大小不能超过 4k
  - `sessionStorage` 和  `localStorage`虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大
- 有期时间：
  - `localStorage` 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据

`sessionStorage` 数据在当前浏览器窗口关闭后自动删除<br />`cookie 设置的 cookie` 过期时间之前一直有效，即使窗口或浏览器关闭

### 3. 节流和防抖是什么？有什么区别？

- 防抖：触发高频事件后 n 秒内函数只会执行一次，如果 n 秒内高频事件再次被触发，则重新计算时间
- 节流：高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率

```javascript
function debounce(fn) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值
  return function() {
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => {
      // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments);
    }, 500);
  };
}
function throttle(fn) {
  let canRun = true; // 通过闭包保存一个标记
  return function() {
    if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
    canRun = false; // 立即设置为false
    setTimeout(() => {
      // 将外部传入的函数的执行放在setTimeout中
      fn.apply(this, arguments);
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true;
    }, 500);
  };
}
```

### 4. Chrome 中有哪些主要进程？

![](https://cdn.nlark.com/yuque/0/2021/jpeg/2637095/1610263364905-a75c9099-9ba6-45bb-b771-30257ecdaa26.jpeg#align=left&display=inline&height=956&margin=%5Bobject%20Object%5D&originHeight=956&originWidth=2208&size=0&status=done&style=none&width=2208)

在 Chrome 中，主要的进程有 4 个：

1. **浏览器主进程**：主要负责**界面显示**、**用户交互**、子进程管理，同时提供存储功能，例如：浏览器 TAB 的前进、后退、地址栏、书签栏等
2. **渲染进程**：核心任务是**将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页**。**排版引擎 Blink** 和 **JS 引擎 V8** 都是运行在该进程中，默认情况下，Chrome 会为**每个 Tab 标签创建一个渲染进程**。出于安全考虑，渲染进程都是运行在沙盒中
3. **GPU 进程**：（最初没有）处理浏览器的 GPU 任务
4. **网络进程**：（之前在主进程中）负责页面的**网络资源加载**
5. **插件进程**：负责**插件的运行**，控制网页中使用到的插件

#### 4.1 这些进程之间的关系是什么？

1. 首先，在浏览器的地址栏里输入 URL，这时**浏览器进程**会让**网络进程**向这个 URL 发送请求，获取这个 URL 的 HTML 内容，然后将 HTML 交给**渲染进程**
1. **渲染进程**解析 HTML 内容，解析遇到需要请求网络的资源就通知**浏览器进程**交给**网络进程**，同时通知**插件进程**加载插件资源，执行插件代码
1. 解析完成后，**渲染进程**计算得到图像帧，并将这些图像帧交给**GPU 进程**，**GPU 进程**将其转化为图像显示屏幕。

#### 4.2 浏览器的渲染流程是怎样的？

1. **构建 DOM 树**：渲染进程将 HTML 转换为浏览器能够理解的 **DOM 树**结构
1. **样式计算**：渲染引擎将 CSS 样式表转化为浏览器能够理解的 **styleSheets 样式表**，计算出 DOM 节点的样式
1. **布局阶段**：创建布局树，并计算元素的布局信息
1. **分层**：对布局树进行分层，并生成**图层树**
1. **绘制**：为每个图层生成**绘制列表**，并将其提交给合成线程
1. **分块**：合成线程将图成分成**图块**
1. **光栅化**：在**光栅化线程池**中将图块转换成位图
1. **合成及显示**：合成线程发送绘制图块命令 `DrowQuad` 给浏览器进程，浏览器进程根据 `DrawQuad` 消息**生成页面**，
   并显示到屏幕上

#### 4.3 html 的 dom 树如何生成的

在渲染引擎内部，有一个叫 **HTML  解析器（HTMLParser）的模块**，（如上第一步）它的职责就是负责将 HTML  字节流转换为 DOM  结构。

### 5. 跨域是什么？有什么办法解决？

跨域是因为同源策略的原因，即**域名、协议、端口**相同，有一项不同就会产生跨域限制

#### 跨域的解决方案

- CORS
- nginx 代理
- iframe
- JSONP

### 6. 浏览器中的事件循环 event loop

JavaScript 的任务分为两种`同步`和`异步`

- **同步任务**是直接放在主线程上排队依次执行
- **异步任务**会放在任务队列中，若有多个异步任务则需要在任务队列中排队等待

其中任务队列类似于缓冲区，任务下一步会被移到**调用栈**然后主线程执行调用栈的任务<br />异步队列分为宏任务（macro-task）和微任务（micro-task）

- macro-task：`setTimeout`、`setInterval`、`script（整体代码）`、`I/O 操作`、`UI 渲染`等。
- micro-task: `new Promise().then()`(回调)、`MutationObserve` 等

执行顺序：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/102736/1603865746446-e374b779-8f29-4f89-acb3-3ef65e4ef584.png#align=left&display=inline&height=480&margin=%5Bobject%20Object%5D&name=image.png&originHeight=960&originWidth=1146&size=573690&status=done&style=none&width=573)

### 7. JSBridge 与 Native 间通信原理?

在 H5 中 JavaScript 调用 Native 的方式主要用两种

1. **注入 API**，注入 Native 对象或方法到 JavaScript 的 window 对象中（可以类比于 RPC 调用）。
1. **拦截 URL Schema**，客户端拦截 WebView 的请求并做相应的操作（可以类比于 JSONP）。

## 优化

### 1. H5 如何获取首屏的加载时间？

- 如果页面首屏有图片：首屏时间 = `首屏页面全部加载完毕的时刻 - preformance.timing.navigationStart`
- 如果首屏没有图片：首屏时间 = `performance.timing.domContentLoadedEventStart`

## Git

### 1. git rebase 和 merge 的区别？

主要区别在于是否保留分支的 commit 提交节点， rebase 会给你一个简洁的线性历史树
