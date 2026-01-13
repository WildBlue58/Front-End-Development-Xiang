# 大厂常考手撕代码清单 (前端方向)

这份清单整理了各大互联网公司（字节跳动、阿里、腾讯、美团等）面试中常见的手写代码题目。

## 1. JavaScript 核心手写

这些是前端面试中最基础也是最高频的题目，必须熟练掌握。

- **防抖 (Debounce) & 节流 (Throttle)**
  - 注意立即执行版本和非立即执行版本。
- **深拷贝 (Deep Clone)**
  - 需处理循环引用、Date、RegExp 等特殊类型。
- **手写 Promise 全家桶**
  - `Promise.all`
  - `Promise.race`
  - `Promise.allSettled`
  - `Promise.prototype.finally`
  - 完整实现 Promise A+ 规范 (难度较高)
- **发布订阅模式 (Event Emitter)**
  - `on`, `emit`, `off`, `once` 方法。
- **函数原型方法**
  - `Function.prototype.call`
  - `Function.prototype.apply`
  - `Function.prototype.bind`
- **new 操作符实现**
- **instanceof 实现原理**
- **数组操作**
  - 数组扁平化 (`flat`)
  - 数组去重 (`unique`)
  - `Array.prototype.map` / `filter` / `reduce` 实现
- **函数柯里化 (Currying)** & **函数组合 (Compose)**

## 2. 异步与并发控制

字节跳动等公司非常喜欢考异步调度相关的题目。

- **并发限制调度器 (Scheduler)**
  - 实现一个带并发限制的异步调度器，保证同时运行的任务最多 n 个。
- **实现 sleep / delay 函数**
- **每隔一秒打印 1, 2, 3, 4, 5** (考察 var/let 闭包)
- **实现 Promise.retry** (成功则 resolve，失败则重试 n 次)

## 3. 经典算法题 (高频 Top)

不需要刷完 LeetCode，但以下题目是面试常客。

- **排序**
  - 快速排序 (Quick Sort) - **必考**，注意手写 partition 逻辑。
  - 归并排序 (Merge Sort)
- **链表**
  - 反转链表 (Reverse Linked List)
  - 链表是否有环 (Linked List Cycle)
  - 合并两个有序链表 (Merge Two Sorted Lists)
  - K 个一组翻转链表 (Hard, 字节常考)
- **二叉树**
  - 二叉树的层序遍历 (BFS)
  - 二叉树的“之”字形层序遍历
  - 二叉树的前、中、后序遍历 (建议掌握非递归写法)
  - 二叉树的最近公共祖先 (LCA)
  - 求二叉树的最大深度 / 直径
- **其他高频**
  - **LRU 缓存机制 (LRU Cache)** - 使用 Map 或 双向链表+哈希表实现 (重点)。
  - 有效的括号 (栈的使用)
  - 两个栈实现队列
  - 三数之和 (3Sum) / 两数之和 (2Sum)
  - 岛屿数量 (DFS/BFS)
  - 螺旋矩阵
  - 买卖股票的最佳时机系列
  - 最大子序和 (DP)
  - 爬楼梯 / 斐波那契数列

## 4. 场景应用题

- **解析 URL 参数为对象**
- **模板引擎简单的实现** (render 函数)
- **将 Virtual DOM 对象转换为真实 DOM**
- **实现一个简单的 JSON.stringify / JSON.parse**
- **大数相加** (处理 JS 数字精度丢失问题)
- **图片懒加载** (IntersectionObserver 或 scroll 监听)

## 备考建议

1. **理解优先**：不要死记硬背，理解代码执行流程。
2. **白板编程**：尝试在无提示的文本编辑器（如记事本）中书写代码。
3. **边界条件**：注意参数校验、空值处理、循环引用等边界情况。
