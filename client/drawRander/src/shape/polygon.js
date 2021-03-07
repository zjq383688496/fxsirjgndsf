import { filter } from './filter'

export default class polygon {
	constructor(cfg = {}, parent) {
		this.cfg    = cfg
		this.parent = parent
		this.group  = []

		this.init(cfg)

		this.draw(cfg, this.group)

		if (cfg.name) this.name = cfg.name
	}
	init(cfg) {
		filter('polygon', cfg)
	}
	draw(cfg, group) {
		let { ctx } = this.parent
		let { points, opacity, fill, stroke, strokeWidth } = cfg.attrs
		
		if (points.length < 2) return console.log('polygon 数据为空!')

		// 设置画板透明度
		if (opacity < 1) ctx.globalAlpha = opacity

		ctx.beginPath()

		// 绘制矩形
		let [ x, y ] = points[0],
			[ ex, ey ] = points[-1]
		ctx.moveTo(x, y)
		points.forEach((point, i) => {
			if (!i) return
			let [ x, y ] = point
			ctx.lineTo(x, y)
		})

		if (ex != x || ey != y) ctx.lineTo(x, y)	// 线闭合

		// 填充颜色
		if (fill) {
			ctx.fillStyle = fill
			ctx.fill()
		}

		// 描边
		if (stroke && strokeWidth > 0) {
			ctx.strokeStyle = stroke
			ctx.lineWidth   = strokeWidth
			ctx.stroke()
		}

		ctx.closePath()

		ctx.globalAlpha = 1
	}
	// 根据坐标判断点是否在矩形内
	pointIn(offsetX, offsetY) {
		let { points } = this.cfg.attrs
		let isIn = false
		points.forEach(([ x1, y1 ], i) => {
			let [ x2, y2 ] = points[i - 1],
				dx = x2 - x1,
				dy = y2 - y1

			// 判断当前点的y轴是否在两点之间 不在则不相交
			if ((y1 > offsetY) === (y2 > offsetY)) return

			let scale = (offsetY - y1) / dy		// y轴比率
			let ox    = x1 + dx * scale			// 交点x轴坐标
			
			// 判断交点在当前点哪边 左边则不相交
			if (ox > offsetX) return
			isIn = !isIn
		})
		return isIn
	}
}