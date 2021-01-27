# Ajax相关
### 1. 手写 ajax
```javascript
const ajax = function({method, url, body, headers = {}}){
  return new Promise(function(resolve, reject){
    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    for(let key in headers){
      let value = headers[key]
      xhr.setRequestHeader(key, value)
    }
    xhr.onreadystatechange = ()=>{
      if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
          console.log('成功')
          resolve.call(undefined, xhr.responseText)
        }else{
          console.log('失败')
          reject.call(undefined, xhr)
        }
      }
    }  
    xhr.send(body)
  })
}
```
### 2、手写重试方法