# 类型

## 内置类型

![内置类型](https://tva1.sinaimg.cn/large/0081Kckwgy1gl8fu3cly3j31ik0r478s.jpg)

JS 中分为七种内置类型，七种内置类型又分为两大类型：**基本类型**和**对象（Object）**。

基本类型（值类型）有六种：
- `null`
- `undefined`
- `boolean`
- `number`
- `string`
- `symbol`

引用类型： 对象 `object`

`NaN` 也属于 `number` 类型，并且 `NaN` 不等于自身。

对于基本类型来说，如果使用字面量的方式，那么这个变量只是个**字面量**，只有在必要的时候才会**转换为对应的类型**（存放值）

```js
let a = 111 // 这只是字面量，不是 number 类型
a.toString() // 使用时候才会转换为对象类型
```

对象（Object）是**引用类型**（**存放地址**），在使用过程中会遇到浅拷贝和深拷贝的问题。

```js
let a = { name: 'FE' }
let b = a
b.name = 'EF'
console.log(a.name) // EF
```

### 值类型和引用类型的区别

根据 JavaScript 中的变量类型传递方式，又分为**值类型**和**引用类型**，值类型变量包括 `boolean`、 `string`、 `number`、 `undefined`、 `null`，引用类型包括了 `object` 类的所有，如 `Date`、`Array`、`Function` 等。在参数传递方式上，值类型是**按值传递**，引用类型是**按共享传递**。

值类型：
  1. 存放的是**值**
  2. 存放在**栈**中
     1. 占据空间**小**
     2. **大小稳定**

引用类型：
  1. 存放的是**地址**
  2. 存放在**堆**中
     1. 占据空间**大**，**大小不稳定**，存在栈中会影响运行性能
     2. 在栈中存放了**指针**，该指针**指向堆中该实体的起始位置**
     3. 当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体

## 类型判断

### typeof

`typeof` 对于基本类型，**除了 `null` 都可以显示正确的类型**

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof b // b 没有声明，但是还会显示 undefined
```

`typeof` 对于对象，**除了函数都会显示 `object`**

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

对于 `null` 来说，虽然它是基本类型，但是会显示 `object`，这是一个存在很久了的 Bug

```js
typeof null // 'object'
```

> 为什么会出现这种情况呢？
> 
> 因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，`000` 开头代表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object` 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

如果我们想获得一个变量的正确类型，可以通过 `Object.prototype.toString.call(xx)`。这样我们就可以获得类似 `[Object Type]` 的字符串。

### instanceof
**用于实例和构造函数的对应**。例如判断一个变量是否是数组，使用 `typeof` 无法判断，但可以使用 `[1, 2] instanceof Array` 来判断。因为，`[1, 2]` 是数组，它的构造函数就是  `Array`。同理：
```js
function Foo(name) {
    this.name = name
}
var foo = new Foo('bar')
console.log(foo instanceof Foo) // true
```
### Array.isArray
用于判断数组，如 `Array.isArray([1, 2]) === true`

### Object.prototype.toString.call()
同样可以用于**用于实例和构造函数的对应**，得到类似 `[Object Type]` 的字符串

## 类型转换

### 转 Boolean( if条件判断 )

在条件判断时，除了 `undefined`， `null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`，包括所有对象。

### 对象转基本类型

对象在转换基本类型时，首先会调用 `.valueOf` 然后调用 `.toString`。并且这两个方法你是可以重写的。


当然你也可以重写 `Symbol.toPrimitive` ，该方法在转基本类型时调用优先级最高。

```js
let a = {
  valueOf() {
    return 0;
  },
  toString() {
    return '1';
  },
  [Symbol.toPrimitive]() {
    return 2;
  }
}
1 + a // => 3
'1' + a // => '12'
```

### 四则运算符

只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型（**字符串拼接**）。其他运算只要其中一方是数字，那么另一方就转为数字。并且加法运算会触发三种类型转换：将值转换为**原始值**，转换为**数字**，转换为**字符串**。

```js
1 + '1' // '11'
2 * '2' // 4
[1, 2] + [2, 1] // '1,22,1'
// [1, 2].toString() -> '1,2'
// [2, 1].toString() -> '2,1'
// '1,2' + '2,1' = '1,22,1'
```

对于加号需要注意这个表达式 `'a' + + 'b'`

```js
'a' + + 'b' // -> "aNaN"
// 因为 + 'b' -> NaN
// 你也许在一些代码中看到过 + '1' -> 1
```

### `==` 操作符

1. 若x和y类型**相同**：
    1. 类型同为 `undefined`、 `null`，则返回 `true`
    2. 类型同为 `string`，相同字符序列则返回 `true`
    3. 类型同为 `boolean`，相同则返回 `true`
    4. 类型同为 `object`，x、y若引用同一对象则返回 `true`，否则返回 `false`
    5. 类型同为 `number`，其中一个为 `NaN`，必返回 `false`，再判断值，相等则返回 `true`
2. 若x和y类型**不同**：
    1. 其中一个为 `null`，另一个为 `undefined`,返回 `true`
    2. 其中一个为 `number`，另一个为 `string`,则 `ToNumber(string)` 转成 `number` 再比较
    3. 其中一个为 `number`，另一个为 `boolean`,则 `ToNumber(boolean)` 转成 `number` 再比较
    4. 其中一个为 `object`，另一个为 `string` 或 `number`,则 `ToPrimitive(object)` 转成相同类型再比较

上图中的 `toPrimitive` 就是对象转基本类型。

这里来解析一道题目 `[] == ![] // -> true` ，下面是这个表达式为何为 `true` 的步骤

```js
// [] 转成 true，然后取反变成 false
[] == false
// 根据第 8 条得出
[] == ToNumber(false)
[] == 0
// 根据第 10 条得出
ToPrimitive([]) == 0
// [].toString() -> ''
'' == 0
// 根据第 6 条得出
0 == 0 // -> true
```

### 比较运算符

1. 如果是对象，就通过 `toPrimitive` 转换对象
2. 如果是字符串，就通过 `unicode` 字符索引来比较
