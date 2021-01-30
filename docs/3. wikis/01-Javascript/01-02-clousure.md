# 作用域与闭包

## 作用域是什么

在 JavaScript 中，ES6 出现之前，一般来说只有**函数作用域**和**全局作用域**两种，而 ES6 增加了通过 `let` 和 `const` 声明变量而形成的**块级作用域**。

参与角色：

* **引擎**：从头到尾负责整个 JavaScript 程序的编译及执行过程
* **编译器**：引擎的好朋友之一，负责语法分析及代码生成等脏活累活
* **作用域**：负责收集并维护由所有声明的标识符（**变量**）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限

### 编译原理

尽管通常将 JavaScript 归类为“动态”或“解释执行“语言，但事实上它是一门**编译语言**。

#### 传统编译语言

传统编译语言的”编译“流程一般有三个步骤：

1. 分词/词法分析（Tokenizing/Lexing）：将字符组成的字符串分解成对编程语言来说有意义的代码块
2. 解析/语法分析（Parsing）：将词法单元流（数组）转换成一个由元素逐级嵌套所构成的代表了程序语法结构的树——**抽象语法树（Abstract Syntax Tree，AST）**
3. 代码生成：将 AST 转换为可执行代码

#### JavaScript 的编译

任何 JavaScript 代码都要进行编译，JavaScript 引擎不会有大量的时间来进行优化，因为**JavaScript的编译过程不是发生在构建之前的**，大部分情况下编译过程发生在代码执行前的**几微秒**。

##### 例：变量的赋值操作编译

变量的赋值操作会执行两个操作：

1. （**编译**）首先编译器会在当前作用域中声明一个变量
2. （**运行**）然后在运行时引擎会在作用域中查找该变量，如果能够找到就对它赋值

#### LHS 查询和 RHS 查询

* **RHS**:赋值操作的“非左侧”查询，**赋值操作的源头**，简单地查找到某个变量的**值**
* **LHS**:赋值操作的左侧查询，**赋值操作的目标**，找到**变量的容器本身**

### 作用域嵌套

当一个块或函数嵌套在另一个块或函数时，就发生了作用域的嵌套

遍历嵌套作用域链的规则：

1. 在 JavaScript 中执行某个函数时，如果遇见变量且需要读取存值，就会**“就近”先在函数内部查找该变量的声明或赋值情况**。
2. 如果函数内无法找到该变量，就要跳出函数作用域，到**更上层作用域**中查找。
3. 更上层作用域也可以顺着作用域范围向外扩展，一直到**全局作用域**，无论是否找到都会停止

变量作用域的查找是一个扩散的过程，就像各个环节相扣的链条，逐次递进，这就是“**作用域链**”的由来。

#### LHS 和 RHS 的异常

如果 RHS 查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出**ReferenceError** 异常。如果找到了一个变量但进行不合理的操作，会抛出 **TypeError** 异常。

当引擎执行 LHS 查询时，如果在顶层（全局作用域）中也无法找到目标变量，全局作用域中就会**创建一个具有该名称的变量**，并返回给引擎。而严格模式中，禁止自动或隐式地创建全局变量，因此 LHS 查询失败后，会抛出 **ReferenceError** 异常。

#### 执行上下文

执行上下文就是当前代码的**执行环境作用域**，直观上看，执行上下文包含了作用域链，同时他们又像是一条河的上下游：有了作用域链，才会有执行上下文的一部分。

##### 代理执行的两个阶段

执行 JavaScript 代码主要分为两个阶段：

1. **代码预编译阶段**：编译器会将 JavaScript 的代码编译成可执行的代码（JS 是解释型语言，编译一行，执行一行），在这个阶段，JS 引擎会做一些“预先准备工作”，在语法分析之后，会对 JavaScript 代码中变量的**内存空间进行分配**，具体包括：
   * 在预编译阶段进行**变量声明**
   * 在预编译阶段进行**变量提升**，但是值为 `undefined`
   * 在预编译阶段对所有**非表达式的函数声明**进行提升
2. **代码执行阶段**：执行代码逻辑，**执行上下文会在这个阶段全部创建完成**

因此，得知**作用域在预编译阶段确定，但是作用域链是在执行上下文的创建阶段完成生成的，因为函数在调用时才会开始创建对应的执行上下文**。

## 词法作用域

作用域有两种主要的工作模型：**词法作用域**和动态作用域。

词法作用域就是**定义在词法阶段的作用域**，即**词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的**，因此**词法分析器处理代码时会保持作用域不变**（大部份情况下）

无论函数**在哪里被调用**，也无论它**如何被调用**，它的**词法作用域都只由函数被声明时所处的位置决定**

### 作用域查找

作用域查找会在**找到第一个匹配的标识符时停止**，在多层的嵌套作用域中可以定义同名的标识符，即**遮蔽效应**（内部的标识符遮蔽了外部的标识符）

### 欺骗词法作用域

##### eval

`eval(...)` 函数可以接受一个字符串参数，并将其中的内容视为好像在书写时就存在于程序中这个位置的代码。默认情况下，如果 `eval(...)` 中所执行的代码包含有一个或多个声明，就会对 `eval(...)` **所处的词法作用域进行修改**。

类似的还有 `setTimeout(...)` 和 `setInterval(...)`，其中第一个参数可以是字符串，其内容可以解释为一段动态生成的函数代码。

##### with

`with` 通常被当作重复引用同一个对象中的多个属性的快捷方式，可以**不需要重复引用对象本身**。`with` 可以将一个没有或有多个属性的对象处理为一个完全隔离的词法作用域，因此这个对象的属性也会被处理为定义在这个作用域中的词法标识符。

