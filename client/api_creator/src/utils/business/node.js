var NodeCur = {},
	NodeTar = {}

var { abs, atan, cos, sin, PI } = Math

module.exports = {
	// 拖拽开始
	dragStart: function(e, cb, data) {
		if (!this.setState) return
		var { clientX, clientY, target } = e,
			{ top, left } = target.style,
			x = parseInt(left),
			y = parseInt(top)

		this.moveInfo = { x, y, clientX, clientY }

		this.setState({ isMove: true })

		cb && cb(target, data)
	},
	// 拖拽中
	dragMove: function(e, cb, liveUpdate = true, data) {
		var { scale }  = this.props,
			{ isMove } = this.state
		if (!isMove) return
		var { target } = e,
			{ x, y, clientX, clientY }   = this.moveInfo

		if (!e.clientX && !e.clientY) return

		var nx = x + (e.clientX - clientX) / scale,
			ny = y + (e.clientY - clientY) / scale

		if (liveUpdate) {
			target.style.top  = `${ny}px`
			target.style.left = `${nx}px`
		}

		cb && cb(nx, ny, target, data)
	},
	// 拖拽结束
	dragEnd: function(e, cb, data) {
		if (!this.setState) return
		var { scale }  = this.props,
			{ target } = e,
			{ top, left } = target.style,
			{ x, y, clientX, clientY } = this.moveInfo

		var nx = x + (e.clientX - clientX) / scale,
			ny = y + (e.clientY - clientY) / scale

		this.moveInfo = null
		this.setState({ isMove: false })
		cb && cb(nx, ny, target, data)
	},
	// 当前&目标 节点相关
	setNodeCur: obj => {
		NodeCur = obj || {}
	},
	setNodeTar: obj => {
		NodeTar = obj || {}
	},
	getNodeCur: () => NodeCur || {},
	getNodeTar: () => NodeTar || {},

	// 创建箭头
	createArrow: function(draw) {
		this._arrow = draw.marker(24, 4, function(add) {
			add.path('M 0,0 L 0,4 L 6,2 z').fill('#000000')
		})
	},

	// 获取交点(矩形)
	getPointRect: function ({ startX, startY }, { x, y, w, h, cx, cy }) {
		x = x - 4
		y = y - 4
		w = w + 8
		h = h + 8
		// 初始变量
		var centerX = cx,		// 矩形 中心坐标 x
			centerY = cy,		// 矩形 中心坐标 y
			axisX   = startX < centerX? 1: -1,	// 轴坐标 x -1 || 1
			axisY   = startY < centerY? 1: -1,	// 轴坐标 y -1 || 1
			px   = startX < centerX? 'left': 'right',				// 轴坐标 x 左 || 有
			py   = startY < centerY? 'top' : 'bottom',				// 轴坐标 y 上 || 下
			tanR = abs((centerY - y) / (centerX - x)),				// 正切 矩形对角
			tanL = abs((centerY - startY) / (centerX - startX)),	// 正切 线对角
			pos  = tanR > tanL? px: py								// 最终轴

		var axia = ({ top: 'y', right: 'x', bottom: 'y', left: 'x' })[pos],
			line = ({
			top:    { x, y },
			right:  { x: x + w, y },
			bottom: { x, y: y + h },
			left:   { x, y },
		})[pos]

		var X = axia === 'x'? line.x: centerX - (centerY - line.y) / tanL * axisX * axisY,
			Y = axia === 'y'? line.y: centerY - (centerX - line.x) * tanL * axisX * axisY

		return { x: X, y: Y }
	},

	// 获取交点(圆形)
	getPointCircle: function ({ startX, startY }, { cx, cy, r }) {
		r = r + 4
		// 初始变量
		var dx     = cx - startX,
			dy     = cy - startY,
			px     = startX < cx? 90: 270,	// 轴坐标 x 左 || 有
			angle  = 360 * atan(dy / dx) / (2 * Math.PI) + px,
			radian = (2 * PI / 360) * angle,
			x = cx - sin(radian) * r,
			y = cy + cos(radian) * r
		return { x, y }
	}
}