
# Javascript 基础

## 类型

### 1. JS 的基础类型

- `undefined` 
- `null` 
- `boolean` 
- `number` 
- `string` 
- `symbol` (new in ES 6) 
- 对象(Object)、数组(Array)、函数(Function)



### 2. JS 基本类型和引用类型的区别
基本类型和引用类型的区别：

- 基本类型存在**栈**内存，存放的是**值**，占据空间小，大小稳定
- 引用类型存在**堆**内存中，引用类型的存储需要内存的栈区和堆区（堆区是指内存里的堆内存）共同完成，栈区内存保存变量标识符和指向堆内存中该对象的指针



### 3. 为什么 0.1 + 0.2 !== 0.3 ?
Javascript 中的 Number 类型就是浮点型，而浮点数采用的是 IEEE-754 格式的规定，这是一种二进制表示法，可以精确表示分数，比如 1/2，1/8， 1/1024，每个浮点数占 64 位。
但是**二进制浮点数表示法并不能精确的表示类似 0.1 这样的数字**，而被表示为 0.0011001100110011... ，而对于 `0.1 + 0.2` 这样的运算，操作数会先被转成二进制，然后再计算。
#### 3.1 要怎样来让上述等式成立？
（ES6）正确的比较方法应该是用 JavaScript 提供的最小精度值 `Number.EPSILON` 来实现
```javascript
console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON )
```


### 4. 如何判断数组

1. `arr instanceOf Array` 
1. `Array.isArray(arr)` 
1. constructor 
```javascript
// 在ES5中判断变量是否为数组
var a = {
    __proto__: Array.prototype
}; 
// 分别在控制台试运行以下代码 
// 1.基于instanceof 
a instanceof Array; // => true 
// 2.基于constructor 
a.constructor === Array; // => true 
// 3.基于Object.prototype.isPrototypeOf 
Array.prototype.isPrototypeOf(a); // => true 
// 4.基于getPrototypeOf 
Object.getPrototypeOf(a) === Array.prototype; // => true
// 5.基于Object.prototype.toString 
Object.prototype.toString.apply(a) === '[object Array]';
// 除了Object.prototype.toString外，其它方法都不能正确判断变量的类型。
在ES6中判断变量是否为数组
Array.isArray([]); // => true 
Array.isArray({0: 'a', length: 1}); // => false
if (!Array.isArray){ 
    Array.isArray = function(arg){ 
        return Object.prototype.toString.call(arg) === '[object Array]'; 
    }; 
}
```

### 5. null 和 undefined 区别

- `undefined` 表示一个变量自然的、最原始的状态值，任何变量在没有赋值前就是 `undefined`，但 `undefined` 并不是一个关键字 
- `null` 则表示一个变量被人为的设置为空对象，而不是原始状态，即“定义了但是为空”


### 6. JavaScript 数组去重

- 利用 ES6 Set 去重
- 利用 for 嵌套 for，然后 splice 去重
- 利用 indexOf 去重
- `[...new Set(arr)]`


### 7. 浅拷贝和深拷贝
基础数据类型存在栈中，引用数据类型存在堆中

- 浅拷贝（shallow copy）：只复制指向某个对象的指针，而不复制对象本身，新旧对象共享一块内存；  
- 深拷贝（deep copy）：复制并创建一个一摸一样的对象，不共享内存，修改新对象，旧对象保持不变。


### 8. 类数组和数组的区别，dom 的类数组如何转换成数组
1）定义：

- 数组是一个特殊对象，与常规对象的区别：
   1. 当有新元素添加到列表时，自动更新 `length` 属性，且设置 `length` 属性，可以截断数组
   1. 从 `Array.prototype` 中继承方法
- 类数组是一个拥有 `length` 属性，并且它属性为非负整数的普通对象，类数组不能直接调用数组方法


2）区别：类数组是简单对象，它的原型关系与数组不同


3) 类数组转换成数组

- 转换方法
   1. 使用 `Array.from(arrayLike)` 
   1. 使用 `Array.prototype.slice.call(arrayLike)` 
   1. 使用 `Array.prototype.forEach(array)` 进行属性遍历并组成新的数组
- 转换须知：转换后的数组长度由 `length` 属性决定。索引不连续时转换结果是连续的，会自动补位

### 9. 为什么 `typeOf null === 'object'` ？
最早的 JavaScript 是用 32 为比特数存储值，并用最低的 1 或 3 位来判断类型，判断依据如下： 
> - 1：整型（int）
> - 000：引用类型（object）
> - 010：双精度浮点型（double）
> - 100：字符串（string）
> - 110：布尔型（boolean）

