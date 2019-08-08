/* 辅点相关 */
var pointAllowTypeMap = { node: 1 }

export class Point {
	constructor(props) {
		this._self = props
	}
	// 拖拽开始
	PointStart = (node, data) => {
		var _self = this._self
		_self.pointInputIdx = data.id
		__Node__.setNodeCur({ type: 'input', ...data })
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
				console.log('3. move point input')
				line.init(x + 5, y + 5, null, null, '#fff')
				break
			case 'in':
				console.log('3. move point output')
				line.init(null, null, x + 5, y + 5)
				break
			default:
				break
		}
	}
	// 拖拽结束
	PointEnd = (x, y, node) => {
		var { lineInput, props, pointInputIdx } = this._self,
			{ type } = props,
			line     = lineInput[pointInputIdx],
			{ id, parent } = __Node__.getNodeCur(),
			NodeTar = __Node__.getNodeTar(),
			is      = pointAllowTypeMap[NodeTar.type] && parent.id !== NodeTar.id

		line.init()

		if (is) {
			delete NodeTar.type
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
		this._self.pointInputIdx = -1
		
		__Node__.setNodeCur()
		__Node__.setNodeTar()
	}
	// 拖拽接触
	PointDragEnter = (e, data) => {
		__Node__.setNodeTar({ type: 'input', ...data })
		// console.log('PointEnter', e.target.className)
	}
	// 拖拽离开
	PointDragLeave = e => {
		__Node__.setNodeTar()
		// console.log('PointLeave', e.target.className)
	}
}

