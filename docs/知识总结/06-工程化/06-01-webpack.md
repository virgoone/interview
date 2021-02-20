# Webpack

## Loader

### 常见的 Loader

- **raw-loader**：加载文件原始内容（utf-8）
- **file-loader**：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件（处理图片和字体）
- **url-loader**：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值会返回文件 base64 形式编码（处理图片和字体）
- **source-map-loader**：加载额外的 Source Map 文件，以方便断点调试
- **svg-inline-loader**：将压缩后的 SVG 内容注入代码中
- **image-loader**：加载并且压缩图片文件
- **json-loader**：加载 JSON 文件（默认包含）
- **babel-loader**：把 ES6 转换成 ES5
- **ts-loader**：将 TypeScript 转换成 JavaScript
- **awesome-typescript-loader**：将 TS 转换成 JS，性能优于 `ts-loader`
- **sass-loader**：将 SCSS/SASS 代码转换成 CSS
- **css-loader**：加载 CSS，支持模块化、压缩、文件导入等特性
- **style-loader**：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
- **postcss-loader**：扩展 CSS 语法，使用下一代 CSS，可以配合 `autoprefixer` 插件自动补齐 CSS3 前缀
- **eslint-loader**：通过 ESlint 检查 JavaScript 代码
- **tslint-loader**：通过 TSlint 检 TypeScript 代码
- **mocha-loader**：加载 Mocha 测试用例的代码
- **coverjs-loader**： 计算测试的覆盖率
- **vue-loader**：加载 Vue.js 单文件组件
- **i18n-loader**：国际化
- **cache-loader**：可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里

## Plugin

### 常见的 Plugin

- **define-plugin**：定义环境变量（Webpack4 后指定 mode 会自动配置）
- **ignore-plugin**：忽略部分文件
- **html-webpack-plugin**：简化 HTML 文件创建（依赖 `html-loader`）
- **web-webpack-plugin**：可方便地为单页应用输出 HTML，比 `html-webpack-plugin` 好用
- **uglifyjs-webpack-plugin**：不支持 ES6 压缩（Webpack4 之前）
- **terser-webpack-plugin**：支持压缩 ES6（Webpack4）
- **webpack-parallel-uglify-plugin**：多进程执行代码压缩，提升构建速度
- **mini-css-extract-plugin**：分离样式文件，CSS 提取为独立文件，支持按需加载（代替 `extract-text-webpack-plugin`）
- **serviceworker-webpack-plugin**：为网页增加离线缓存功能
- **clean-webpack-plugin**：目录清理
- **speed-measure-webpack-plugin**：可以看到每个 Loader 和 Plugin 打包时执行耗时
- **webpack-bundle-analyzer**：可视化 Webpack 输出文件的体积（业务组件、依赖第三方模块）

## Loader 和 Plugin 的区别

| 区别 | Loader                                                                                                                                                                          | Plugin                                                                                                                                                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 概念 | Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 Webpack 只认识 JavaScript，所以 Loader 就成为了翻译官，对其他类型的资源进行转译的预处理工作。 | Plugin 就是插件，基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果 |
| 用法 | 在 `module.rules` 中配置，作为模块的解析规则，类型为数组。每一项都是一个 `Object`，内部包含了 `test`（类型文件），`loader`，`options`（参数）等属性                             | 在 `plugins` 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入                                                                                                        |

## 构建流程

1. **初始化参数**：从配置文件（如 `webpack.config.js` ）和 Shell 语句中读取与合并配置参数，得到最终的参数
2. **加载插件**：将所需的 webpack 插件实例化，在 webpack 事件流上挂载插件钩子，这样在合适的构建过程中，插件就具备了改动产出结果的能力
3. **确定入口**：根据配置中的 `entry` 找出入口文件（可以不止一个）
4. **编译模块**：从入口文件开始依赖收集，对所有以来的文件进行编译，编译过程依赖 **Loaders**，不同类型的文件根据开发者定义的不同 Loader 进行解析。之后再递归编译直到所有入口依赖的文件都经过了本步骤的处理
5. **分块**：将编译好的内容解析生成抽象语法树，分析分析入口与模块间依赖关系，根据依赖关系组装成一个个包含多个模块的 Chunk，然后使用 webpack 自己的加载器进行模块化实现，再把每个 Chunk 转换成一个单独的文件加入到输出列表
6. **输出完成**：在确定好输出内容后，根据配置 `output` 的路径和文件名，把文件内容写入到文件系统

## Compiler 和 Compilation

