// Promise.all
// 手写 Promise.all，参数为可迭代对象（常用数组）
function myPromiseAll(iterable) {
  // 1. 转数组方便操作，保证可遍历
  const arr = Array.from(iterable);
  const len = arr.length;
  const result = new Array(len); // 保存结果，保证顺序
  let resolvedCount = 0; // 成功计数器

  // 2. 返回新 Promise（核心：Promise.all 本身返回Promise）
  return new Promise((resolve, reject) => {
    // 空数组直接resolve
    if (len === 0) return resolve(result);

    // 3. 遍历所有待处理项
    arr.forEach((item, index) => {
      // 关键：用 Promise.resolve 包裹，兼容非Promise类型
      Promise.resolve(item)
        .then((res) => {
          result[index] = res; // 按原索引存储，保证顺序
          resolvedCount++; // 成功计数+1

          // 4. 所有都成功时，resolve结果数组
          if (resolvedCount === len) {
            resolve(result);
          }
        })
        .catch((err) => {
          // 5. 任一失败，立即reject（核心特性：失败优先）
          reject(err);
        });
    });
  });
}