# Promise 相关

### 1. 手写 Promise

### 2. 实现 Promise.all

```javascript
MyPromise.all = function(arr) {
  if (!Array.isArray(arr)) {
    throw TypeError('请传入一个数组');
  }

  return new MyPromise((resolve, reject) => {
    try {
      let resultArr = [],
        count = 0;
      const len = arr.length;
      for (let i = 0; i < len; i++) {
        arr[i].then(data => {
          resultArr[i] = data;
          if (++count === len) {
            resolve(resultArr);
          }
        }, reject);
      }
    } catch (err) {
      reject(err);
    }
  });
};
```

### 2.1 实现 Promise.race

```javascript
MyPromise.race = function(arr) {
  if (!Array.isArray(arr)) {
    throw TypeError('请输入一个数组');
  }
  let flag = false;
  return new MyPromise((resolve, reject) => {
    arr.forEach(promise => {
      try {
        // 不用做判断，resolve 和 reject 都只会触发一次
        promise.then(resolve, reject);
      } catch (err) {
        reject(err);
      }
    });
  });
};
```

### 3. 实现 last Promise

### 4. 实现 Retry

```javascript
Promise.retry = function(promiseFn, times = 3) {
  return new Promise(async (resolve, reject) => {
    while (times--) {
      try {
        var ret = await promiseFn();
        resolve(ret);
        break;
      } catch (error) {
        if (!times) reject(error);
      }
    }
  });
};
```

### 5. 写一个通用的 promisify，将文件处理的 API 转换成 promise

```javascript
const promisify = func => {
  // 返回一个新的 function
  return function(...params) {
    // 保存当前 this
    const _this = this;
    // 新方法返回一个 promise
    return new Promise((resolve, reject) => {
      // 执行原 API 方法 func，绑定作用域，传参，以及 callback（callback 为 func 的最后一个参数）
      return func.call(_this, ...params, function(...args) {
        // 取出 callback 函数的最后一个参数 err
        const err = args.shift();
        // 判断是否有错误，有则 rejected，否则 resolved
        if (err) {
          reject(err);
        } else {
          // 判断返回的是一个数组还是一个值
          resolve(args.length > 1 ? args : args[0]);
        }
      });
    });
  };
};
```
