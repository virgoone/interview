# Babel

## 定义

- Babel 是我们知道的将 ES6+ d 的代码编译成 ES5 代码且能稳定运行的最好的工具
- 同时它允许开发者开发插件，能够在编译时期转换 JavaScript 结构

## Babel 概述

Babel 的转译流程主要有三个环节：

1. **解析**：通过解析器（@babel/parser）将 JavaScript 代码转化为 AST 抽象语法，解析的过程有两个阶段：
   1. **词法分析阶段**：字符串形式的代码转换为令牌（tokens）流，令牌类似于 AST 中的节点
   2. **语法分析阶段**：把一个令牌流转化为 AST 的形式，同时这个阶段会把令牌中的信息转化为 AST 的表述结构
2. **转换**：Babel 接受解析得到的 AST 并通过 **babel-traverse** 对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作
3. **生成**：将经过转换的 AST 通过 babel-generator 在转换成 JavaScript 代码，深度遍历整个 AST，然后构建转换后的代码字符串

### Babel 中重要的对象 Vistor

babel 在处理一个节点时，是以访问者的形式获取节点的信息，并进行相关的操作，这种操作是通过 `visitor` 对象实现的。

在 visitor 中定义了处理不同节点的函数。

```js
visitor: {
  Program: {
    enter(path, state) {
      console.log('start processing this module...');
    },
      exit(path, state) {
        console.log('end processing this module!');
      }
  },
    ImportDeclaration:{
      enter(path, state) {
        console.log('start processing ImportDeclaration...');
        // do something
      },
        exit(path, state) {
          console.log('end processing ImportDeclaration!');
          // do something
        }
    }
}
```

### 抽象语法树 AST

- AST（Abstract Syntax Tree）是抽象语法树，AST 语法树每一层都拥有相同的结构，这样每一层结构也叫做**节点**（Node）。
- AST 是源代码的抽象语法结构树状表现形式，Webpack、ESlint、JSX、TypeScript 的编译和模块化规则之间的转化都是通过 AST 来实现对代码的检查、分析以及编译等操作。
- 一个 AST 可以由单一的节点或是成百上千个节点构成，它们组合在一起可以描述**用于静态分析的程序语法**。
