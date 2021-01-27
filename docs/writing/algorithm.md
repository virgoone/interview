# 一些算法题
### 1. 回形打印矩阵
```javascript
var generateMatrix = function(n) {
  let result = new Array(n).fill(0).map(() => new Array(n));
  let bound = [0, n - 1, 0, n - 1],
    direction = "left",
    x = 0,
    y = 0,
    current = 0;

  while (current++ < n * n) {
    switch (direction) {
      case "left":
        result[y][x++] = current;
        if (x === bound[1]) {
          direction = "bottom";
          bound[2]++;
        }
        break
      case "bottom":
        result[y++][x] = current;
        if (y === bound[3]) {
          direction = "right";
          bound[1]--;
        }
        break
      case "right":
        result[y][x--] = current;
        if (x === bound[0]) {
          direction = "top";
          bound[3]--;
        }
        break
      case "top":
        result[y--][x] = current;
        if (y === bound[2]) {
          direction = "left";
          bound[0]++;
        }
    }
  }
  return result;
};
```

### 2. 找出最长（无重复？）子字符串
```javascript
var lengthOfLongestSubstring = function(s) {
  let low = 0,
    high = 1,
    max = s.length ? 1 : 0,
    t = 1,
    sub = s[0];
  while (high < s.length) {
    const idx = sub.indexOf(s[high]);
    if (idx >= 0) {
      //重复
      t = t - idx;
      low = low + (idx + 1);
      sub = (sub + s[high]).slice(idx + 1);
    } else {
      t = t + 1;
      if (t > max) {
        max = t;
      }
      sub = sub + s[high];
    }
    high = high + 1;
  }
  return max;
};
```

### 3. 数组中的第 K 个最大元素
解法1: 进行 k 次取最大值的冒泡
```javascript
var findKthLargest = function(nums, k) {
  for(let i=0; i< k ; i++){
    for(let j=nums.length-1; j >i ; j-- ){
      if(nums[j] > nums[i]){
        [nums[i], nums[j]] = [nums[j], nums[i]]
      }
    }
  }
  return nums[k-1]
};
```