由于 `null` 代表的是空指针（32 位全为 0，低三位也是 `000` ），因此 `null` 的类型标签是 `000`，`typeof null` 也因此返回 "object"。
这个算是 `JavaScript` 设计的一个错误，但是也没法修改，毕竟修改的话，会影响目前现有的代码

### 10. 分别写出如下代码的返回值
```javascript
String('11') == new String('11');
String('11') === new String('11');
```
**答案** 
```javascript
true
false
```
`new String()` 返回的是对象 `object` 

- `==` 的时候，实际运行的是 `String('11') == new String('11').toString();`
- `===` 的时候，一个类型为 `string` ，一个类型为 `object` ，因此为 `false` 

## 原型

### 1. 简述原型和原型链，有什么特点

- JS中每个函数都存在有一个原型对象属性prototype。并且所有函数的默认原型都是Object的实例。
- 每个继承父函数的子函数的对象都包含一个内部属性_proto_。该属性包含一个指针，指向父函数的prototype。若父函数的原型对象的_proto_属性为再上一层函数。在此过程中就形成了原型链。

特点：

- 原型链实现了继承。原型链存在两个问题：a 包含引用类型值的原型属性会被所有实例共享。b 在创建子类型时，无法向超类型的构造函数中传递参数。
- 可以向上查找，不能向下查找，层层向上直到一个对象的原型对象为 `null`为止

## 异步

### 1. async和defer的区别

- 两者都不会阻止 document 的解析
- defer 会在 DOMContentLoaded 前依次执行 （可以利用这两点哦！）
- async 则是下载完立即执行，不一定是在 DOMContentLoaded 前，因为顺序无关，所以很适合像 Google Analytics 这样的无依赖脚本



### 2. Promise 简单介绍
Promise 对象接受一个回调函数作为参数, 该回调函数接受两个参数，分别是成功时的回调 resolve 和失败时的回调 reject
有三种状态：pending(进行中)、fulfilled(已成功)、rejected(已失败)
优点是：统一异步 API，解决了回调地狱的问题
缺点是：无法取消 Promise，如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部，外部无法捕获

## 作用域

### 1. call、apply、bind使用和区别

- call、apply 他们俩之间的差别在于参数的区别，call 和 apply 的第一个参数都是要改变上下文的对象，而 call 从第二个参数开始以参数列表的形式展现，apply 则是把除了改变上下文对象的参数放在一个数组里面作为它的第二个参数。
- call 和 apply 改变了函数的 this 上下文后便执行该函数,而 bind 则是返回改变了上下文后的一个函数。



### 2. new 做了什么

1. 新生成了一个对象
1. 链接到原型
1. 绑定 this
1. 返回新对象
```javascript
var a = new A();
// 1. 首先创建一个空对象
var o = new Object();
// 2. 将空对象的原型赋值为构造器函数的原型
o.__proto__ = A.prototype;
// 3. 更改构造器函数内部this，将其指向新创建的空对象
A.call(o);
```


### 3. 对闭包的看法，为什么要用闭包

- 函数执行后返回结果是一个内部函数，并被外部变量所引用，如果内部函数持有被执行函数作用域的变量，即形成了闭包，可以在内部函数访问到外部函数作用域
- 使用闭包，一可以读取函数中的变量，二可以将函数中的变量存储在内存中，保护变量不被污染
- **使用闭包的优点是可以避免全局变量污染**

应用场景：

- 保护函数内的变量安全：如迭代器、生成器。
- 在内存中维持变量：如果缓存数据、柯里化。
- 管理私有变量和私有方法，将对变量（状态）的变化封装在安全的环境中 
- 将代码封装成一个闭包形式，等待时机成熟的时候再使用，比如实现柯里化和反柯里化 
- 需要注意的，由于闭包内的部分资源无法自动释放，容易造成内存泄露



### 4. 什么是内存泄漏？JS 中什么情况下可能会出现内存泄漏？

##### 内存泄漏的定义：
**程序中已动态分配的堆内存由于某种原因程序未释放或无法释放引发的各种问题**。
##### 出现的原因：

- 全局变量
- DOM 清空时，还存在引用 DOM 元素
- 使用闭包
- 定时器未清除
- 子元素存在引起的内存泄露

#### 4.1 如何避免内存泄漏

- 减少不必要的全局变量，或者生命周期较长的对象，及时对无用的数据进行垃圾回收
- 注意程序逻辑，避免“死循环”之类的 
- 避免创建过多的对象
- 减少层级过多的引用

## 安全

