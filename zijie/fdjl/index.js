/**
 * 【面试背诵版】防抖节流结合函数
 * 
 * 这是一个结合了防抖和节流的“加强版节流”函数。
 * 
 * 核心逻辑：
 * 1. 节流 (Throttle): 规定时间内必定执行一次 (保证响应速度)
 * 2. 防抖 (Debounce): 最后一次操作后必定执行一次 (保证数据准确)
 * 
 * 这种写法既能保证频繁操作时的响应 (节流)，
 * 又能保证停止操作后执行最后一次 (防抖)。
 */

function debounceThrottle(fn, delay) {
    // lastTime: 上次执行的时间
    // timer: 定时器句柄
    let lastTime = 0;
    let timer = null;

    return function(...args) {
        const now = Date.now();
        
        // 计算距离上次执行经过了多久
        const remaining = delay - (now - lastTime);

        // 如果剩余时间小于等于0，说明已经到了该执行的时间（或者第一次执行）
        // 走【节流】逻辑：立即执行
        if (remaining <= 0) {
            // 如果之前有定时器，清除它，防止重复执行
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            
            // 执行函数并更新时间
            fn.apply(this, args);
            lastTime = now;
        } 
        // 否则，还没到时间，走【防抖】逻辑：延迟执行
        else {
            // 清除之前的定时器（防抖的核心：重新计时）
            if (timer) {
                clearTimeout(timer);
            }
            
            // 设置新的定时器，在剩余时间后执行
            timer = setTimeout(() => {
                fn.apply(this, args);
                // 执行后记得更新 lastTime，否则下次点击可能立即触发
                lastTime = Date.now();
                timer = null;
            }, remaining);
        }
    }
}

// 导出
module.exports = debounceThrottle;

// --- 测试代码 ---
if (require.main === module) {
    console.log('开始测试...');
    let count = 0;
    
    const run = debounceThrottle(() => {
        console.log(`执行: ${++count}, 时间: ${new Date().toISOString().slice(17, -1)}`);
    }, 1000);

    // 模拟频繁触发：每 200ms 触发一次
    const interval = setInterval(() => {
        console.log(`触发...`);
        run();
    }, 200);

    // 5秒后停止
    setTimeout(() => {
        clearInterval(interval);
        console.log('停止触发');
    }, 5000);
}
