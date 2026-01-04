/**
 * 防抖函数（延迟执行版本）
 *
 * 【核心原理】
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 *
 * 【应用场景】
 * - 搜索框输入联想（用户停止输入后再发送请求）
 * - 窗口resize事件（调整窗口大小结束后再重新计算布局）
 * - 按钮提交（防止用户连续点击多次）
 *
 * @param {Function} func - 需要防抖处理的函数
 * @param {number} delay - 延迟执行的时间（毫秒）
 * @returns {Function} 返回一个防抖处理后的函数
 */
function debounce(func, delay) {
  // 闭包变量：存储定时器ID
  // 使用闭包是为了在多次调用返回的函数时，timer变量能够保持状态
  let timer = null

  // 返回一个新的函数，这个函数才是真正被调用的函数
  return function(...args) {
    // 如果之前已经有一个定时器在等待执行
    // 说明在delay时间内，函数又被触发了
    if (timer) {
      // 清除之前的定时器，取消之前计划的函数执行
      // 这样就实现了"重新计时"的效果
      clearTimeout(timer)
    }

    // 创建一个新的定时器，在delay毫秒后执行func函数
    timer = setTimeout(() => {
      // 使用apply调用原函数，并传递正确的this和参数
      // this指向：保持原函数的this指向
      // args：使用展开运算符获取所有传入的参数
      func.apply(this, args)

      // 函数执行完毕后，将timer重置为null
      // 这样下一次触发时可以重新创建定时器
      timer = null
    }, delay)
  }
}

/**
 * 防抖函数（立即执行版本）
 *
 * 【核心原理】
 * 第一次触发立即执行，然后在n秒内不再执行，n秒后如果再次触发，立即执行
 *
 * 【应用场景】
 * - 点击按钮（第一次点击立即响应，防止短时间内重复点击）
 * - 提交表单（第一次提交立即执行，防止重复提交）
 *
 * @param {Function} func - 需要防抖处理的函数
 * @param {number} delay - 延迟的时间（毫秒）
 * @returns {Function} 返回一个防抖处理后的函数
 */
function debounceImmediate(func, delay) {
  // 闭包变量：存储定时器ID
  let timer = null

  return function(...args) {
    // 如果timer存在，说明在delay时间内函数被再次触发了
    if (timer) {
      // 清除之前的定时器，重新计时
      clearTimeout(timer)
    } else {
      // timer为null，说明是第一次触发或者delay时间已过
      // 立即执行函数
      func.apply(this, args)
    }

    // 设置一个定时器，在delay毫秒后将timer重置为null
    // 这样delay时间后，如果函数再次被触发，就会立即执行
    timer = setTimeout(() => {
      timer = null
    }, delay)
  }
}

// ============================================
// 测试代码：普通防抖（延迟执行）
// ============================================

// 创建一个输入框元素
const input = document.createElement('input')
input.placeholder = '输入内容测试防抖（延迟500ms）'
// 将输入框添加到页面中
document.body.appendChild(input)

// 创建一个显示触发次数的div元素
const countElement = document.createElement('div')
document.body.appendChild(countElement)

// 记录触发次数
let count = 0

// 创建一个防抖处理后的输入处理函数
// 延迟500ms执行
const handleInput = debounce(() => {
  // 每次触发时，计数器加1
  count++
  // 更新页面显示的触发次数和输入值
  countElement.textContent = `触发次数: ${count}, 值: ${input.value}`
  // 在控制台输出调试信息
  console.log('防抖触发', input.value)
}, 500)

// 为输入框添加input事件监听器
// 每次输入都会触发handleInput函数
// 但由于防抖的作用，只有停止输入500ms后才会真正执行
input.addEventListener('input', handleInput)

// ============================================
// 测试代码：立即执行防抖
// ============================================

// 创建一个按钮元素
const button = document.createElement('button')
button.textContent = '测试立即执行防抖'
document.body.appendChild(button)

// 创建一个显示立即执行触发次数的div元素
const immediateCountElement = document.createElement('div')
document.body.appendChild(immediateCountElement)

// 记录立即执行触发次数
let immediateCount = 0

// 创建一个立即执行防抖处理后的点击处理函数
// 延迟1000ms
const handleClick = debounceImmediate(() => {
  // 每次触发时，计数器加1
  immediateCount++
  // 更新页面显示的触发次数
  immediateCountElement.textContent = `立即执行触发次数: ${immediateCount}`
  // 在控制台输出调试信息
  console.log('立即执行防抖触发')
}, 1000)

// 为按钮添加点击事件监听器
// 第一次点击立即执行，之后的点击在1000ms内不会执行
button.addEventListener('click', handleClick)
