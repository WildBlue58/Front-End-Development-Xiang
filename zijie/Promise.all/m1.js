// Promise.myAll = function (promises) {
//     return new Promise((resolve, reject) => {
//         const result = []
//         let count = 0
//         const len = promises.length

//         if (len === 0) {
//             return resolve(result)
//         }

//         promises.forEach((p, index) => {
//             Promise.resolve(p).then((res) => {
//                 result[index] = res
//                 count++

//                 if (count === len) {
//                     resolve(result)
//                 }
//             },
//                 (err) => {
//                 reject(err)
//             }
//             )
//         })
//     })
// }

Promise.myAll = function (promises) {
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length

        if (len === 0) {
            return resolve(result)
        }

        promises.forEach((p, index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}

Promise.myAll2 = function (promises) {
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length

        if (len === 0) {
            return resolve(result)
        }

        Promise.forEach((p, index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}

Promise.myAll3 = function (promises) {
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length
        
        if (len === 0) {
            return resolve(result)
        }

        Promise.forEach((p,index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}

Promise.myAll4 = function (promises){
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length

        if (len === 0) {
            return resolve(result)
        }

        Promise.forEach((p, index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}

Promise.myAll5 = function (promises) {
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length

        if (len === 0) {
            return resolve(result)
        }

        Promise.forEach((p, index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}

Promise.myAll6 = function (promises){
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length

        if (len === 0) {
            return resolve(promises)
        }

        Promise.forEach((p, index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}

Promise.myAll7 = function (promises) {
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        const len = promises.length

        if (len === 0) {
            return resolve(promises)
        }

        Promise.forEach((p, index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(promises)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}

Promise.myAll8 = function (promises) {
    return new Promise((resolve, reject) => {
        const len = promises.length
        let count = 0
        const result = []

        Promise.forEach((p, index) => {
            Promise.resolve(p).then((res) => {
                result[index] = res
                count++

                if (count === len) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        })
    })
}