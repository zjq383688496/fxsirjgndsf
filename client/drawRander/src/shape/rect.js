import { filter } from './filter'

export default class rect {
	constructor(cfg = {}, parent) {
		this.cfg    = cfg
		this.parent = parent
		this.group  = []

		this.init(cfg)

		this.draw(cfg, this.group)

		if (cfg.name) this.name = cfg.name
	}
	init(cfg) {
		filter('rect', cfg)
	}
	draw(cfg, group) {
		let { ctx } = this.parent
		let { x, y, width, height, opacity, fill, stroke, strokeWidth } = cfg.attrs
		
		// 设置画板透明度
		if (opacity < 1) ctx.globalAlpha = opacity

		ctx.beginPath()

		// 绘制矩形
		ctx.rect(x, y, width, height)

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
		let { x, y, width, height } = this.cfg.attrs
		let ex = x + width, ey = y + height
		return offsetX >= x && offsetX <= ex && offsetY >= y && offsetY <= ey
	}
}