Compiler 和 compilation 是 webpack 核心概念，是理解 webpack 的工作原理、loader 和 plugin 工作的基础。

**Compiler 对象**：Compiler 对象的实例包含了完整的 webpack 配置，且全局只有一个 compiler 实例，因此它就像 webpack 的骨架或神经中枢。当插件被实例化的时候，就会收到一个 Compile 对象，通过这个对象可以访问 webpack 的内部环境。

**Compilation 对象**：当 webpack 以开发模式运行时，每当检测到文件变化时，一个新的 compilation 对象就会被创建。这个对象包含了当前的模块资源、编译生成资源、变化的文件等信息。也就是说，所有构建过程中产生的构建数据都会被存储在该对象上，它也掌控着构建过程的每一个环节。该对象还提供了很多事件回调供插件做扩展。

webpack 的构建过程是通过 compiler 控制流程，通过 compilation 进行代码解析的。在开发插件时，我们可以从 compiler 对象中得到所有与 webpack 主环境相关的内容，包括事件钩子。

## 热模块替换 Hot Module Replacement

Webpack 的热更新又称热替换（**Hot Module Replacement**），缩写为 **HMR**，这个机制可以做到**不用刷新浏览器而将新变更的模块替换掉旧的模块**。

模块热替换技术的优势有：

- 实时预览反应更快，等待时间更短。
- 不刷新浏览器能保留当前网页的运行状态，例如在使用 Redux 来管理数据的应用中搭配模块热替换能做到代码更新时 Redux 中的数据还保持不变。

总的来说模块热替换技术很大程度上的提高了开发效率和体验。

### 热模块替换原理

模块热替换的原理和自动刷新原理类似，都需要往要开发的网页中注入一个代理客户端用于连接 DevServer 和网页， 不同在于模块热替换独特的模块替换机制。

HMR 的核心就是客户端从服务端去拉更新后的文件，准确的说是 chunk diff（chunk 需要更新的部分），实际上 WDS 与浏览器之间维护了一个 **Websocket**，当本地资源发生变化时，WDS（Webpack Dev Server） 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容（文件列表、hash），这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该 chunk 的增量更新。

后续的部分（拿到增量后的更新，保留的状态，确定需要更新的部分）由 `HotModulePlugin` 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像 `react-hot-loader` 和 `vue-loader` 都是借助这些 API 实现 HMR。

## 文件指纹

文件指纹是指打包后的文件名的**后缀**。

- **Hash**：和整个项目的构建有关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- **Chunkhash**：和 webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
- **Contenthash**：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

### JS 的指纹设置

```js
module.exports = {
  entry: {
    app: './scr/app.js',
    search: './src/search.js',
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist',
  },
};
```

### Tree-shaking

具体来说，在 webpack 项目中，有一个入口文件，相当于一棵树的主干，入口文件有很多依赖的模块，相当于树枝。实际情况中，虽然依赖了某个模块，但其实只使用其中的某些功能。通过 tree-shaking，将没有使用的模块摇掉，这样来达到删除无用代码的目的。

#### Tree-shaking 的原理

Tree-shaking 的本质是消除无用的 js 代码。无用代码消除在广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为 DCE（dead code elimination）。

Tree-shaking 是 DCE 的一种新的实现，Javascript 同传统的编程语言不同的是，javascript 绝大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对 javascript 来说更有意义。

Tree-shaking 和传统的 DCE 的方法又不太一样，传统的 DCE 消灭不可能执行的代码，而 Tree-shaking 更关注于消除没有用到的代码。

##### 1. DCE 消除大法

Dead Code 一般具有以下几个特征

- 代码不会被执行，不可到达
- 代码执行的结果不会被用到
- 代码只会影响死变量（只写不读）

传统编译型的语言中，都是由编译器将 Dead Code 从 AST（抽象语法树）中删除，那 javascript 中是由谁做 DCE 呢？

首先肯定不是浏览器做 DCE，因为当我们的代码送到浏览器，那还谈什么消除无法执行的代码来优化呢，所以肯定是送到浏览器之前的步骤进行优化。

其实也不是上面提到的三个工具，rollup，webpack，cc 做的，而是著名的代码压缩优化工具 uglify，**uglify 完成了 javascript 的 DCE**

##### 2. Tree-shaking 消除大法

前面提到了 Tree-shaking 更关注于无用模块的消除，消除那些引用了但并没有被使用的模块。

先思考一个问题，为什么 tree-shaking 是最近几年流行起来了？而前端模块化概念已经有很多年历史了，其实 **tree-shaking 的消除原理是依赖于 ES6 的模块特性**

