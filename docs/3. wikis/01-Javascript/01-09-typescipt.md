# TypeScript

[toc]

## 常用概念

### 类型推导

在没有显式声明变量类型时，TypeScript 会自动进行类型推导

#### 基础

在 TypeScript 中，有许多没有明确类型声明的地方，其实都可以将类型推导出来。

```ts
const x = 3
```

这里 `x` 变量的类型可以推导为 `number`。当初始化变量，成员，设置默认参数或定义函数返回值类型时，这类推导就会发生。

大多数的推导都如上例所示，非常直接。

#### 最好的通用类型推导

 当需要推导一个复杂的表达式时，它结果的类型是通过**“最好的通用类型”**原则来计算的。

```js
const x = [1, 0, null]  // (number | null)[]
```

为了推导出上述`x`变量的类型，我们必须考虑数组中的每一个元素的类型。

数组中有两个类型：`number` 和 `null`。因为“最好的通用类型”原则，所有必须拥有它们共同的结构，但他们之间并没有共同的超类，所以类型推导结果为 `(number | null)[]`

当没有找到合适的“最好的通用类型”时，结果**类型就会是空对象**，`{}`。因为这个类型没有任何成员，试图获取它的任何属性都会得到一个报错，因为所有的成员都不能有任何不明确的隐式定义。

#### 上下文类型推导

在 TypeScript 中，还有另一个方向的推导，被称为“**上下文类型**”。上下文类型在**表达式所处的位置可以被隐式推导类型时**发生。

```tsx
window.onmousedown = function(mouseEvent) {
    console.log(mouseEvent.button) // <- Error
}
```

上述代码会得到一个类型错误，因为 TypeScript 会使用 Window.onmousedown 函数的类型，来推导等号右边的类型，他就能推导出 `mouseEvent` 参数的类型，因此会得到一个错误。但是如果改函数表达式没有在一个特定的上下文位置，那么 `mouseEvent` 将是 `any` 类型，不会得到报错。

上下文类型推导在很多情况下都会进行。普遍的情况包括**函数调用的参数**，**赋值语句的右半部分**，**类型断言**，**对象和数组的元素**，以及**返回值**。

## 高级类型

### 索引类型

现在我们需要一个 pick 函数，这个函数可以从对象上取出指定的属性。

在 JavaScript 中这个函数应该是这样的:

```js
function pick(o, names) {
  return names.map(n => o[n]);
}

// 使用
const user = {
    username: 'Jessica Lee',
    id: 460000201904141743,
    token: '460000201904141743',
    avatar: 'http://dummyimage.com/200x200',
    role: 'vip'
}
const res = pick(user, ['id'])

console.log(res) // [ '460000201904141743' ]
```

现在需要在 TypeScript 中实现上述函数。

1. pick 函数的第一个参数 `o` 可以通过**可索引类型**，这个对象的 key 都是 `string` 而对应的值可能是任意类型
2. 第二个参数 `names` 明显是个字符串数组

```js
interface Obj {
    [key: string]: any
}

function pick(o: Obj, names: string[]) {
    return names.map(n => o[n])
}
```

这样似乎没有什么问题，但类型定义不够严谨：

1. 参数 `names` 的成员应该是参数 `o` 的属性，因此不应该是 string 这种宽泛的定义，应该更加准确
2. pick 函数的参数的返回值类型为 `any[]`，其实可以更加精准，pick 的返回值类型应该是所取的属性值类型的联合类型

这里我们必须了解两个操作类型符：**索引类型查询操作符**和**索引访问操作符**

#### 索引类型查询操作符： keyof

`keyof` 即索引类型查询操作符，我们可以用 keyof 作用于泛型 `T` 上来获取泛型 T 上的所有 public 属性名构成联合类型。

```js
class Images {
    public src: string = 'https'
    public alt: string = '谷歌'
    public width: number = 500
}

type propsNames = keyof Images // "src" | 'alt' | 'width'

```

#### 索引访问操作符： T[k]

通过 keyof 获取索引类型的属姓名后，需要通过属性名获取对应的属性值类型。

与 JS 中类似，访问类型的操作符也是通过 `[]` 来访问的，即 `T[k]`

```js
class Images {
    public src: string = 'https'
    public alt: string = '谷歌'
    public width: number = 500
}

type propsNames = keyof Images // "src" | 'alt' | 'width'

type propsType = Images[propsNames] // string | number
```

#### 使用索引类型来描述 pick 函数

1. 使用一个泛型 `T` 来代表传入的参数 `o` 的类型，因为我们在写代码时无法确定参数 `o` 的类型。
2. 第二个参数 `names` 是由参数 `o` 的属姓名称构成，因此可以用 `keyof T`来代表参数 `o` 的属性名的类型类型，因此将 `names` 的成员类型 `K` 约束到 `keyof T` 即可。
3. 可以通过类型访问符 `T[K]` 来获取对应类型的属性，因此返回值类型为 `T[K][]`

```ts
function pick<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map(n => o[n]);
}
```

### 映射类型

例子：我们有一个 User 接口，现在有一个需求是把 User 接口中的成员全部变成可选的，我们应该怎么做？难道要重新一个个 `:` 前面加上 `?` , 有没有更便捷的方法？

