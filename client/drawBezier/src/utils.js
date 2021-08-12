// Math - 内联函数
const { abs, cos, sin, acos, atan2, sqrt, pow, PI } = Math

// 生成根的立方根函数
function crt(v) {
	return v < 0? -pow(-v, 1 / 3): pow(v, 1 / 3)
}

// 常量
const TAU = 2 * PI

// 零坐标
const ZERO = { x: 0, y: 0 }

// 勒让德-高斯 横坐标，n=24 (x_i 值，在 i=n 处定义为 n 阶勒让德多项式 Pn(x) 的根)
const Tvalues = [
	-0.0640568928626056260850430826247450385909,
	0.0640568928626056260850430826247450385909,
	-0.1911188674736163091586398207570696318404,
	0.1911188674736163091586398207570696318404,
	-0.3150426796961633743867932913198102407864,
	0.3150426796961633743867932913198102407864,
	-0.4337935076260451384870842319133497124524,
	0.4337935076260451384870842319133497124524,
	-0.5454214713888395356583756172183723700107,
	0.5454214713888395356583756172183723700107,
	-0.6480936519369755692524957869107476266696,
	0.6480936519369755692524957869107476266696,
	-0.7401241915785543642438281030999784255232,
	0.7401241915785543642438281030999784255232,
	-0.8200019859739029219539498726697452080761,
	0.8200019859739029219539498726697452080761,
	-0.8864155270044010342131543419821967550873,
	0.8864155270044010342131543419821967550873,
	-0.9382745520027327585236490017087214496548,
	0.9382745520027327585236490017087214496548,
	-0.9747285559713094981983919930081690617411,
	0.9747285559713094981983919930081690617411,
	-0.9951872199970213601799974097007368118745,
	0.9951872199970213601799974097007368118745,
]

// 勒让德-高斯 权重 n=24（w_i 值，由链接到 Bezier 入门文章中的函数定义）
const Cvalues = [
	0.1279381953467521569740561652246953718517,
	0.1279381953467521569740561652246953718517,
	0.1258374563468282961213753825111836887264,
	0.1258374563468282961213753825111836887264,
	0.121670472927803391204463153476262425607,
	0.121670472927803391204463153476262425607,
	0.1155056680537256013533444839067835598622,
	0.1155056680537256013533444839067835598622,
	0.1074442701159656347825773424466062227946,
	0.1074442701159656347825773424466062227946,
	0.0976186521041138882698806644642471544279,
	0.0976186521041138882698806644642471544279,
	0.086190161531953275917185202983742667185,
	0.086190161531953275917185202983742667185,
	0.0733464814110803057340336152531165181193,
	0.0733464814110803057340336152531165181193,
	0.0592985849154367807463677585001085845412,
	0.0592985849154367807463677585001085845412,
	0.0442774388174198061686027482113382288593,
	0.0442774388174198061686027482113382288593,
	0.0285313886289336631813078159518782864491,
	0.0285313886289336631813078159518782864491,
	0.0123412297999871995468056670700372915759,
	0.0123412297999871995468056670700372915759,
]

// 有效的浮点精度小数
const epsilon = 0.000001

// 最大&最小安全整数
const nMax = Number.MAX_SAFE_INTEGER || 9007199254740991
const nMin = Number.MIN_SAFE_INTEGER || -9007199254740991

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

// 获取两点间的距离
export const getDistance = (x1, y1, x2, y2) => {
	let dx = x1 - x2,
		dy = y1 - y2
	return sqrt(pow(dx, 2) + pow(dy, 2))
}

// 推导
export const derive = points => {
	const dpoints = []
	for (let p = points, len = p.length, last = len - 1; len > 1; len--, last--) {
		const list = []
		for (let j = 0; j < last; j++) {
			let dpt = {
				x: last * (p[j + 1].x - p[j].x),
				y: last * (p[j + 1].y - p[j].y),
			}
			list.push(dpt)
		}
		dpoints.push(list)
		p = list
	}
	return dpoints
}

