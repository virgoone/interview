# 事件机制

## 事件触发三阶段

事件触发有三个阶段：

1. `document` 往事件触发处传播，遇到注册的**捕获事件**会触发
2. 传播到事件触发处时触发**注册**的事件
3. 从事件触发处往 `document` 传播，遇到注册的**冒泡事件**会触发

事件触发一般来说会按照上面的顺序进行，但是也有特例，如果给一个目标节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行。

```js
// 以下会先打印冒泡然后是捕获
node.addEventListener('click',(event) =>{
	console.log('冒泡')
},false);
node.addEventListener('click',(event) =>{
	console.log('捕获 ')
},true)
```

## 注册事件

通常我们使用 `addEventListener` 注册事件，该函数的第三个参数可以是布尔值，也可以是对象。对于布尔值 `useCapture` 参数来说，该参数默认值为 `false` 。`useCapture` 决定了注册的事件是**捕获事件还是冒泡事件**。对于对象参数来说，可以使用以下几个属性

- `capture`，布尔值，和 `useCapture` 作用一样
- `once`，布尔值，值为 `true` 表示该回调只会调用一次，调用后会移除监听
- `passive`，布尔值，表示永远不会调用 `preventDefault`

### 阻止传播

一般来说，我们只希望事件只触发在目标上，这时候可以使用 `stopPropagation` 来**阻止事件的进一步传播**。通常我们认为 `stopPropagation` 是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。`stopImmediatePropagation` 同样也能实现阻止事件，但是还能阻止该事件目标执行别的注册事件。

```js
node.addEventListener('click',(event) =>{
	event.stopImmediatePropagation()
	console.log('冒泡')
},false);
// 点击 node 只会执行上面的函数，该函数不会执行
node.addEventListener('click',(event) => {
	console.log('捕获 ')
},true)
```

## 事件代理

如果一个节点中的子节点是动态生成的，那么**子节点需要注册事件的话应该注册在父节点上**

```html
<ul id="ul">
	<li>1</li>
    <li>2</li>
	<li>3</li>
	<li>4</li>
	<li>5</li>
</ul>
<script>
	let ul = document.querySelector('#ul')
	ul.addEventListener('click', (event) => {
		console.log(event.target);
	})
</script>
```

事件代理的方式相对于直接给目标注册事件来说，有以下优点：

- **节省内存**，减少浏览器内存占用
- **不需要给子节点注销事件**，代码简洁

#### 编写一个通用的 绑定事件 的函数

```js
//可以处理直接 绑定事件 或者 事件代理
function bindEvent(elem, type, selector, function){
    //只有3个参数时，不使用事件代理
    if( fn === null ){
        fn = selector
        selector = null
    }
    function handler(e) {
         if( selector ){
            if( e.target === selector ){
                //使用事件代理
                fn.call(selector, e)
            }
        }else{
            fn(e)
        }
    }
    if(elem.addEventListener){
        elem.addEventListener(type, handler(e))
    }else {
        elem.attechEvent('on' + type,handler(e))
    }
    
}
```