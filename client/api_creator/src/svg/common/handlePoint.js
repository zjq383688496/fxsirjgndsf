/* 辅点相关 */
export class Point {
	constructor(props) {
		this._self = props
	}
	// 拖拽开始
	PointStart = (node, data, type) => {
		var { _self } = this
		_self.pointInputIdx = data.id
		__Node__.setNodeCur({ type, ...data })
	}
	// 拖拽中
	PointMove = (x, y, node, type) => {
		var { lineInput, props, pointInputIdx } = this._self,
			{ w, h, r } = props.data.layout,
			line = lineInput[pointInputIdx]
		x = x + (r || w / 2)
		y = y + (r || h / 2)

		switch (type) {
			case 'out':
				// console.log('3. move point input')
				line.init(x + 5, y + 5, null, null, '#fff')
				break
			case 'in':
				// console.log('3. move point output')
				line.init(null, null, x + 5, y + 5)
				break
			default: break
		}
	}
	// 拖拽结束
	PointEnd = (x, y, node) => {
		var { lineInput, props, pointInputIdx } = this._self,
			{ type } = props,
			line     = lineInput[pointInputIdx],
			{ id, parent } = __Node__.getNodeCur(),
			{ input } = parent,
			{ bind } = input[pointInputIdx],
			NodeTar = __Node__.getNodeTar(),
			is
		switch (type) {
			case 'out':
				is = NodeTar && parent.id !== NodeTar.id
				if (is) {
					__Redux__.actions.nodeConnect({
						source: deepCopy(NodeTar),
						target: deepCopy(parent),
						targetIndex: id,
					})
				} else {
					__Redux__.actions.nodeDisconnect({
						target: deepCopy(parent),
						targetIndex: id,
					})
				}
				console.log('4. end point input')
				break
			case 'in':
				is = NodeTar && NodeTar.input && (bind.id !== NodeTar.id && parent.id !== NodeTar.id)
				if (is) {
					__Redux__.actions.nodeConnect({
						source: deepCopy(__Redux__.Config.Nodes[bind.id]),
						target: deepCopy(NodeTar),
						targetIndex: 0,
						unbind: deepCopy(parent),
						unbindIndex: pointInputIdx
					})
				}
				console.log('4. end point output')
				break
			default: break
		}

		line.init()

		this._self.pointInputIdx = -1
		
		__Node__.setNodeCur()
		__Node__.setNodeTar()
	}
	// 拖拽接触
	// PointDragEnter = (e, data) => {
	// 	__Node__.setNodeTar({ type: 'in', ...data })
	// 	console.log('PointEnter', e.target.className)
	// }
	// 拖拽离开
	// PointDragLeave = e => {
	// 	__Node__.setNodeTar()
	// 	console.log('PointLeave', e.target.className)
	// }
}

