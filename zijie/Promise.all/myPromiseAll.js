/**
 * 【面试背诵版】Promise.all 手写实现
 * 
 * 核心要点：
 * 1. 返回一个新的 Promise
 * 2. 遍历输入数组，用 Promise.resolve 将元素转为 Promise
 * 3. 维护一个计数器 count 和结果数组 result
 * 4. 成功时：将结果存入对应索引 (result[i] = val)，count++，如果 count === length 则 resolve(result)
 * 5. 失败时：只要有一个失败，立即 reject(err)
 * 6. 注意：结果数组的顺序要与输入数组一致，而不是完成顺序
 */

Promise.myAll = function(promises) {
    return new Promise((resolve, reject) => {
        // 1. 判断参数是否为数组 (可选，但面试写上加分)
        // if (!Array.isArray(promises)) {
        //     return reject(new TypeError('Argument must be an array'));
        // }

        const result = [];
        let count = 0;
        const len = promises.length;

        // 2. 处理空数组的情况
        if (len === 0) {
            return resolve(result);
        }

        // 3. 遍历执行
        promises.forEach((p, index) => {
            // 使用 Promise.resolve 包裹，确保处理非 Promise 值
            Promise.resolve(p).then(
                (res) => {
                    // 关键：将结果存入对应的索引位置，保证顺序
                    result[index] = res;
                    count++;
                    
                    // 当所有任务都完成时，返回结果数组
                    if (count === len) {
                        resolve(result);
                    }
                },
                (err) => {
                    // 只要有一个失败，直接 reject
                    reject(err);
                }
            );
        });
    });
};

// --- 测试代码 ---
if (require.main === module) {
    console.log('开始测试 Promise.myAll...');

    const p1 = Promise.resolve(1);
    const p2 = new Promise((resolve) => setTimeout(() => resolve(2), 1000));
    const p3 = 3; // 非 Promise 值

    // 1. 测试成功情况
    Promise.myAll([p1, p2, p3]).then(
        (res) => console.log('成功结果:', res), // 预期: [1, 2, 3]
        (err) => console.log('失败:', err)
    );

    // 2. 测试失败情况
    const p4 = Promise.reject('Error!');
    Promise.myAll([p1, p4, p2]).then(
        (res) => console.log('不应执行到这里:', res),
        (err) => console.log('失败捕获:', err) // 预期: Error!
    );
    
    // 3. 测试空数组
    Promise.myAll([]).then(res => console.log('空数组结果:', res));
}
