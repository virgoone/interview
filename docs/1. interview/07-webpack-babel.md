# 工程化

## Webpack
### 1.什么是 loader 和 plugin？二者的区别是什么？
| 区别 | Loader | Plugin |
| --- | --- | --- |
| 概念 | Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 Webpack 只认识 JavaScript，所以 Loader 就成为了翻译官，对其他类型的资源进行转译的预处理工作。 | Plugin 就是插件，基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果 |
| 用法 | 在 `module.rules` 中配置，作为模块的解析规则，类型为数组。每一项都是一个 `Object`，内部包含了 `test`（类型文件），`loader`，`options`（参数）等属性 | 在 `plugins` 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入 |

### 2.Webpack热更新原理

- webpack-dev-server 启动本地服务，建立websocket通信
- 监听webpack编译结束、文件变化
- 浏览器收到热更新通知
- hotApply模块替换

### 3.Webpack 构建流程

1. **初始化参数**：从配置文件（如 `webpack.config.js` ）和 Shell 语句中读取与合并配置参数，得到最终的参数
1. **加载插件**：将所需的 webpack 插件实例化，在 webpack 事件流上挂载插件钩子，这样在合适的构建过程中，插件就具备了改动产出结果的能力
1. **确定入口**：根据配置中的 `entry` 找出入口文件（可以不止一个）
1. **编译模块**：从入口文件开始依赖收集，对所有以来的文件进行编译，编译过程依赖 **Loaders**，不同类型的文件根据开发者定义的不同 Loader 进行解析。之后再递归编译直到所有入口依赖的文件都经过了本步骤的处理
1. **分块**：将编译好的内容解析生成抽象语法树，分析分析入口与模块间依赖关系，根据依赖关系组装成一个个包含多个模块的 Chunk，然后使用 webpack 自己的加载器进行模块化实现，再把每个 Chunk 转换成一个单独的文件加入到输出列表
1. **输出完成**：在确定好输出内容后，根据配置 `output` 的路径和文件名，把文件内容写入到文件系统

### 4.Webpack 有做过什么优化，怎么做的

- 借助 `webpack-bundle-analyzer` 分析资源文件过大的问题，抽离公共文件
- 利用`tree-shaking`删除无用代码
- 利用`hard-source-webpack-plugin`中间缓存缩短构建时间
- 离线缓存等

### 5. Webpack 的 Hot Reload 的原理是什么？

Webpack 的热更新又称热替换（**Hot Module Replacement**），缩写为 **HMR**，这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。


HMR 的核心就是客户端从服务端去拉更新后的文件，准确的说是 chunk diff（chunk 需要更新的部分），实际上 WDS 与浏览器之间维护了一个 **Websocket**，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容（文件列表、hash），这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该 chunk 的增量更新。


后续的部分（拿到增量后的更新，保留的状态，确定需要更新的部分）由 `HotModulePlugin`   来完成，提供了相关 API 以供开发者针对自身场景进行处理，像 `react-hot-loader`  和 vue-loader` 都是借助这些 API 实现 HMR。

### 6.Tree-Shaking 的原理是什么？
TBD

### 7.什么是 DCE？
TBD

### 8.介绍一下 webpack 的 scope hoisting
TBD

### 9.webpack 怎么提升构建性能？
TBD

## Babel

### 1. 介绍一下 Babel 的原理？
Babel 的编译过程和大多数其他语言的编译器相似，可以分为三个阶段：

1. **解析**：通过解析器（@babel/parser）将 JavaScript 代码转化为 AST 抽象语法，解析的过程有两个阶段：
   1. **词法分析阶段**：字符串形式的代码转换为令牌（tokens）流，令牌类似于 AST 中的节点
   1. **语法分析阶段**：把一个令牌流转化为 AST 的形式，同时这个阶段会把令牌中的信息转化为 AST 的表述结构
2. **转换**：Babel 接受解析得到的 AST 并通过 **babel-traverse** 对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作
2. **生成**：将经过转换的 AST 通过 babel-generator 在转换成 JavaScript 代码，深度遍历整个 AST，然后构建转换后的代码字符串

### 2.Babel 怎么把字符串解析成 AST，进行词法/语法分析的?

大致分为以下四步：

1. **input => **[**tokenizer**](https://github.com/caiyongmin/awesome-coding-javascript/tree/master/src/bundler/babel/lib/tokenizer.js)** => tokens：**先对输入代码进行**分词**，根据最小有效语法单元，对字符串进行切割
1. **tokens => **[**parser**](https://github.com/caiyongmin/awesome-coding-javascript/tree/master/src/bundler/babel/lib/parser.js)** => AST：**然后进行**语法分析**，会涉及到读取、暂存、回溯、暂存点销毁等操作。
1. **AST => **[**transformer**](https://github.com/caiyongmin/awesome-coding-javascript/tree/master/src/bundler/babel/lib/transformer.js)** => newAST：**然后**转换**生成新的 AST。
1. **newAST => **[**codeGenerator**](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/src/bundler/babel/lib/codeGenerator.js)** => output：**最后根据新生成的 AST **输出**目标代码。