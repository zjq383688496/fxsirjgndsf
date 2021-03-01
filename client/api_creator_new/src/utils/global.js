var { random, round } = Math

/* window 扩展方法 */
module.exports = Object.assign(window, {
	// 获取真实数据类型
	getAttr(element) {
		return Object.prototype.toString.call(element).match(/[A-Z][a-z]*/)[0]
	},
	// 判断是否空对象
	isEmptyObject(obj) {
		try {
			return !Object.keys(obj).length
		} catch(e) {
			return false
		}
	},
	// 判断是否数组
	isNumber(num) {
		return typeof num === 'number'
	},
	// 深拷贝
	deepCopy(obj) {
		try {
			return JSON.parse(JSON.stringify(obj))
		} catch(e) {
			console.error(e)
			return obj
		}
	},
	// 对象是否相等
	objEqual(obj1, obj2) {
		try {
			return JSON.stringify(obj1) === JSON.stringify(obj2)
		} catch(e) {
			console.error(e)
			return false
		}
	},
	randomColor() {
		return ('000000' + (~~((1 << 24) * random())).toString(16)).substr(-6)
	},
	randomRange(num1 = 0, num2 = 100, digit = 3) {
		return round((num2 - num1) * random() + num1)
	},
	pad(num, digit = 3, space = '0') {
		var str    = new Array(digit).join(space) + space
		var numStr = `${str}${num}`.substr(-digit)
		return numStr
	},
	// 节流
	_throttle(action, delay = 160) {
		let last = 0
		return function() {
			var curr = +new Date()
			if (curr - last > delay) {
				action.apply(this, arguments)
				last = curr
			}
		}
	},
	// 防抖
	_debounce(action, delay = 160) {
		let timeout
		return e => {
			clearTimeout(timeout)
			e.persist && e.persist()
			timeout = setTimeout(() => {
				action(e)
			}, delay)
		}
	}
})