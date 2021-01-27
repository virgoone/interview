# Promise 相关
### 1. 手写 Promise
### 2. 实现 Promise.all
### 3. 实现 last Promise
### 4. 实现 Retry
```javascript
Promise.retry = function (promiseFn, times = 3) {
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
### 5. 写一个通用的 promisefy，将文件处理的 API 转换成 promise 
TBD



