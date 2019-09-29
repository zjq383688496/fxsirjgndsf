/* 节点相关 */
var { abs } = Math

export class Node {
	constructor(props) {
		this._self = props
	}
	NodeStart = (node, data) => {
		var _self = this._self,
			{ id } = data
		_self.pointInputIdx = id
		__Node__.setNodeCur(data)
		$(node).addClass('s-active')
		_self.dragTimeout = setTimeout(() => {
			$(node).hide()
			clearTimeout(_self.dragTimeout)
		}, 10)

		__Redux__.actions.selectNode(id)
	}

	// 拖拽中
	NodeMove = (x, y, node) => {
		var { lineInput, props, moveInfo } = this._self,
			{ data, lines, sourceMap } = props,
			{ id, input = {}, layout } = data,
			{ bind, init } = input,
			output = sourceMap[id],
			{ w, h, r, cx, cy } = layout,
			tx = x + (r || w / 2),
			ty = y + (r || h / 2),
			dx, dy, ox = 0, oy = 0

		lineInput.forEach((_, i) => {
			var { bind, init } = input[i],
				point, startPos, targetLay, startX, startY//, dx, dy, ox = 0, oy = 0

			if (bind) {
				var lay = __Redux__.Config.Nodes[bind.id].layout
				startX = lay.cx
				startY = lay.cy
			} else {
				var { offsetX = -20, offsetY = -40 } = init
				startX = tx + offsetX
				startY = ty + offsetY
			}

			startPos = { startX, startY }
			targetLay = { w, h, r, cx: tx, cy: ty }

			// 输入坐标吸附
			dx = tx - startX
			dy = ty - startY
			if (abs(dx) < 10) { targetLay.cx = startX; ox = dx }
			if (abs(dy) < 10) { targetLay.cy = startY; oy = dy }

			point = __Node__.getPoint(startPos, targetLay)

			_.init(startX, startY, point.x, point.y, '#fff')
		})

		if (output) {
			for (var _id in output) {
				var line = lines[_id][output[_id]],
					lay  = line.data.layout

				line.init(tx, ty, null, null)
			}
			// console.log('2. move node output')
		}

		moveInfo.ox = ox
		moveInfo.oy = oy
		// console.log('2. move node input')
	}

	// 拖拽结束
	NodeEnd = (x, y, node) => {
		var { _self } = this,
			{ props, state, moveInfo } = _self,
			{ ox = 0, oy = 0 } = moveInfo,
			{ data }   = props,
			{ layout } = data

		x -= ox
		y -= oy

		$(node).show().removeClass('s-active')
		
		_self.setState({ x, y })

		__Node__.setNodeCur()
		__Node__.setNodeTar()

		layout.x = x
		layout.y = y

		__Redux__.actions.updateNode(data)
	}
	
	// 拖拽接触
	NodeDragEnter = (e, data) => {
		__Node__.setNodeTar(data)
	}

	// 拖拽离开
	NodeDragLeave = e => {
		var _self = this._self
		_self.dragTimeout = setTimeout(() => {
			__Node__.setNodeTar()
			clearTimeout(_self.dragTimeout)
		}, 160)
	}
}
