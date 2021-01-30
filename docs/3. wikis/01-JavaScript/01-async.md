# 异步

JS 语言的任务执行模式就分为同步和异步。

同步，就是说后一个任务必须严格等待前一个任务执行完再执行，**任务的执行顺序和排列顺序是高度一致的**；异步，则恰恰相反，**任务的执行顺序不必遵循排列顺序**。

比如说前一个任务就算没执行完，也没关系，先执行下一个任务就好，等前一个任务的执行结果啥时候出来了，我再把它临时穿插进来执行下。

这其中，异步模式至关重要。大家知道，对我们前端来说，用户体验就是命，我们页面让用户苦等 2 分钟等一个表单提交的返回结果，同样是极不友好的一种交互体验。假如我们的主线程里，充斥着用户事件、ajax 任务等高耗时的操作，这种情况下还不采用异步方案，页面的卡顿甚至卡死将是不可避免的。

## 异步进化史
异步在实现上，依赖一些特殊的语法规则。从整体上来说，异步方案经历了如下的四个进化阶段：

**回调函数** —> **Promise** —> **Generator** —> **async/await**。

![异步方案进化](https://tva1.sinaimg.cn/large/0081Kckwgy1gl8fwd4005j30z009saat.jpg)

其中 Promise、Generator 和 async/await 都是在 ES2015 之后，慢慢发展起来的、具有一定颠覆性的新异步方案。相较于 “回调函数 “时期的刀耕火种而言，具有划时代的意义。

### “回调函数” 时期

所谓 “回调函数” 时期，这里严格来说指代的其实是 Promise 出现前的这么一个相对早期的阶段。在这个阶段里，回调是异步最常见、最基本的实现手段，却不是唯一的招数 —— 像**事件监听、发布订阅**这样的方式，也经常为我们所用。

#### 事件监听

这种形式相信每位前端同学都不陌生，给目标 DOM 绑定一个监听函数，我们用的最多的是 `addEventListener`：

```js
document.getElementById('#myDiv').addEventListener('click', function (e) {
  console.log('我被点击了')
}, false);
```

通过给 `id` 为 `myDiv` 的一个元素绑定了点击事件的监听函数，我们把任务的执行时机推迟到了点击这个动作发生时。此时，任务的执行顺序与代码的编写顺序无关，只与点击事件有没有被触发有关。

#### 发布订阅

发布订阅，是一种相当经典的设计模式。直接用 jQuery 中封装过的发布订阅做讲解，会更容易理解一些。
比如说我们想在名为 `trigger` 的信号被触发后，做点事情，我们可以订阅 `trigger` 信号：

```js
function consoleTrigger() {
    console.log('trigger事件被触发')
}
jQuery.subscribe('trigger',consoleTrigger);
```

这样当 trigger 被触发时，上面对应的回调任务就会执行了：

```js
function publishTrigger() {
    jQuery.publish('trigger');
}

// 2s后，publishTrigger方法执行，trigger信号发布，consoleTrigger就会执行了
setTimeout(publishTrigger, 2000)
```

大家会发现这种模式和事件监听下的异步处理非常相似，它们都把任务执行的时机和某一事件的发生紧密关联了起来。

#### 回调函数

回调函数用的最多的地方其实是在 Node 环境下，我们难免需要和引擎外部的环境有一些交流：比如说我要利用网络模块发起请求、或者要对外部文件进行读写等等。这些任务都是异步的，我们通过**回调**的形式来实现它们。
```js
// -- 异步读取文件
fs.readFile(filePath,'utf8',function(err,data){
    if(err) {
      throw err;
    }
    console.log(data);// 输出文件内容
});
const https = require('https');

// 发起网络请求
https.get('目标接口', (res) => {
  console.log(data)

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
```

#### “回调地狱”

当回调只有一层的时候，看起来感觉没什么问题。但是一旦回调函数嵌套的层级变多了之后，代码的可读性和可维护性将面临严峻的挑战。比如当我们想发起连环网络请求时：

```js
const https = require('https');

https.get('目标接口1', (res) => {
  console.log(data)
  https.get('目标接口2', (res) => {
    https.get('目标接口3'),  (res) => {
        console.log(data)
        https.get('目标接口4', (res) => {
          https.get('目标接口5', (res) => {
            console.log(data)
            .....
            // 无尽的回调
          }
        }
    }
  }
})
```

这样写代码非常糟糕，它会带来很多问题，最直接的就是：**可读性和可维护性被破坏**。

### Promise

长久以来，我们一直期望着一种既能实现异步、又可以确保我们的代码好写又好看的解决方案出现。带着这样的目标，经过反复的探索，我们终于迎来了 Promise。
Promise 是 ES6 新增的语法，解决了回调地狱的问题。

#### 基本语法
```js
function loadImg(src) {
    const promise = new Promise(function(resolve, reject){
        let img = document.cteateElement('img')
        img.onload = function(){
            resolve(img)
        }
        img.onerror = function {
            reject()
        }
        img.src = src
    })
    return promise
}
let result = loadImg(src)
result.then(function() {...}, function() {...})
```
###### 异常捕获
```js
result.then(function() {
})  //成功
    .then(function() {
    })  //成功
    .catch(function() {
    })  //最后catch统一捕获异常
```
##### 多个事件，链式操作
```js
let result1 = loadImg(src1)
let result2 = loadImg(src2)
result1.then( function(img) {
    pass  //处理第一个图片
    return result2   //返回第二个图片的promise实例
}).then(function(img) {
    pass //这里处理第二张图片
})
```
##### `Promise.all ` 和 ` Promise.race`
```js
//Promise.all是在全部 promise 实例执行完成后执行
Promise.all([result1, result2]).then(datas => {
    console.log(datas[0])  //datas是一个数组，一次包含了所有promise实例返回的内容
    console.log(datas[1])
})

//Promise.race只要有 promise 实例执行完成，就执行
Promise.race([result1, result2]).then(data => {
    console.log(data)  //data是最先返回的promise的返回值
    console.log(data)
})
```
#### 状态变化
- `pending` 待定状态
- `resolved` 成功状态
-  `rejected` 失败状态

可以把 Promise 看成一个状态机。初始是 `pending` 状态，可以通过函数 `resolve` 和 `reject` ，将状态转变为 `resolved` 或者 `rejected` 状态，状态一旦改变就不能再次变化。

#### `Promise.then()`
- Promise 实例必须实现 `then` 方法
- `then` 必须可以接受两个函数作为参数
- `then` 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例
- 对于 `then` 来说，本质上可以把它看成是 `flatMap`

### Generator

除了 Promise， ES2015 还为我们提供了 Generator 这个好帮手。如果你对 Generator 是什么、以及其语法特性暂时还没有太多的了解，可以点击 [这里](https://es6.ruanyifeng.com/#docs/generator)先进行预备知识的学习。

Generator 一个有利于异步的特性是，它**可以在执行中被中断、然后等待一段时间再被我们唤醒**。通过这个“中断后唤醒”的机制，我们可以把 Generator看作是异步任务的容器，利用 yield 关键字，实现对异步任务的等待。


我们知道，Generator 要想跑起来，需要为它**创建迭代器**，然后去执行这个迭代器的 `next` 方法。在 `httpGenerator` 这个例子里，我们要想把整个函数体的逻辑走完，就必须让迭代器的 `next` 反复调用、直到返回值中的 `done` 为 `true` 为止。

### Async/Await
 
async/await 只需要写几个关键字，就能把异步代码处理得像同步代码一样优雅！。

它的用法非常简单。首先，我们用 `async` 关键字声明一个函数为“异步函数”：

```js
async function httpRequest() {

}
```

然后，我们就可以在这个函数内部使用 `await` 关键字了：

```js
async function httpRequest() {
  let res1 = await httpPromise(url1)
  console.log(res1)
}  
```

这个 `await` 关键字很绝，它的意思就是“我要异步了，可能会花点时间，后面的语句都给我等着”。当我们给 `httpPromise(url1)` 这个异步任务应用了 `await` 关键字后，整个函数会像被“yield”了一样，暂停下来，直到异步任务的结果返回后，它才会被“唤醒”，继续执行后面的语句。

是不是觉得这个“暂停”、”唤醒“的操作，和 generator 异步非常相似？事实上，**async/await 本身就是 generator 异步方案的语法糖**。它的诞生主要就是为了这个单纯而美好的目的——让你写得更爽，让你写出来的代码更美。

> async/await 和 generator 方案，相较于 Promise 而言，有一个重要的优势：**Promise 的错误需要通过回调函数捕获**，try/catch 是行不通的。而 **async/await 和 generator 允许 try/catch**。
