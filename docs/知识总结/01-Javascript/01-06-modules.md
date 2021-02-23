# 模块化

## ES6 前的模块化时代

## CommonJS

CommonJS 规范概述了**同步声明依赖**的模块定义。这个规范主要用于服务端实现代码模块化组织。

CommonJS 使用了 `require()` 指定依赖，而使用 `exports` 对象定义自己的公共 API。

```js
const moduleB = require('./moduleB');

module.exports = {
  stuff: module.doStuff(),
};
```

CommonJS 的模块化具有以下特点：

- 文件即模块，文件内的所有代码都运行在独立的作用域中，因此不会污染全局空间
- 在 CommonJS 中，**模块加载是模块系统执行的同步操作**
- 无论一个模块在 `require()` 中被引用多少次，模块永远是**单例**
- `module.exports` 输出的是**值的拷贝**，因此一旦这个值被输出，模块内在发生变化也不会影响到输出的值
- 模块按照代码引入的顺序进行加载

## AMD 异步模块定义

CommonJS 以服务端为目标环境，能够一次性把所有模块加载到内存，而异步模块定义（AMD，Asynchronous Module Definition）的模块定义系统则以浏览器为目标执行环境，这需要考虑网络延迟的问题。AMD 的一般策略是让模块声明自己的依赖，而运行在浏览器中的模块系统会按需获取依赖，并在依赖加载完成后立即执行依赖他们的模块。

AMD 模块实现的核心使用函数包装模块定义。这样可以防止声明全局变量，并允许加载器库控制合适加载模块。包装模块的函数是全局 `define` 的参数，它是由 AMD 加载器库的实现定义的。

AMD 模块可以使用**字符串标识符**指定自己的依赖，而 AMD 加载器会在所有依赖模块加载完毕后立即调用模块工厂函数。与 CommonJS 不同，AMD 支持可选地为模块指定字符串标识符。

```js
define('moduleA', ['moduleB'], function(moduleB) {
  return {
    stuff: moduleB.doStuff(),
  };
});
```

AMD 也支持 `require` 和 `exports` 对象，通过它们可以在 AMD 模块工厂函数内部定义 CommonJS 风格的模块。这样可以像请求模块一样请求它们，但 AMD 加载器会将他们识别为原生 AMD 结构，而不是模块定义，动态加载也是通过这种方式支持的。

## CMD

CMD（Common Module Definition）规范整合了 CommonJS 和 AMD 规范的特点，实现为 sea.js，与 AMD 的两个主要区别为：

1. AMD 需要异步加载模块，而 CMD 在加载模块时，可通过同步的形式（require），也可以通过异步的形式（require.async）
2. **CMD 遵循依赖就近原则，AMD 遵循依赖前置原则**。也就是说，AMD 中，我们需要把模块所需要的依赖都提前声明在依赖数组中；而在 CMD 中，我们只需要在具体代码逻辑内，使用依赖前，引入依赖的模块即可。

## UMD

UMD（Universal Module Definition）同时整合了 CommonJS 和 AMD 规范。该规范的思想在于利用立即执行函数根据环境来判断需要的参数类别，当 UMD 在判断出当前模块遵循 CommonJS 规范时，代码通过以下方式执行：

```js
function (factory) {
  module.exports = factory()
}
```

而如果是 UMD 判断出当前模块遵循 AMD 规范，则函数的参数就会变成 `define`，适用 AMD 规范，如下所示：

```js
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD 规范
    define(['b'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // 类 Node 环境，并不支持严格的 CommonJS
    // 但是属于 CommonJS-like 环境，支持 module.exports 语法
    module.exports = factory(require('b'));
  } else {
    // 浏览器环境
    root.returnExports = factory(root.b);
  }
})(this, function(b) {
  // 返回值作为暴露内容
  return {};
});
```

## ES6 模块

ES6 模块的设计思想是尽可能**静态化**，这样能保证在**编译时就确定模块之间的依赖关系**，每个模块的输入输出变量也都是确定的；而 CommonJS 和 AMD 模块无法保证在编译时就确定这些内容，它们都只能在运行时确定。这是 ES6 模块和其他模块规范最大的区别。第二个差别在于，CommonJS 模块输出的是值的拷贝，而 **ES6 模块输出的是值的引用**。

### 模块行为

ES6 模块借用了 CommonJS 和 AMD 的很多优秀特性。

- 模块代码只在加载后执行
- 模块代码只加载一次
- 模块是单例
- 模块可以定义公共接口，其他模块可以基于这个公共接口观察和交互
- 模块可以请求加载其他模块
- 支持循环依赖

ES6 模块也增加了一些新行为。

- ES6 模块默认在严格模式下执行
- ES6 模块不共享全局命名空间
- 模块顶级 `this` 是 `undefined`
- 模块中的 `var` 声明不会添加到 `window` 对象
- ES6 模块是异步加载和执行的