// 计算点坐标 (根据范围t)
export const compute = (t = 0, points) => {
	// 捷径
	if (t === 0) {
		points[0].t = 0
		return points[0]
	}

	const order = points.length - 1

	if (t === 1) {
		points[order].t = 1
		return points[order]
	}

	const mt = 1 - t
	let p = points,
		[ p0, p1, p2, p3 ] = p

	let mt2 = mt ** 2,
		t2  = t  ** 2,
		a, b, c, d = 0

	// 二次/三次曲线
	if (order === 2) {
		p  = [p0, p1, p2, ZERO]
		a  = mt2
		b  = mt * t * 2
		c  = t2
		p3 = p[3]
	} else if (order === 3) {
		a = mt2 * mt
		b = mt2 * t * 3
		c = mt * t2 * 3
		d = t  * t2
	}
	
	const ret = {
		x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
		y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
		t,
	}

	return ret
}

// 获取线段长度
export const length = derivativeFn => {
	const z = .5,
		len = Tvalues.length

	let sum = 0

	for (let i = 0, t; i < len; i++) {
		t = z * Tvalues[i] + z
		sum += Cvalues[i] * getArc(t, derivativeFn)
	}

	return z * sum
}

// 获取角度
export const getArc = (t, derivativeFn) => {
	const d = derivativeFn(t)
	let l = d.x ** 2 + d.y ** 2
	return sqrt(l)
}

// 获取最小最大值
export const getMinMax = (curve, d, list) => {
	if (!list) return { min: 0, max: 0 }

	let min = nMax,
		max = nMin,
		t, c
	if (list.indexOf(0) === -1) {
		list = [0].concat(list)
	}
	if (list.indexOf(1) === -1) {
		list.push(1)
	}
	for (let i = 0, len = list.length; i < len; i++) {
		t = list[i]
		c = curve.get(t)
		if (c[d] < min) {
			min = c[d]
		}
		if (c[d] > max) {
			max = c[d]
		}
	}
	return {
		min,
		max,
		mid:  (min + max) / 2,
		size: max - min
	}
}

// 求根
export const roots = (points, line) => {
	line = line || { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } }

	const aligned = align(points, line)
	const reduce  = t => 0 <= t && t <= 1

	let pa = aligned[0].y,
		pb = aligned[1].y,
		pc = aligned[2].y,
		pd = aligned[3].y

	let d = -pa + 3 * pb - 3 * pc + pd,
		a = 3 * pa - 6 * pb + 3 * pc,
		b = -3 * pa + 3 * pb,
		c = pa

	// 判断三次曲线
	/*if (approximately(d, 0)) {
		// 判断二次曲线
		if (approximately(a, 0)) {
			// 判断线性
			if (approximately(b, 0)) {
				// 无解
				return []
			}
			return [-c / b].filter(reduce)
		}
		// 二次解法
		let q  = sqrt(b * b - 4 * a * c),
			a2 = 2 * a
		return [(q - b) / a2, (-b - q) / a2].filter(reduce)
	}*/

	// 三次解法
	a /= d
	b /= d
	c /= d

	let p  = (3 * b - a ** 2) / 3,
		p3 = p / 3,
		q  = (2 * a ** 3 - 9 * a * b + 27 * c) / 27,
		q2 = q / 2,
		discriminant = q2 ** 2 + p3 ** 3

	let u1, v1, x1, x2, x3
	if (discriminant < 0) {
		let mp3    = -p / 3,
			mp33   = mp3 * mp3 * mp3,
			r      = sqrt(mp33),
			t      = -q / (2 * r),
			cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
			phi    = acos(cosphi),
			crtr   = crt(r),
			t1     = 2 * crtr
		x1 = t1 * cos(phi / 3) - a / 3
		x2 = t1 * cos((phi + TAU) / 3) - a / 3
		x3 = t1 * cos((phi + 2 * TAU) / 3) - a / 3
		return [x1, x2, x3].filter(reduce)
	} else if (discriminant === 0) {
		u1 = q2 < 0 ? crt(-q2) : -crt(q2)
		x1 = 2 * u1 - a / 3
		x2 = -u1 - a / 3
		return [x1, x2].filter(reduce)
	} else {
		const sd = sqrt(discriminant)
		u1 = crt(-q2 + sd)
		v1 = crt(q2 + sd)
		return [u1 - v1 - a / 3].filter(reduce)
	}
}

