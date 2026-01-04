class Scheduler {
  constructor(limit) {
    this.limit = limit; // 最大并发数，例如 2
    this.count = 0;     // 当前正在运行的任务数
    this.queue = [];    // 等待执行的任务队列
  }

  async add(fn) {
    // 1. 如果当前跑的任务满了，就阻塞在这里（await 一个 Promise）
    if (this.count >= this.limit) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    // 2. 开始执行，计数器 +1
    this.count++;
    
    // 3. 执行真正的任务
    const res = await fn();

    // 4. 任务完成，计数器 -1
    this.count--;

    // 5. 【关键】如果队列里还有人在排队，把最前面那个人的 Promise resolve 掉，让他继续往下走
    if (this.queue.length > 0) {
      this.queue.shift()(); // 唤醒排队者
    }

    return res;
  }
}

// 模拟使用
// const scheduler = new Scheduler(2);
// const addTask = (time, order) => {
//   scheduler.add(() => timeout(time)).then(() => console.log(order));
// };