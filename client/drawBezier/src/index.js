import { version } from '../package.json'

import {
	angle,
	between, bboxoverlap,
	compute,
	derive, droots,
	length, lerp,
	getMinMax, getClass,
	map, numberSort,
	pairiteration,
	roots
} from './utils'

// Math - 内联函数
const { abs, min, max, cos, sin, acos, sqrt } = Math
const PI = Math.PI

// 常量

// 三次Bezier曲线构造函数
class DBezier {
	constructor(coords) {
		console.log('version: ' + version)
		let args = coords && coords.forEach? coords: Array.from(arguments).slice(),
			coordlen, len
		
		// 支持对象形势 { x: number, y: number }
		if (getClass(args[0]) === 'Object') {
			const newArgs = []
			coordlen = args.length
			args.forEach(point => {
				['x', 'y'].forEach(d => {
					if (getClass(point[d]) === 'Number') newArgs.push(point[d])
				})
			})
			args = newArgs
		}

		len = args.length

		if (coordlen) {
			if (coordlen !== 4) {
				throw new Error('请输入 4 组 point[] 数据.')
			}
		} else {
			if (len !== 8) {
				throw new Error('请输入 8 个坐标数据.')
			}
		}

		const points = this.points = []
		for (let i = 0; i < len; i += 2) {
			var point = {
				x: args[i],
				y: args[i + 1],
			}
			points.push(point)
		}

		const order = this.order = points.length - 1

		const dims = this.dims = ['x', 'y']

		this._lut = []	// 初始化检查票

		this._t1 = 0
		this._t2 = 1
		
		this.version = version

		this.update()
	}
	// 曲线坐标 (根据t)
	get(t) {
		return this.compute(t)
	}
	// 获取点 (根据索引)
	point(idx) {
		return this.points[idx]
	}
	// 计算
	compute(t) {
		return compute(t, this.points)
	}
	update() {
		this._lut = []
		this.dpoints = derive(this.points)
		// this.computedirection()
	}
	length() {
		return length(this.derivative.bind(this))
	}
	// 求导数
	derivative(t) {
		return compute(t, this.dpoints[0])
	}
	dderivative(t) {
		return compute(t, this.dpoints[1])
	}

	// 获取盒模型
	bbox() {
		const extrema = this.extrema(),
			result = {}
		this.dims.forEach(d => {
			result[d] = getMinMax(this, d, extrema[d])
		})
		return result
	}

	overlaps(curve) {
		let lbbox = this.bbox(),
			tbbox = curve.bbox()
		return bboxoverlap(lbbox, tbbox)
	}

	// 获取极限值
	extrema() {
		let result = {},
			roots  = [],
			{ dpoints } = this
		this.dims.forEach(dim => {
			let mfn = v => v[dim],
				p   = this.dpoints[0].map(mfn)

			result[dim] = droots(p)
			if (this.order === 3) {
				p = this.dpoints[1].map(mfn)
				result[dim] = result[dim].concat(droots(p))
			}
			result[dim] = result[dim].filter(t => t >= 0 && t <= 1)
			roots = roots.concat(numberSort(result[dim]))
		})

		result.values = numberSort(roots).filter(function (v, i) {
			return roots.indexOf(v) === i
		})

		return result
	}

	// 相交
	intersects(curve) {
		if (!curve) throw new Error('请输入 曲线 或 直线 数据.')

		// 直线相交
		if (curve.p1 && curve.p2) {
			return this.lineIntersects(curve)
		}

		// 曲线相交
		if (curve instanceof DBezier) {
			curve = curve.reduce()
		}

		return this.curveintersects(
			this.reduce(),
			curve
		)
	}

	// 自身相交
	selfintersects() {
		// 简单曲线不能与其直接相邻的曲线相交, 因此对于每个线段 X，我们检查它是否与 [0:x-2][x+2:last] 相交。
		let reduced = this.reduce(),
			len     = reduced.length - 2,
			results = []

		for (let i = 0, result, left, right; i < len; i++) {
			left   = reduced.slice(i, i + 1)
			right  = reduced.slice(i + 2)
			result = this.curveintersects(left, right)
			results.push(...result)
		}
		return results
	}

	// 直线相交
	lineIntersects(line) {
		let { p1, p2 } = line,
			{ x: x1, y: y1 } = p1,
			{ x: x2, y: y2 } = p2
		let mx = min(x1, x2),
			my = min(y1, y2),
			MX = max(x1, x2),
			MY = max(y1, y2)
		
		let rootList = roots(this.points, line).filter((t) => {
			var p = this.get(t)
			return between(p.x, mx, MX) && between(p.y, my, MY)
		})
		return rootList.map(t => this.get(t))
		// return rootList
	}

