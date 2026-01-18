Promise.myAll = function (proms) {
    const p = new Promise((resolve, reject) => {
        res = resolve
        rej = reject
    })

    let i = 0
    let fulfilled = 0
    for (const prom of proms) {
        const index = i
        i++
        Promise.resolve(prom).then(() => {
            // 1.完成的数据汇总到最终结果
            result[index] = data
            // 2.判定是否全部完成
            fulfilled++
            if (fulfilled === i) {
                res(result)
            }
        },rej)
    }

    if (i === 0) {
        res([])
    }

    return p
}