其实，`with` 声明实际上是根据你传递给它的对象凭空创建了一个**全新的词法作用域**。

##### 性能

欺骗词法作用域会让代码运行得更慢，因为引擎不会对代码做任何优化。

### 函数作用域和块作用域

#### 隐藏内部实现

基于作用域的隐藏方法，是从**最小特权原则**引申出来的，好处是可以**规避冲突**。

处理变量冲突的方法：

1. **全局命名空间**：第三方库通常在全局作用域中声明一个名字足够独特的变量，通常是一个**对象**，这个对象被用作库的**命名空间**，所有需要暴露给外界的功能都会成为这个对象的属性
2. **模块管理**：任何库都无需将标识符加入到全局作用域中，而是通过**依赖管理器**的机制将库的标识符显式地导入到另外一个特定的作用域中

#### 函数声明和函数表达式

区分函数声明和表达式的方法：看 `function` 关键字出现在声明中的位置，如果 `function` 是声明中的第一个词，那么就是一个**函数声明**，否则就是一个**函数表达式**。

而**函数表达式可以是匿名的，而函数声明不可以省略函数名**，考虑匿名函数的缺点：

1. 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试困难
2. 如没有函数名，当函数需要引用自身时只能使用已过期的 `arguments.callee` 引用，如递归，监听事件的解绑。
3. 匿名函数省略了对代码可读性/可理解性很重要的函数名

#### 立即执行函数表达式（IIFE）

常用写法：

1. `(function() {...})()`
2. `(function() {...}())`

#### 块级作用域

作用域概念不断演进吗，ES6 中增加了通过 `let` 和 `const` 声明变量的**块级作用域**。块级作用域就是指**作用域范围限制在代码块中**，好处在变量的声明应该距离使用的地方越近越好，并最大限度地本地化。

块作用域是一个用来对之前的**最小授权原则**进行扩展的工具，将代码在函数中隐藏信息扩展为**在块中隐藏信息**。

其他的块作用域：

1. `with`：用 `with` 从对象中创建出的作用域仅在 `with` 声明中而非外部作用域中有效
2. `try/catch`：`catch` 分句会创建一个块作用域，其声明的变量仅在 `catch` 内部有效

#### 暂时性死区（TDZ，Temporal Dead Zone）

使用 `let` 和 `const` 声明变量时会针对这个变量形成一个封闭的块级作用域，在这个块级作用域中，如果声明变量前访问在该变量，就会报 `referenceError` 错误；如果在声明后访问则正常。

这是因为声明 `let` 和 `const` 变量后，作用域中存在着一个「**死区**」，起始于作用域开头，终止于相关变量声明语句的所在行，在这个范围内无法访问上述变量。

除了块级作用域，**函数参数默认值**也会受到暂时性死区的影响。

```js
function foo(arg1 = arg2, arg2) {
  console.log(`${arg1} ${arg2}`)
}

foo(undefined, 'arg2') // Uncaught ReferenceError: arg2 is not defined
```

#### 变量提升

从之前的编译器可知，**包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理**，这个过程就好像变量和函数声明从他们在代码中出现的位置被“移动”到了最上面，即**提升**，而**只有声明本身会被提升**，而赋值或其他运行逻辑会留在原地。

> 函数声明会被提升，但是函数表达式却不会被提升

即使是**具名的函数表达式**，名称标识符在赋值之前也无法在所在作用域中使用：

```js
foo() // TypeError
bar() // ReferenceError

var foo = function bar(){
    // ...
}
```

这段代码经提升后，为：

```js
var foo

foo() // TypeError
bar() // ReferenceError

var foo = function() {
    var bar = ...self...
    // ...
}

```





#### 函数优先

其中**函数声明的优先级高于变量**，如果变量名跟函数名相同且未赋值，则函数声明会覆盖变量声明，如果函数有多个同名参数，那么最后一个参数（即使没有定义）会覆盖前面的同名参数。

### 作用域闭包

闭包的定义：当函数可以**记住**并**访问**所在的词法作用域，就产生了**闭包**，即使函数**是在当前词法作用域之外执行**。

#### 闭包的应用

本质上无论何时何地，如果将（访问它们各自词法作用域的）函数当作第一级的值类型并导出传递，就是对闭包在这些函数内的应用：

* 定时器、事件监听器
* Ajax 请求、跨窗口通信、Web Workers 或其他异步或同步任务中

而 IIFE 函数严格来讲不是闭包，因为它**并不是在它本身的词法作用域以外执行的**。

从技术上讲，**闭包是在定义时发生的**。

##### 模块

JavaScript 中的**模块**模式也是闭包的应用。模块模式有两个必备条件：

1. **必须有外部的封闭函数**，该函数必须至少被调用一次
2. **封闭函数必须返回至少一个内部函数**，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态

###### 现代的模块机制

```js
var MyModules = (function Manager() {
    var modules = {}
    
    function define(name, deps, impl) {
        for(var i=0; i<deps.length; i++) {
            deps[i] = modules[deps[i]]
        }
        modules[name] = impl.apply(imps, deps)
    }
    
    function get(name) {
        return modules[name]
    }
    
    return {
        define: define,
        get: get
    }
}
)
```

###### 未来的模块机制

之前的基于函数的模块并不是一个能被静态识别的模式，而 ES6 模块 API 是静态的，因此可以在**编译器检查对导入模块的 API 成员的引用是否真实存在**。如果 API 不存在，编译器会在编译时就抛出早期错误。

ES6 的模块没有行内模式，必须被定义在独立的文件（一个文件一个模块）中。浏览器或引擎有一个默认的“模块加载器”，可以在导入模块时同步地加载模块文件，而**模块文件中的内容会被当作好像包含在作用域闭包中一样处理**。
