import { getClass, objEqual } from '../utils'

const { PI } = Math

const getDefaultValue = {
	x:           { type: Number, default: (val = 0) => val },										// (圆心) x轴坐标
	y:           { type: Number, default: (val = 0) => val },										// (圆心) y轴坐标
	r:           { type: Number, default: (val = 0) => val < 0? 0: val },							// 半径
	rx:          { type: Number, default: (val = 0) => val < 0? 0: val },							// x轴半径
	ry:          { type: Number, default: (val = 0) => val < 0? 0: val },							// y轴半径
	width:       { type: Number, default: (val = 0) => val < 0? 0: val },							// 宽
	height:      { type: Number, default: (val = 0) => val < 0? 0: val },							// 高
	rotate:      { type: Number, default: (val = 0)   => val < 0? 0: val > 360? 360: val },			// 旋转角度
	sAngle:      { type: Number, default: (val = 0)   => val < 0? 0: val > 360? 360: val },			// 起始角
	eAngle:      { type: Number, default: (val = 360) => val < 0? 0: val > 360? 360: val },			// 结束角
	// 路径
	points:      {
		type: Array,
		default: (val = [])  => {
			let error = 0
			val.forEach(vs => {
				if (error) return
				let t = getClass(vs)
				if (t != 'Array')   return error = 1
				if (vs.length != 2) return error = 1
				let [ num1, num2 ] = vs
				vs.forEach(num => {
					if (error) return
					let nt = getClass(num)
					if (nt != 'Number') return error = 1
				})
			})
			if (error || val.length < 2) return []
			val[-1] = val[val.length - 1]
			return val
		}
	},
	opacity:     { type: Number, default: (val = 1) => val < 0? 0: val > 1? 1: val },				// 透明度
	fill:        { type: String, default: (val) => val || 'black' },								// 填充色
	stroke:      { type: String, default: (val) => val || 'rgba(0, 0, 0, 0)' },						// 描边色
	strokeWidth: { type: Number, default: (val = 0) => val < 0? 0: val },							// 描边宽
}

// 属性字段索引
const keysMap = {
	rect:    ['x', 'y', 'width', 'height', 'opacity', 'fill', 'stroke', 'strokeWidth'],
	circle:  ['x', 'y', 'r', /*'sAngle', 'eAngle',*/ 'opacity', 'fill', 'stroke', 'strokeWidth'],
	ellipse: ['x', 'y', 'rx', 'ry', 'rotate', /*'sAngle', 'eAngle',*/ 'opacity', 'fill', 'stroke', 'strokeWidth'],
	polygon: ['points', 'opacity', 'fill', 'stroke', 'strokeWidth'],
}

export const filter = (name, cfg) => {
	let attrs = cfg.attrs
	if (!attrs) attrs = cfg.attrs = {}

	let kMap = keysMap[name]
	if (!kMap) return

	// 过滤多余属性
	Object.keys(attrs).forEach(key => {
		let idx = kMap.indexOf(key)
		if (idx < 0) delete attrs[key]
	})

	// 检测 & 赋值默认值
	kMap.forEach(key => {
		let val   = attrs[key],
			def   = getDefaultValue[key],
			tName = def.type.name,
			cName

		if (val === undefined) return attrs[key] = def.default()		// 空值赋值

		cName = getClass(val)
		if (cName != tName) return attrs[key] = def.default()			// 类型不正确赋值

		attrs[key] = def.default(val)
	})
}
