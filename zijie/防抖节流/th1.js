// 节流函数：fn-目标函数，interval-时间间隔(毫秒)
function throttle(fn, interval) {
  let lastTime = 0; // 闭包保存上一次执行的时间戳
  
  // 返回包装后的函数，保留this指向和参数
  return function(...args) {
    const now = Date.now(); // 获取当前时间戳
    // 只有当当前时间与上一次执行时间的差值 ≥ 间隔，才执行函数
    if (now - lastTime >= interval) {
      fn.apply(this, args); // 执行目标函数
      lastTime = now; // 更新上一次执行的时间戳
    }
  };
}