### XSS
XSS，即 Cross Site Script，中译是跨站脚本攻击；其原本缩写是 CSS，但为了和层叠样式表(Cascading Style Sheet)有所区分，因而在安全领域叫做 XSS。

攻击者对客户端网页注入的恶意脚本一般包括 JavaScript，有时也会包含 HTML 和 Flash。有很多种方式进行 XSS 攻击，但它们的共同点为：将一些隐私数据像 cookie、session 发送给攻击者，将受害者重定向到一个由攻击者控制的网站，在受害者的机器上进行一些恶意操作

防范：

- HttpOnly 防止劫取 Cookie
- 输入检查，不相信用户的任何输入


### CSRF
CSRF，即 Cross Site Request Forgery，中译是跨站请求伪造，是一种劫持受信任用户向服务器发送非预期请求的攻击方式。


CSRF 攻击是攻击者借助受害者的 Cookie 骗取服务器的信任，可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击服务器，从而在并未授权的情况下执行在权限保护之下的操作

## ES6
### 1. 箭头函数与 function 函数有什么区别？
箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1. 箭头函数体内的 `this` 对象，就是**定义时所在的对象**，而不是使用时所在的对象，所以**无法通过 call 和 apply 等来改变 this 指向**
1. 箭头函数**不可以使用 arguments 对象**，该对象在函数体内不存在，如果要用，可以用 `rest` 参数代替
1. **不可以使用 yield 命令**，因此箭头函数不能用作 Generator 函数。
1. **不可以使用 new 命令**，因为：
   - **没有自己的 `this`，无法调用 `call` 和 `apply`**。
   - **没有 `prototype` 属性** ，而 `new` 命令在执行时需要将构造函数的 `prototype` 赋值给新的对象的 `__proto__`



### 2. let const var的区别

- `let` 的用法类似于 `var`，但是 `let` 只在所在的代码块内有效，所以我们一般使用 `let` 替代 `var`
- 而 `const` 用来声明常量。`var` 经常有变量提升，允许重复声明，`let` 和 `const` 不允许



### 3. Set、Map 和 WeakSet、WeakMap 区别

- `Set`: 它类似于数组，但是成员的值都是唯一的，没有重复的值。
- `WeakSet`: 结构与 Set 类似，也是不重复的值的集合。但是，WeakSet 的成员只能是对象，而不能是其他类型的值
- `WeakMap`: 和 WeakSet 很相似，只不过 WeakMap 的键会检查变量的引用，只要其中任意一个引用被释放，该键值对就会被删除。WeakMap 不能包含无引用的对象，否则会被自动清除出集合（垃圾回收机制）,WeakSet 对象是不可枚举的，无法获取大小
- `Map`: Map对象的键可以是任何类型, WeakMap 对象中的键只能是对象引用



### 4. ES6 模块 与 commonjs、amd、amd 的区别

1. CommonJS 的规范中，每个 JavaScript 文件就是一个独立的模块上下文（module context），在这个上下文中默认创建的属性都是私有的。也就是说，在一个文件定义的变量（还包括函数和类），都是私有的，对其他文件是不可见的。
1. CommonJS是同步加载模块,在浏览器中会出现堵塞情况，所以不适用
1. AMD 异步，需要定义回调define方式
1. es6 一个模块就是一个独立的文件，该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量
1. es6还可以导出类、方法，自动适用严格模式



### 5. ES5 / ES6 的继承除了写法，还有什么区别？

1. `class` 声明子类可以直接通过 `__proto__` 寻址到父类,而通过 ES5 的方式，`Sub.__proto__ === Function.prototype`
1. `class` 声明会提升，但不会初始化赋值。`Foo` 进入暂时性死区，类似于 `let`、`const` 声明变量。
1. `class` 声明内部会启用严格模式。
1. `class` 的所有方法（包括静态方法和实例方法）都是不可枚举的。
1. `class` 的所有方法（包括静态方法和实例方法）都没有原型对象`prototype`，所以也没有`[[construct]]`，不能使用 `new` 来调用。
1. 必须使用 `new` 调用 `class`。
1. `class` 内部无法重写类名。



### 6. es6的新特性

- let、const
- 解构赋值
- promise
## JS API
### 1. slice 和 splice 区别

- `slice` 表示截取，slice(start,end)，不改变原数组，返回新数组。 
- `splice` 表示删除，splice(start,length,item)，会改变原数组，从某个位置开始删除多个元素，可以插入新的元素



### 2. load 事件和 DOMContentLoaded 事件区别？

- load页面加载完毕触发
- domcontentload dom树加载完成，其他js、css资源还未加载好