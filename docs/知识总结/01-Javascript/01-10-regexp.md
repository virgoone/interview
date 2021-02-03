# 正则

## 正则表达式

### 元字符

| 元字符 |                                      作用                                      |
| :----: | :----------------------------------------------------------------------------: |
|   .    |                         匹配任意字符除了换行符和回车符                         |
|   []   |           匹配方括号内的任意字符。比如 [0-9] 就可以用来匹配任意数字            |
|   ^    | ^9，这样使用代表匹配以 9 开头。[`^`9]，这样使用代表不匹配方括号内除了 9 的字符 |
| {1, 2} |                               匹配 1 到 2 位字符                               |
| (yck)  |                            只匹配和 yck 相同字符串                             |
|   \|   |                              匹配 \| 前后任意字符                              |
|   \    |                                      转义                                      |
|   \*   |                       只匹配出现 0 次及以上 \* 前的字符                        |
|   +    |                        只匹配出现 1 次及以上 + 前的字符                        |
|   ?    |                                 ? 之前字符可选                                 |

### 修饰语

| 修饰语 |    作用    |
| :----: | :--------: |
|   i    | 忽略大小写 |
|   g    |  全局搜索  |
|   m    |    多行    |

### 字符简写

| 简写 |                  作用                  |
| :--: | :------------------------------------: |
|  \w  |          匹配字母数字或下划线          |
|  \W  | 和上面相反，匹配**非**字母数字或下划线 |
|  \s  |            匹配任意的空白符            |
|  \S  |      和上面相反，匹配**非**空白符      |
|  \d  |                匹配数字                |
|  \D  |       和上面相反，匹配**非**数字       |
|  \b  |          匹配单词的开始或结束          |
|  \B  | 和上面相反，匹配**非**单词的开始或结束 |

## 正则可用方法

### RegExp

RegExp 对象给我们提供了三种方法供我们使用，分别是 `test()`、`exec()`和 `compile()`。下面具体说一下这三个方法的用处。

#### 1. `.test()`

检索字符串中指定的值。返回 `true` 或 `false`。这个是我们平时最常用的方法。

```js
const reg = /hello \w{3,12}/;
alert(reg.test('hello js')); // false
alert(reg.test('hello javascript')); // true
```

#### 2. `.exec()`

检索字符串中指定的值。匹配成功返回一个数组，匹配失败返回 `null`。

```js
var reg = /hello/;
console.log(reg.exec('hellojs')); // ['hello']
console.log(reg.exec('javascript')); // null
```

#### 3. `.compile()`

`compile()` 方法用于改变 RegExp。
`compile()` 既可以改变检索模式，也可以添加或删除第二个参数。

```js
var reg = /hello/;
console.log(reg.exec('hellojs')); // ['hello']
reg.compile('Hello');
console.log(reg.exec('hellojs')); // null
reg.compile('Hello', 'i');
console.log(reg.exec('hellojs')); // ['hello']
```

### String

除了 RegExp 对象提供方法之外，String 对象也提供了四个方法来使用正则表达式。

#### **1.match()**

在字符串内检索指定的值,匹配成功返回存放匹配结果的数组，否则返回 null。这里需要注意的一点事，如果没有设置全局匹配 g，返回的数组只存第一个成功匹配的值。

```
var reg1=/javascript/i;
var reg2=/javascript/ig;
console.log('hello Javascript Javascript Javascript'.match(reg1));
//['Javascript']
console.log('hello Javascript Javascript Javascript'.match(reg2));
//['Javascript','Javascript','Javascript']
```

#### **2.search()**

在字符串内检索指定的值,匹配成功返回第一个匹配成功的字符串片段开始的位置，否则返回-1。

```
var reg=/javascript/i;
console.log('hello Javascript Javascript Javascript'.search(reg));//6
```

#### **3.replace()**

替换与正则表达式匹配的子串，并返回替换后的字符串。在不设置全局匹配 g 的时候，只替换第一个匹配成功的字符串片段。

```
var reg1=/javascript/i;
var reg2=/javascript/ig;
console.log('hello Javascript Javascript Javascript'.replace(reg1,'js'));
//hello js Javascript Javascript
console.log('hello Javascript Javascript Javascript'.replace(reg2,'js'));
//hello js js js
```

#### **4.split()**

把一个字符串分割成字符串数组。

```
var reg=/1[2,3]8/;
console.log('hello128Javascript138Javascript178Javascript'.split(reg));
//['hello','Javascript','Javascript178Javascript']
```
