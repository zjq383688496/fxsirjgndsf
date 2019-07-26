module.exports = {
	handleDown: function(e, node, cb) {
		if (!this.setState) return
		var { top, left } = node.style,
			{ clientX, clientY } = e,
			x = parseInt(left),
			y = parseInt(top)
		this.moveNode = node
		this.moveInfo = { x, y }
		console.log(this.moveInfo)
		this.setState({
			isMove: true,
			clientX,
			clientY
		})
		cb && cb()
	},
	handleMove: function(e, node, cb) {
		var { isMove, clientX, clientY } = this.state
		if (!isMove) return
		var { x, y }  = this.moveInfo,
			{ Scale } = __Redux__.Config.NodeInfo

		var nx = x * Scale + (e.clientX - clientX) / Scale,
			ny = y * Scale + (e.clientY - clientY) / Scale

		node.style.top  = `${ny}px`
		node.style.left = `${nx}px`

		cb && cb(nx, ny, node)
	},
	handleUp: function(e, node, cb) {
		if (!this.setState) return
		var { top, left } = node.style,
			x = parseInt(left),
			y = parseInt(top)

		this.setState({ isMove: false })
		cb && cb(x, y, node)
	},
	// 创建箭头
	arrow: function(add) {
		add.path('M 0,0 L 0,4 L 6,2 z').fill('#000000')
	},
	// 创建拖拽点
	dragPoint: function(add) {
		add.circle(20).attr({ 'fill-opacity': 0.3 })
	},
	// 获取交点(矩形)
	getPointRect: function ({ sx, sy }, rect) {
		// 初始变量
		var w    = rect.width(),	// 矩形宽
			h    = rect.height(),	// 矩形高
			x    = rect.x(),		// 矩形 x 坐标
			y    = rect.y(),		// 矩形 y 坐标
			cx   = x + w / 2,		// 矩形 中心坐标 x
			cy   = y + h / 2,		// 矩形 中心坐标 y
			ax   = sx < cx? 1: -1,	// 轴坐标 x -1 || 1
			ay   = sy < cy? 1: -1,	// 轴坐标 y -1 || 1
			px   = sx < cx? 'left': 'right',			// 轴坐标 x 左 || 有
			py   = sy < cy? 'top' : 'bottom',			// 轴坐标 y 上 || 下
			tanR = Math.abs((cy - y)  / (cx - x)),		// 正切 矩形对角
			tanL = Math.abs((cy - sy) / (cx - sx)),		// 正切 线对角
			pos  = tanR > tanL? px: py					// 最终轴

		var axia = ({ top: 'y', right: 'x', bottom: 'y', left: 'x' })[pos],
			line = ({
			top:    { x, y },
			right:  { x: x + w, y },
			bottom: { x, y: y + h },
			left:   { x, y },
		})[pos]

		var X = axia === 'x'? line.x: cx - (cy - line.y) / tanL * ax * ay,
			Y = axia === 'y'? line.y: cy - (cx - line.x) * tanL * ax * ay

		return { x: X, y: Y }
	},
	// 获取交点(圆形)
	getPointCircle: function ({ sx, sy }, { cx, cy, r }) {
		// 初始变量
		var dx     = cx - sx,
			dy     = cy - sy,
			px     = sx < cx? 90: 270,	// 轴坐标 x 左 || 有
			angle  = 360 * Math.atan(dy / dx) / (2 * Math.PI) + px,
			radian = (2 * Math.PI / 360) * angle
		var x = cx - Math.sin(radian) * r
			y = cy + Math.cos(radian) * r
		return { x, y }
	}
}