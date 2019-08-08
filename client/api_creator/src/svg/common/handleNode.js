/* 节点相关 */

export class Node {
	constructor(props) {
		this._self = props
	}
	NodeStart = (node, data) => {
		var _self = this._self
		_self.pointInputIdx = data.id
		__Node__.setNodeCur({ type: 'node', ...data })
		$(node).addClass('s-active')
		_self.dragTimeout = setTimeout(() => {
			$(node).hide()
			clearTimeout(_self.dragTimeout)
		}, 10)
	}

	// 拖拽中
	NodeMove = (x, y, node) => {
		var { lineInput, props } = this._self,
			{ data, lines, sourceMap } = props,
			{ id, input = {}, layout } = data,
			{ bind, init } = input,
			output = sourceMap[id],
			{ w, h, r } = layout,
			tx = x + (r || w / 2),
			ty = y + (r || h / 2)

		if (output) {
			for (var _id in output) {
				console.log('2. move node output')
				var line = lines[_id][output[_id]]
				line.init(tx, ty, null, null)
			}
		}

		lineInput.forEach((_, i) => {
			var { bind, init } = input[i],
				point, startPos, targetLay, startX, startY

			if (bind) {
				var { id, index } = bind,
					lay = __Redux__.Config.Nodes[id].layout
				startX = lay.cx
				startY = lay.cy
			} else {
				var { offsetX = -20, offsetY = -40 } = init
				startX = tx + offsetX
				startY = ty + offsetY
			}
			startPos = { startX, startY }
			targetLay = { w, h, r, cx: tx, cy: ty }
			if (w && h) {
				point = __Node__.getPointRect(startPos, targetLay)
			} else if (r) {
				point = __Node__.getPointCircle(startPos, targetLay)
			}
			console.log('2. move node input')
			_.init(startX, startY, point.x, point.y, '#fff')
		})
	}

	// 拖拽结束
	NodeEnd = (x, y, node) => {
		var _self = this._self,
			{ props, state } = _self
		var { data }   = props,
			{ layout } = data
		
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
		__Node__.setNodeTar({ type: 'node', ...data })
		console.log('NodeEnter', e.target.className)
	}

	// 拖拽离开
	NodeDragLeave = e => {
		var _self = this._self
		_self.dragTimeout = setTimeout(() => {
			__Node__.setNodeTar()
			console.log('NodeLeave')
			clearTimeout(_self.dragTimeout)
		}, 100)
	}
}
