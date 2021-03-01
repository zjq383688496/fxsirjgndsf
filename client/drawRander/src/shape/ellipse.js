import { filter } from './filter'
import { getDistance } from '../utils'

const { PI } = Math

export default class ellipse {
	constructor(cfg = {}, parent) {
		this.cfg    = cfg
		this.parent = parent
		this.group  = []

		this.init(cfg)

		this.draw(cfg, this.group)

		if (cfg.name) this.name = cfg.name
	}
	init(cfg) {
		filter('ellipse', cfg)
	}
	draw(cfg, group) {
		let { ctx } = this.parent
		let { x, y, rx, ry, rotate, sAngle, eAngle, opacity, fill, stroke, strokeWidth } = cfg.attrs
		
		// 设置画板透明度
		if (opacity < 1) ctx.globalAlpha = opacity
		ctx.beginPath()

		// 绘制椭圆
		ctx.ellipse(x, y, rx, ry, 0, 0, 2 * PI)

		// 填充颜色
		ctx.fillStyle = fill
		ctx.fill()

		// 描边
		if (strokeWidth) {
			ctx.strokeStyle = stroke
			ctx.lineWidth   = strokeWidth
			ctx.stroke()
		}

		ctx.closePath()

		ctx.globalAlpha = 1
	}
	// 根据坐标判断点是否在矩形内
	pointIn(offsetX, offsetY) {
		let { x, y, r } = this.cfg.attrs
		let dis = getDistance(offsetX, offsetY, x, y)
		return dis <= r
	}
}