function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this,args)
        },delay)
    }
}

function debounce2(fn, delay) {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this,args)
        }, delay);
    }
}

function debounce3(fn, delay) {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this,args)
        },delay)
    }
}

function debounce4(fn, delay) {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this,args)
        },delay)
    }
}