import { filter } from './filter'

export default class bezier {
	constructor(cfg = {}, parent) {
		this.cfg    = cfg
		this.parent = parent
		this.group  = []

		this.init(cfg)

		this.draw(cfg, this.group)

		if (cfg.name) this.name = cfg.name
	}
	init(cfg) {
		filter('bezier', cfg)
	}
	draw(cfg, group) {
		let { ctx } = this.parent
		let { paths, opacity, fill, stroke, strokeWidth } = cfg.attrs
		let len = paths.length
		if (len < 4) return console.log('bezier 数据为空!')

		// 设置画板透明度
		if (opacity < 1) ctx.globalAlpha = opacity

		ctx.beginPath()

		// 绘制矩形
		let [ x, y ] = paths[0]
		ctx.moveTo(x, y)

		for (let i = 1, j = i + 1, k = i + 2; i < len; i += 3, j += 3, k += 3) {
			let cp1 = paths[i],
				cp2 = paths[j],
				end = paths[k]
			ctx.bezierCurveTo(...cp1, ...cp2, ...end)
		}

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

		paths.forEach(cp => {
			ctx.beginPath()
			ctx.arc(...cp, 2, 0, 2 * Math.PI)
			ctx.fillStyle = 'red'
			ctx.fill()
			ctx.closePath()
		})
	}
	// 根据坐标判断点是否在矩形内
	pointIn(offsetX, offsetY) {
		let { paths } = this.cfg.attrs
		let isIn = false
		// paths.forEach(([ x1, y1 ], i) => {
		// })
		return isIn
	}
}