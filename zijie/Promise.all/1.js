Promise.myAll = function(promises){
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length

        if (len === 0) {
            return resolve(result)
        }

        promises.forEach((p, index) => {
            Promise.resolve(p).then(
                (res) => {
                    result[index] = res
                    count++

                    if (count === len) {
                        resolve(result)
                    }
                },
                    (err) => {
                    reject(err)
                }
            )
        })
    })
}