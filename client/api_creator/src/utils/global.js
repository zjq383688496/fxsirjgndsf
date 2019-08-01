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
		return ('000000' + (~~((1 << 24) * Math.random())).toString(16)).substr(-6)
	}
})