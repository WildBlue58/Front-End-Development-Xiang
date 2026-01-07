// 防抖函数：fn-目标函数，delay-延迟时间(毫秒)
function debounce(fn, delay) {
  let timer = null; // 闭包保存定时器ID，避免每次触发都创建新定时器
  
  // 返回包装后的函数，保留this指向和参数
  return function(...args) {
    clearTimeout(timer); // 清除上一次未执行的定时器，重置计时
    // 重新设置定时器，延迟执行目标函数
    timer = setTimeout(() => {
      fn.apply(this, args); // 保证this指向正确（如DOM元素），并传递事件参数
    }, delay);
  };
}