### 4. 从上到下打印二叉树（层次遍历？）
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
function leverOrder(root) {
  let stack = [root]
  while(stack.length) {
    let node = stack.shift()
    node.left && stack.push(node.left)
    node.right && stack.push(node.right)
  }
  return stack
}
```

### 5、n级台阶，从0开始走起，一次可以走一步或者两步，那么走完n级台阶一共有多少种走法？
```javascript
function nstep(n) {
	if (n <= 3) {
    return n
  }
	return nstep(n - 1) + nstep(n - 2)
}
```


### 6. 排序算法
#### 1.1 快速排序
快排的原理如下。随机选取一个数组中的值作为基准值，从左至右取值与基准值对比大小。比基准值小的放数组左边，大的放右边，对比完成后将基准值和第一个比基准值大的值交换位置。然后将数组以基准值的位置分为两部分，继续递归以上操作。


以下是实现该算法的代码


```javascript
function quickSort(arr = []){
  if(arr.length <= 1){
    return arr
  }
  const pivot = arr.shift()
  const len = arr.length
  let  right = [], left = []
  
  arr.forEach(item => {
    if(item < pivot){
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return quickSort(left).concat(pivot, quickSort(right))
}
```


该算法的复杂度和归并排序是相同的，但是额外空间复杂度比归并排序少，只需 O(logN)，并且相比归并排序来说，所需的常数时间也更少。
#### 1.2 冒泡排序
冒泡排序的原理如下，从第一个元素开始，把当前元素和下一个索引元素进行比较。如果当前元素大，那么就交换位置，重复操作直到比较到最后一个元素，那么此时最后一个元素就是该数组中最大的数。下一轮重复以上操作，但是此时最后一个元素已经是最大数了，所以不需要再比较最后一个元素，只需要比较到 `length - 1` 的位置。


以下是实现该算法的代码


```javascript
function bubbleSort(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // 从 0 到 `length - 1` 遍历
    for (let j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
      	[array[j], array[j+1]] = [array[j+1], array[j]]
      }
    }
  }
  return array;
}
```


该算法的操作次数是一个等差数列 `n + (n - 1) + (n - 2) + 1` ，去掉常数项以后得出时间复杂度是** O(n * n)**
**

### 7. 二叉树的遍历

- **先序遍历**表示先访问根节点，然后访问左节点，最后访问右节点。
- **中序遍历**表示先访问左节点，然后访问根节点，最后访问右节点。
- **后序遍历**表示先访问左节点，然后访问右节点，最后访问根节点。

#### 1.1 递归实现
递归实现相当简单，代码如下
```javascript
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}
var traversal = function(root) {
  if (root) {
    // 先序
    console.log(root); 
    traversal(root.left);
    // 中序
    // console.log(root); 
    traversal(root.right);
    // 后序
    // console.log(root);
  }
};
```


对于递归的实现来说，只需要理解每个节点都会被访问三次就明白为什么这样实现了。


#### 1.2 非递归实现
非递归实现使用了栈的结构，通过栈的先进后出模拟递归实现。
##### 1.2.1 先序遍历的非递归实现
```javascript
function pre(root) {
  if (root) {
    let stack = [];
    // 先将根节点 push
    stack.push(root);
    // 判断栈中是否为空
    while (stack.length > 0) {
      // 弹出栈顶元素
      root = stack.pop();
      // 打印节点
      console.log(root);
      // 因为先序遍历是先左后右，栈是先进后出结构
      // 所以先 push 右边再 push 左边
      if (root.right) {
        stack.push(root.right);
      }
      if (root.left) {
        stack.push(root.left);
      }
    }
  }
}
```


##### 1.2.2 中序遍历的非递归实现
```javascript
function mid(root) {
  if (root) {
    let stack = [];
    // 中序遍历是先左再根最后右
    // step1. 所以首先应该先把最左边节点遍历到底依次 push 进栈
    // step2. 当左边没有节点时，就打印栈顶元素，然后寻找右节点
    // step3. 对于最左边的叶节点来说，可以把它看成是两个 null 节点的父节点
    // step4. 左边打印不出东西就把父节点拿出来打印，然后再看右节点
    while (stack.length > 0 || root) {
      if (root) {
        stack.push(root);
        root = root.left;
      } else {
        root = stack.pop();
        // 打印节点
        console.log(root);
        root = root.right;
      }
    }
  }
}
```


##### 1.2.3 后序遍历的非递归实现
该代码使用了两个栈来实现遍历，相比一个栈的遍历来说要容易理解很多
```javascript
function pos(root) {
  if (root) {
    let stack1 = [];
    let stack2 = [];
    // 后序遍历是先左再右最后根
	// 所以对于一个栈来说，应该先 push 根节点
    // 然后 push 右节点，最后 push 左节点
    stack1.push(root);
    while (stack1.length > 0) {
      root = stack1.pop();
      stack2.push(root);
      if (root.left) {
        stack1.push(root.left);
      }
      if (root.right) {
        stack1.push(root.right);
      }
    }
    while (stack2.length > 0) {
      console.log(s2.pop());
    }
  }
}
```

### 8. 二叉树的搜索
#### 1.1 深度优先搜索
```javascript
function printDFS(root) {
  let arr = []
	dfs(root, 0, arr)
  return arr
}

function dfs(root, layer?, res?) {
  if(root) {
  	res.push(root)
  	dfs(root.left)
  	dfs(root.right)
  }
}
```
#### 1.2 广度优先搜索
```javascript
function bfs(root) {
  if(!root) return []
  let arr = []
  let queue = [root]                        // 队列 把树顶加入队列
  while(queue.length > 0){
    let len = queue.length
    while (len) {
      let node = queue.shift()               // 取出队列第一个元素
      console.log(node) 
      arr.push(node)
      if(node.left) queue.push(node.left)    // 继续往队列添加元素
      if(node.right) queue.push(node.right)
      len--
    }
  }
  return arr
}


```