// 求根
export const droots = p => {
	let [a, b, c] = p
	// 二次根
	if (p.length === 3) {
		let d = a - 2 * b + c
		if (d !== 0) {
			let m1 = -sqrt(b * b - a * c),
				m2 = -a + b,
				v1 = -(m1 + m2) / d,
				v2 = -(-m1 + m2) / d
			return [v1, v2]
		} else if (b !== c && d === 0) {
			return [(2 * b - c) / (2 * (b - c))]
		}
		return []
	}

	// 线性根
	if (p.length === 2) {
		if (a !== b) {
			return [a / (a - b)]
		}
		return []
	}

	return []
}

// 数字排序
export const numberSort = list => {
	return list.sort((a, b) => a - b)
}

// 之间
export const between = (v, m, M) => {
    return ((m <= v && v <= M) || approximately(v, m) || approximately(v, M))
}

// 约等于
export const approximately = (a, b, precision) => {
    return abs(a - b) <= (precision || epsilon)
}

// 遍历
export const map = (v, ds, de, ts, te) => {
	let d1 = de - ds,
		d2 = te - ts,
		v2 = v  - ds,
		r  = v2 / d1

	return ts + d2 * r
}

// 对齐
export const align = (points, line) => {
	let { p1, p2 } = line,
		tx = p1.x,
		ty = p1.y,
		a  = -atan2(p2.y - ty, p2.x - tx)

	return points.map(v => {
		return {
			x: (v.x - tx) * cos(a) - (v.y - ty) * sin(a),
			y: (v.x - tx) * sin(a) + (v.y - ty) * cos(a),
		}
	})
}

// 
export const pairiteration = (c1, c2) => {
	let c1b = c1.bbox(),
		c2b = c2.bbox(),
		r   = 100000,
		threshold = 0.5

	if (
		c1b.x.size + c1b.y.size < threshold &&
		c2b.x.size + c2b.y.size < threshold
	) {
		return [
			(((r * (c1._t1 + c1._t2)) / 2) | 0) / r + '/' + (((r * (c2._t1 + c2._t2)) / 2) | 0) / r
		]
	}

	let cc1 = c1.split(0.5),
		cc2 = c2.split(0.5),
		pairs = [
			{ left: cc1.left,  right: cc2.left },
			{ left: cc1.left,  right: cc2.right },
			{ left: cc1.right, right: cc2.right },
			{ left: cc1.right, right: cc2.left },
		]

	pairs = pairs.filter(pair => {
		return bboxoverlap(pair.left.bbox(), pair.right.bbox())
	})

	let results = []

	if (!pairs.length) return results

	pairs.forEach(function (pair) {
		results = results.concat(pairiteration(pair.left, pair.right, threshold))
	})

	results = results.filter(function (v, i) {
		return results.indexOf(v) === i
	})

	return results
}

export const bboxoverlap = (b1, b2) => {
	let dims = ['x', 'y'],
		len  = dims.length,
		dim, l, t, d

	for (let i = 0; i < len; i++) {
		dim = dims[i]
		l   = b1[dim].mid
		t   = b2[dim].mid
		d   = (b1[dim].size + b2[dim].size) / 2
		if (abs(l - t) >= d) return false
	}
	return true
}

export const lerp = (r, v1, v2) => {
	let ret = {
		x: v1.x + r * (v2.x - v1.x),
		y: v1.y + r * (v2.y - v1.y),
	}
	if (v1.z !== undefined && v2.z !== undefined) {
		ret.z = v1.z + r * (v2.z - v1.z)
	}
	return ret
}

export const angle = function (o, v1, v2) {
	let dx1   = v1.x - o.x,
		dy1   = v1.y - o.y,
		dx2   = v2.x - o.x,
		dy2   = v2.y - o.y,
		cross = dx1 * dy2 - dy1 * dx2,
		dot   = dx1 * dx2 + dy1 * dy2
	return atan2(cross, dot)
}
