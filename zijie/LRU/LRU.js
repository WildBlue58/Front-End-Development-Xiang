class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; // 缓存容量
    this.map = new Map();     // Map 保持插入顺序
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    
    // 【关键】如果访问了它，它就变成了"最近使用"，需要先删再加，放到 Map 的最后面
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    
    return value;
  }

  put(key, value) {
    // 如果已经有了，先删除旧的
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    
    this.map.set(key, value); // 放入新的（此时在最后面）

    // 【关键】如果超出了容量，删除最久未使用的（也就是 Map 的第一个）
    if (this.map.size > this.capacity) {
      // map.keys().next().value 能拿到第一个 key
      this.map.delete(this.map.keys().next().value);
    }
  }
}