```ts
interface User {
    username: string
    id: number
    token: string
    avatar: string
    role: string
}
```

 这里可以使用**映射类型**，语法是 `[K in keys]`:

1. **K**：类型变量，依次绑定到每个属性上，对应每个属姓名的类型
2. **Keys**: 字符串字面量构成的联合类型，表示一组属姓名（的类型）

#### 解决例子

1. 使用 `keyof` 操作符得到 Keys，假设我们出入的类型时泛型 T，那么结果就是 `keyof T`
2. 然后我们需要将 `keyof T` 的属姓名称一一映射出来，即 `[K in keyof T]`，如果我们要将所有的属性成员变为可选类型，那么需要 `T[K]` 取出相应的属性值，最后重新生成一个可选的新类型`{[ K in keyof T ]?: T[K] }`

用类型别名表示就是：

```ts
type partial<T> = { [ K in keyof T ]: K[T] }

type partialUser = partial<User>
```

### 条件类型

#### 条件类型的使用

条件类型能够表示**非统一的类型**，以一个**条件表达式进行类型关系检测**，从而在两种类型中选择其一：

```ts
T extends U ? X : Y
```

上面代码理解为：若 `T` 能够赋值给 `U`，那么类型是 `X`，否则为 `Y`，有点类似于 JS 中的三元运算符。

例如：声明一个函数 `f`，他的参数接收一个布尔类型，当布尔类型为 `true` 时返回 `string` 类型，否则返回 `number` 类型

```ts
declare function f<T extends boolean>(x:T): T extends true ? string : number

const x = f(Math.random() < 0.5) // x: string | number
const y = f(false) // y: number
const z = f(true) // z: string
```

如上，条件类型只有在类型系统中给出充足的条件之后，他才会根据条件推断出类型结果。

#### 条件类型与联合类型

条件类型的一个特点是「**分布式有条件类型**」，但是有一个前提，就是**条件类型里待检查的元素一定是 `naked type parameter`**，即**裸类型参数**，指没有被包装在其他类型里，比如没有被数组、元组、函数、Promise 等包裹。

```ts
// 裸类型参数,没有被任何其他类型包裹即T
type NakedUsage<T> = T extends boolean ? "YES" : "NO"
// 类型参数被包裹的在元组内即[T]
type WrappedUsage<T> = [T] extends [boolean] ? "YES" : "NO";
```

如上，按照官方文档的说法是「**分布式有条件类型在实例化时会自动分发成联合类型**」，例子如下：

```ts
type Distributed = NakedUsage<number | boolean> 
// = NakedUsage<number> | nakedUsage<boolean> = "NO" | "YES"

type NoDistributed = WrappedUsage<number | boolean> 
//  "No"
```

1. 当我们给类型 `NakedUsage` 加入联合类型 `number | boolean` 时，它的返回结果 `"NO" | "YES"` 相当于联合类型中 `number` 和  `boolean` 分别赋予了 `NakedUsage<T>`，然后再返回出一个联合类型，这个操作可以类比为 JS 中的 `Array.map()`

2. 当看 `NotDistributed` 的结果时，它接受的同样是联合类型 `number | boolean`，但是返回一个特定的类型 `"NO"`，而非一个联合类型，就是因为它的类型参数是被包裹的，即 `<T>`，不会产生分布式有条件类型的特性

##### 例子

设计一个类型工具 `Diff<T, U>`，找出 `T` 类型中 `U` 不包括的部分

```ts
type Diff<T, U> = T extends U ? never : T

type R = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"

// 同样可得
// 类似于js数组的filter
type Filter<T, U> = T extends U ? T : never;
type R1 = Filter<string | number | (() => void), Function>;

// 剔除 null和undefined
type NonNullable<T> = Diff<T, null | undefined>;
type R2 = NonNullable<string | number | undefined>;  // string | number
```

#### 条件类型与映射类型

##### 例子

有一个 `interface Part`，需要编写一个工具类型让 interface 中**函数类型的名称**取出来

```ts
interface Part {
    id: number;
    name: string;
    subparts: Part[];
    updatePart(newName: string): void;
}

type R = FunctionPropertyNames<Part>;
```

题解：遍历 interface，取出类型为 `Function` 的部分并拿到对应的 `key` 即可

```ts
type FunctionPropertyNames<T> = { [ K in keyof T ]: T[k] extends Function ? K : never }[keyof T]
```

一步步分析：

1. 假设我们把 `Part` 代入泛型 `T`, `[ K in keyof T ]` 相当于遍历整个 interface
2. 这时 `K` 相当于 interface 的 `key`，`T[K]` 相当于 interface 的 `value`
3. 接下来，用条件类型验证 `value` 的类型，如果是 `Function` 那么将 `value` 作为新 `interface` 的 `key` 保留下来，否则为 `never`
4. 到这里我们得到了遍历修改后的新 interface，即：

```ts
type R = {
    id: never;
    name: never;
    subparts: never;
    updatePart: "updatePart";
}
```

5. 题目要求是取出老 interface `Part` 的 `key`，这个时候再用 `[keyof T]` 作为 `key` 依次取出新 interface 的 `value`，由于 `id`、`name` 和 `subparts` 的 `value` 为 `never`，就不会返回任何类型了，因此只返回了 `'updatePart'`

> **never 类型表示不会是任何值**，即什么都没有，甚至不是 `null` 类型







