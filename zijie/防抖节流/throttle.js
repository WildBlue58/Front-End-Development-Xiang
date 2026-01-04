/**
 * 节流函数（时间戳版本）
 *
 * 【核心原理】
 * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 *
 * 【与防抖的区别】
 * - 防抖：触发后等待n秒，如果n秒内再次触发，重新计时（最终只执行一次）
 * - 节流：触发后n秒内不再执行，n秒后可以再次执行（固定时间间隔执行）
 *
 * 【应用场景】
 * - 滚动事件（滚动时固定时间间隔加载数据）
 * - 鼠标移动事件（固定时间间隔更新位置）
 * - 拖拽事件（固定时间间隔更新拖拽位置）
 *
 * @param {Function} func - 需要节流处理的函数
 * @param {number} delay - 节流的时间间隔（毫秒）
 * @returns {Function} 返回一个节流处理后的函数
 */
function throttle(func, delay) {
  // 闭包变量：记录上一次执行函数的时间
  // 初始值为0，表示从未执行过
  let lastTime = 0

  return function(...args) {
    // 获取当前时间戳（毫秒）
    const now = Date.now()

    // 判断当前时间与上一次执行时间的差值是否大于等于delay
    // now - lastTime >= delay 表示已经过了delay毫秒，可以执行函数了
    if (now - lastTime >= delay) {
      // 使用apply调用原函数，并传递正确的this和参数
      func.apply(this, args)

      // 更新上一次执行时间为当前时间
      // 这样下一次触发时，会从现在开始计算delay时间
      lastTime = now
    }
    // 如果时间差小于delay，说明还在节流期内，不执行函数，直接忽略这次触发
  }
}

/**
 * 节流函数（定时器版本 - 更精确）
 *
 * 【核心原理】
 * 结合时间戳和定时器，保证最后一次触发也能执行
 *
 * 【与时间戳版本的区别】
 * - 时间戳版本：如果最后一次触发在节流期内，不会执行（可能丢失最后一次触发）
 * - 定时器版本：保证最后一次触发一定会执行（更精确）
 *
 * @param {Function} func - 需要节流处理的函数
 * @param {number} delay - 节流的时间间隔（毫秒）
 * @returns {Function} 返回一个节流处理后的函数
 */
function throttleTimer(func, delay) {
  // 闭包变量：存储定时器ID
  let timer = null
  // 闭包变量：记录上一次执行函数的时间
  let lastTime = 0

  return function(...args) {
    // 获取当前时间戳
    const now = Date.now()

    // 计算距离下一次可以执行函数还需要等待的时间
    // remaining = delay - (now - lastTime)
    // 如果remaining > 0，说明还在节流期内
    // 如果remaining <= 0，说明已经过了delay时间，可以执行函数
    const remaining = delay - (now - lastTime)

    if (remaining <= 0) {
      // 已经过了delay时间，可以立即执行函数

      // 如果有定时器在等待，清除它
      // 因为现在要立即执行，不需要等待定时器了
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      // 立即执行函数
      func.apply(this, args)

      // 更新上一次执行时间为当前时间
      lastTime = now
    } else if (!timer) {
      // 还在节流期内，并且没有定时器在等待

      // 创建一个定时器，在remaining毫秒后执行函数
      // 这样可以保证最后一次触发一定会执行
      timer = setTimeout(() => {
        // 定时器到期，执行函数
        func.apply(this, args)

        // 更新上一次执行时间为当前时间
        lastTime = Date.now()

        // 清除定时器引用
        timer = null
      }, remaining)
    }
    // 如果remaining > 0 且 timer存在，说明已经有定时器在等待，不需要做任何事
  }
}

// ============================================
// 测试代码：时间戳节流
// ============================================

// 创建一个用于测试鼠标移动的div元素
const box = document.createElement('div')
box.style.width = '200px'
box.style.height = '200px'
box.style.backgroundColor = 'lightblue'
box.style.marginTop = '20px'
box.textContent = '鼠标移动测试节流（延迟200ms）'
// 将box添加到页面中
document.body.appendChild(box)

// 创建一个显示节流触发次数的div元素
const throttleCountElement = document.createElement('div')
document.body.appendChild(throttleCountElement)

// 记录节流触发次数
let throttleCount = 0

// 创建一个节流处理后的鼠标移动处理函数
// 每200ms最多执行一次
const handleMouseMove = throttle(() => {
  // 每次触发时，计数器加1
  throttleCount++
  // 更新页面显示的触发次数
  throttleCountElement.textContent = `节流触发次数: ${throttleCount}`
  // 在控制台输出调试信息
  console.log('节流触发', throttleCount)
}, 200)

// 为box添加mousemove事件监听器
// 鼠标在box内移动时会频繁触发
// 但由于节流的作用，每200ms最多执行一次
box.addEventListener('mousemove', handleMouseMove)

// ============================================
// 测试代码：定时器节流
// ============================================

// 创建一个可滚动的div元素
const scrollBox = document.createElement('div')
scrollBox.style.width = '300px'
scrollBox.style.height = '150px'
scrollBox.style.overflow = 'auto'
scrollBox.style.border = '1px solid #ccc'
scrollBox.style.marginTop = '20px'

// 创建一个很长的内容div，使scrollBox可以滚动
const scrollContent = document.createElement('div')
scrollContent.style.height = '500px'
scrollContent.style.backgroundColor = 'lightgreen'
scrollContent.textContent = '滚动测试节流（延迟300ms）\n\n'.repeat(20)
// 将内容div添加到滚动容器中
scrollBox.appendChild(scrollContent)
// 将滚动容器添加到页面中
document.body.appendChild(scrollBox)

// 创建一个显示滚动节流触发次数的div元素
const scrollCountElement = document.createElement('div')
document.body.appendChild(scrollCountElement)

// 记录滚动节流触发次数
let scrollCount = 0

// 创建一个定时器节流处理后的滚动处理函数
// 每300ms最多执行一次
const handleScroll = throttleTimer(() => {
  // 每次触发时，计数器加1
  scrollCount++
  // 更新页面显示的触发次数
  scrollCountElement.textContent = `滚动节流触发次数: ${scrollCount}`
  // 在控制台输出调试信息
  console.log('滚动节流触发', scrollCount)
}, 300)

// 为scrollBox添加scroll事件监听器
// 滚动时会频繁触发
// 但由于节流的作用，每300ms最多执行一次
scrollBox.addEventListener('scroll', handleScroll)
