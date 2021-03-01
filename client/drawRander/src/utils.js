const { pow, sqrt } = Math


// 获取真实数据类型
export const getClass = element => {
	return Object.prototype.toString.call(element).slice(8, -1)
}

// 深拷贝
export const deepCopy = obj => {
	try {
		return JSON.parse(JSON.stringify(obj))
	} catch(e) {
		console.error(e)
		return obj
	}
}

// 对象是否相等
export const objEqual = (obj1, obj2) => {
	try {
		return JSON.stringify(obj1) === JSON.stringify(obj2)
	} catch(e) {
		console.error(e)
		return false
	}
}

// 获取元素定位
export const getOffset = element => {
	var t
	const top  = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollTop  === 'number'? t: document.body).scrollTop
	const left = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollLeft === 'number'? t: document.body).scrollLeft
	return {
		top,
		left
	}
}

// 获取两点间的距离
export const getDistance = (x1, y1, x2, y2) => {
	let dx = x1 - x2,
		dy = y1 - y2
	return sqrt(pow(dx, 2) + pow(dy, 2))
}