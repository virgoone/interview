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

## Webpack 热更新

Webpack 的热更新又称热替换（**Hot Module Replacement**），缩写为 **HMR**，这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR 的核心就是客户端从服务端去拉更新后的文件，准确的说是 chunk diff（chunk 需要更新的部分），实际上 WDS 与浏览器之间维护了一个 **Websocket**，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 `Ajax` 请求来获取更改内容（文件列表、hash），这样客户端就可以再借助这些信息继续向 WDS 发起 `jsonp` 请求获取该 chunk 的增量更新。

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
