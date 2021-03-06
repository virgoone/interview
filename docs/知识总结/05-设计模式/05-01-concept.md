# 设计思想

## 单一功能原则（Single Responsibility Principle）

## 开放封闭原则（Opened Closed Principle）

开是指**对扩展开放**，闭是指**对修改关闭**。即，我们有一套实现，提供一个服务，这样的程序需要能够随时进行扩展，随时支持第三方的自定义配置，但是不能去修改已有的实现代码。

对于面向对象的语言来说，想要严格遵守开闭原则，往往需要使用接口和抽象类。

## 里氏替换原则(Liskov Substitution Principle)

里氏替换原则要求，**在任何基类可以发挥作用的地方，子类一定可以发挥作用**。

例如，里氏替换原则就是继承复用的基础。只有当派生类可以随时替换掉其基类，且功能不被破坏，基类的方法仍然能被使用时，才算真正做到了继承，继承才能真正实现复用。

## 依赖反转原则（Dependency Inversion Principle）

该原则要求**针对接口进行编程，使高层次的模块不依赖低层次的模块的实现细节**，两者都应该依赖于接口抽象。

## 接口隔离原则（Interface Segregation Principle）

接口隔离的目的是**减少耦合的出现**。

## 最少知道/迪米特法则（Demeter Principle）

是指**一个系统的功能模块应该最大限度地不知晓其他模块的出现**，减少感知，模块之间相互独立。

## 合成复用原则（Composite Reuse Principle）

合成复用原则是指**尽量使用合成/聚合的方式，而不是使用继承**。
