# 基础手写题

### 1. 手写 debounce 和 throttle

```javascript
function debounce(fn) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值
  return function() {
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => {
      // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments);
    }, 500);
  };
}
function throttle(fn) {
  let canRun = true; // 通过闭包保存一个标记
  return function() {
    if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
    canRun = false; // 立即设置为false
    setTimeout(() => {
      // 将外部传入的函数的执行放在setTimeout中
      fn.apply(this, arguments);
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true;
    }, 500);
  };
}
```

### 2. 实现 url parse

```javascript
// 入参格式参考：
const url = 'http://sample.com/?a=1&b=2&c=xx&d#hash';
// 出参格式参考：
const result = { a: '1', b: '2', c: 'xx', d: '' };
/*拆解URL参数中queryString，返回一个 key - value 形式的 object*/
function queryParse(url) {
  const searchUrl = new URL(url);
  const searchStr = searchUrl.search.split('?')?.[1];
  // const rex = /^[a-z]+:\/\/.+\?([a-z0-9=&]+)#?.*$/
  // const searchStr = url.match(rex)?.[1]
  const search = searchStr.split('&').reduce((querySearch, currentSearch) => {
    const [key, val = ''] = currentSearch.split('=');
    const decodeKey = decodeURIComponent(key);
    const decodeVal = decodeURIComponent(val);
    if (querySearch[decodeKey]) {
      if (Array.isArray(querySearch[decodeKey])) {
        querySearch[decodeKey].push(decodeVal);
      } else {
        const prevVal = querySearch[decodeKey];
        querySearch[decodeKey] = [prevVal, decodeVal];
      }
    } else {
      querySearch[decodeKey] = decodeVal;
    }

    return querySearch;
  }, {});
  return search;
}
```

### 3. curry 方法实现

```javascript
const curry = fn => (…args) => fn.bind(null, …args);
```

### 4. 实现 event emitter

```javascript
class EventEmitter {
	constructor() {
		super()
		this.events = {}
		this.onceEvents = {}
	}

	on(type, cb) {
		if (!type || !cb) {
			return false
		}
		this.events[type] = this.events[type] || []
		this.events[type].push(cb)
	}

	emit(type) {
		if (!type) {
			return false
		}
		this.events[type] && this.events[type].forEach(eventCb = > {
			eventCb.apply(this, [...arguments].slice(1))
		})
		this.onceEvents[type] && this.onceEvents[type].forEach(eventCb = > {
			eventCb.apply(this, [...arguments].slice(1))
		})
		delete this.onceEvents[type]
	}

	off(type) {
		if (!type) {
			return false
		}
		delete this.events[type]
		delete this.onceEvents[type]
	}

	once(type, cb) {
		if (!type || !cb) {
			return false
		}
		this.onceEvents[type] = this.onceEvents[type] || []
		this.onceEvents[type].push(cb)
	}
}
```

### 5. 深拷贝

#### 1. 用 `JSON.stringify`，简单但无法处理对象、函数等

```javascript
const deepClone = obj => JSON.parse(JSON.stringify(obj));
```

#### 2. 递归遍历，但无法解决环的问题

```javascript
const deepClone = obj => {

  // 1. 判断是否是对象，不是则直接返回原值，记得处理 null
  if(typeOf obj !== 'object' || obj === null) {
    return obj
  }

  // 2. 判断是数组还是普通对象
  let newObj = Array.isArray(obj) ? [] : {}

  // 3. 循环遍历原对象
  for(let key in obj) {

    // 4. 判断是否是对象原有属性，继承来的不用处理
    if(obj.hasOwnProperty(key)){

      // 5. 递归处理每个属性
      newObj[key] = deepClone(obj[key])
    }
  }
}
```

#### 3. 考虑环，函数，用一个 map

```javascript
function deepCopy(obj, cache = new WeakMap()) {
  if (!obj instanceof Object) return obj;
  // 防止循环引用
  if (cache.get(obj)) return cache.get(obj);
  // 支持函数
  if (obj instanceof Function) {
    return function() {
      return obj.apply(this, arguments);
    };
  }
  // 支持日期
  if (obj instanceof Date) return new Date(obj);
  // 支持正则对象
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  // 还可以增加其他对象

  // 区分数组和普通对象
  const res = Array.isArray(obj) ? [] : {};
  // 缓存 copy 的对象，用于处理循环引用的情况
  cache.set(obj, res);

  Object.keys(obj).forEach(key => {
    if (obj[key] instanceof Object) {
      res[key] = deepCopy(obj[key], cache);
    } else {
      res[key] = obj[key];
    }
  });
  return res;
}
```

### 6. 手写一个 call 函数

```javascript
Function.prototype.myCall = function(context, ...args) {
  // step1: 把函数挂到目标对象上（这里的 this 就是我们要改造的的那个函数）
  if (context === null) {
    // 第一个参数传入 null，则指向 window
    context = window;
  }
  context.func = this;
  // step2: 执行函数，利用扩展运算符将数组展开，保存返回值
  const result = context.func(...args);
  // step3: 删除 step1 中挂到目标对象上的函数，把目标对象”完璧归赵”
  delete context.func;
  // step4: 返回结果
  return result;
};
```

### 7. 数组扁平化

#### 1. reduce

```javascript
function flatten(arr = []) {
  return arr.reduce(
    (result, item) => result.concat(Array.isArray(item) ? flatten(item) : item),
    [],
  );
}
```

#### 2. 不用 reduce

```javascript
function flatten(arr = []) {
  const res = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      res.push(...flatten(item));
    } else {
      res.push(item);
    }
  });
  return res;
}
```

#### 3. toString

```javascript
function flatten(arr = []) {
  return arr
    .toString()
    .split(',')
    .map(Number);
}
```

### 8. 合并两个数组/对象

#### 8.1 合并两个数组

```javascript
// 1. concat
const joinArr = (arr1, arr2) => arr1.concat(arr2);

// 2. ES6 扩展运算符
const joinArr = (arr1, arr2) => [...arr1, ...arr2];

// 3. push.apply
const joinArr = (arr1, arr2) => Array.prototype.push.apply(arr1, arr2);
```

#### 8.2 合并两个对象

```javascript
// 1. Object.assgin
const joinObjects = (obj1, obj2) => Object.assign(obj1, obj2);

// 2.
```
