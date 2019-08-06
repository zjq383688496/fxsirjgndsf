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
			{ data, lines } = props,
			{ output, layout } = data,
			{ w, h, r } = layout,
			tx = x + (r || w / 2),
			ty = y + (r || h / 2)

		output.forEach(_ => {
			var { bind } = _
			if (!bind) return
			var tarLineInput = lines[bind.id][bind.index]
			if (tarLineInput) {
				tarLineInput.init(null, null, tx, ty, true)
			}
		})
		lineInput.forEach(_ => _.init(x, y))
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