ES6 module 特点：

- 只能作为模块顶层的语句出现
- import 的模块名只能是字符串常量
- import binding 是 immutable 的

ES6 模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是 tree-shaking 的基础。

所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6 之前的模块化，比如我们可以动态 require 一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS，正是基于这个基础上，才使得 tree-shaking 成为可能，这也是为什么 rollup 和 webpack2 都要用 ES6 module syntax 才能 tree-shaking。

##### JavaScript Tree-shaking 的局限性

- rollup 只处理函数和顶层的 import/export 变量，不能把没用到的类的方法消除掉
- JavaScript 动态语言的特性使得静态分析比较困难
- Side Effect 广泛存在

Tree-shaking 效果不佳，对顶层纯函数效果更好

函数的副作用相对较少，顶层函数相对来说更容易分析，加上 babel 默认都是 "use strict" 严格模式，减少顶层函数的动态访问的方式，也更容易分析

#### 接入 Tree-shaking

首先，为了把采用 ES6 模块化的代码交给 Webpack，需要配置 Babel 让其保留 ES6 模块化语句，修改 `.babelrc` 文件为如下：

```json
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ]
}
```

其中 `"modules": false` 的含义是关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法。

之后 Webpack 就可以发现哪些函数用上了哪些没用上，要剔除用不上的代码还得经过 UglifyJS 去处理一遍。 要接入 UglifyJS 也很简单，不仅可以通过[4-8 压缩代码](http://webpack.wuhaolin.cn/4优化/4-8压缩代码.html)中介绍的加入 UglifyJSPlugin 去实现， 也可以简单的通过在启动 Webpack 时带上 `--optimize-minimize` 参数。

当你的项目使用了大量第三方库时，你会发现 Tree Shaking 似乎不生效了，原因是大部分 Npm 中的代码都是采用的 CommonJS 语法， 这导致 Tree Shaking 无法正常工作而降级处理。 但幸运的时有些库考虑到了这点，这些库在发布到 Npm 上时会同时提供两份代码，一份采用 CommonJS 模块化语法，一份采用 ES6 模块化语法。 并且在 `package.json` 文件中分别指出这两份代码的入口。

以 `redux` 库为例，其发布到 Npm 上的目录结构为：

```
node_modules/redux
|-- es
|   |-- index.js # 采用 ES6 模块化语法
|-- lib
|   |-- index.js # 采用 ES5 模块化语法
|-- package.json
```

`package.json` 文件中有两个字段：

```json
{
  "main": "lib/index.js", // 指明采用 CommonJS 模块化的代码入口
  "jsnext:main": "es/index.js" // 指明采用 ES6 模块化的代码入口
}
```

`mainFields` 用于配置采用哪个字段作为模块的入口描述。 为了让 Tree Shaking 对 `redux` 生效，需要配置 Webpack 的文件寻找规则为如下：

```js
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
};
```

以上配置的含义是优先使用 `jsnext:main` 作为入口，如果不存在 `jsnext:main` 就采用 `browser` 或者 `main` 作为入口。 虽然并不是每个 Npm 中的第三方模块都会提供 ES6 模块化语法的代码，但对于提供了的不能放过，能优化的就优化。

目前越来越多的 Npm 中的第三方模块考虑到了 Tree Shaking，并对其提供了支持。 采用 `jsnext:main` 作为 ES6 模块化代码的入口是社区的一个约定，假如将来你要发布一个库到 Npm 时，希望你能支持 Tree Shaking， 以让 Tree Shaking 发挥更大的优化效果，让更多的人为此受益。

### Scope Hoisting（作用域提升）

#### 原理

Scope Hoisting 的实现原理：**分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。 因此只有那些被引用了一次的模块才能被合并。**

由于 Scope Hoisting 需要分析出模块之间的依赖关系，因此源码必须采用 ES6 模块化语句，不然它将无法生效。

#### 使用 Scope Hoisting

要在 Webpack 中使用 Scope Hoisting 非常简单，因为这是 Webpack 内置的功能，只需要配置一个插件，相关代码如下：

```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
  ],
};
```

同时，考虑到 Scope Hoisting 依赖源码需采用 ES6 模块化语法，还需要配置 `mainFields`。 原因 ：因为大部分 Npm 中的第三方库采用了 CommonJS 语法，但部分库会同时提供 ES6 模块化的代码，为了充分发挥 Scope Hoisting 的作用，需要增加以下配置：

```js
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
};
```

对于采用了非 ES6 模块化语法的代码，Webpack 会降级处理不使用 Scope Hoisting 优化。