	// 曲线相交
	curveintersects(c1, c2) {
		const pairs = []
		// step 1: 配对任何重叠的片段
		c1.forEach(function (left) {
			c2.forEach(function (right) {
				if (left.overlaps(right)) {
					pairs.push({ left, right })
				}
			})
		})
		// step 2: 对于每个配对运行收敛算法
		let intersections = []
		pairs.forEach(function (pair) {
			const result = pairiteration(pair.left, pair.right)
			if (result.length) {
				intersections = intersections.concat(result)
			}
		})
		return intersections
	}

	simple() {
		if (this.order === 3) {
			const a1 = angle(this.points[0], this.points[3], this.points[1])
			const a2 = angle(this.points[0], this.points[3], this.points[2])
			if ((a1 > 0 && a2 < 0) || (a1 < 0 && a2 > 0)) return false
		}
		const n1 = this.normal(0)
		const n2 = this.normal(1)
		let s = n1.x * n2.x + n1.y * n2.y
			if (this._3d) {
			s += n1.z * n2.z
		}
		return abs(acos(s)) < PI / 3
	}

	reduce() {
		// 详细检查变量类型
		let i,
			t1    = 0,
			t2    = 0,
			step  = 0.01,
			pass1 = [],
			pass2 = [],
			segment

		// 第一步: 极值分割
		let extrema = this.extrema().values

		if (extrema.indexOf(0) === -1) extrema = [0].concat(extrema)
		if (extrema.indexOf(1) === -1) extrema.push(1)

		for (t1 = extrema[0], i = 1; i < extrema.length; i++) {
			t2 = extrema[i]
			segment = this.split(t1, t2)
			segment._t1 = t1
			segment._t2 = t2
			pass1.push(segment)
			t1 = t2
		}

		// 第二步: 进一步将这些段减少为简单段
		pass1.forEach(p1 => {
			t1 = 0
			t2 = 0
			while (t2 <= 1) {
				for (t2 = t1 + step; t2 <= 1 + step; t2 += step) {
					segment = p1.split(t1, t2)
					if (!segment.simple()) {
						t2 -= step
						if (abs(t1 - t2) < step) {
							return []					// 无法再减少
						}
						segment = p1.split(t1, t2)
						segment._t1 = map(t1, 0, 1, p1._t1, p1._t2)
						segment._t2 = map(t2, 0, 1, p1._t1, p1._t2)
						pass2.push(segment)
						t1 = t2
						break
					}
				}
			}
			if (t1 < 1) {
				segment = p1.split(t1, 1)
				segment._t1 = map(t1, 0, 1, p1._t1, p1._t2)
				segment._t2 = p1._t2
				pass2.push(segment)
			}
		})
		return pass2
	}

	split(t1, t2) {
		// 捷径
		if (t1 === 0 && !!t2) {
			return this.split(t2).left
		}
		if (t2 === 1) {
			return this.split(t1).right
		}

		// 没有捷径：使用 "de Casteljau" 算法
		const q = this.hull(t1)
		const result = {
			left: this.order === 2
				? new DBezier([q[0], q[3], q[5]])
				: new DBezier([q[0], q[4], q[7], q[9]]),
			right: this.order === 2
				? new DBezier([q[5], q[4], q[2]])
				: new DBezier([q[9], q[8], q[6], q[3]]),
			span: q,
		}

		// 确保我们绑定了 _t1/_t2 信息
		result.left._t1  = map(0,  0, 1, this._t1, this._t2)
		result.left._t2  = map(t1, 0, 1, this._t1, this._t2)
		result.right._t1 = map(t1, 0, 1, this._t1, this._t2)
		result.right._t2 = map(1,  0, 1, this._t1, this._t2)

		// t2不存在
		if (!t2) return result

		// t2存在 再拆分
		t2 = map(t2, t1, 1, 0, 1)
		return result.right.split(t2).left
	}

	hull(t) {
		let p   = this.points,
			_p  = [],
			q   = [],
			idx = 0
		q[idx++] = p[0]
		q[idx++] = p[1]
		q[idx++] = p[2]
		if (this.order === 3) {
			q[idx++] = p[3]
		}
		// 我们在每次迭代的所有点之间进行 lerp，直到剩下 1 个点.
		while (p.length > 1) {
			_p = []
			for (let i = 0, pt, l = p.length - 1; i < l; i++) {
				pt = lerp(t, p[i], p[i + 1])
				q[idx++] = pt
				_p.push(pt)
			}
			p = _p
		}
		return q
	}

	// 法线
	normal(t) {
		const d = this.derivative(t)
		const q = sqrt(d.x * d.x + d.y * d.y)
		return { x: -d.y / q, y: d.x / q }
	}

}
export default DBezier
