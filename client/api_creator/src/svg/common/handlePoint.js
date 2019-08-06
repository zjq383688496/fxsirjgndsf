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
	PointMove = (x, y, node) => {
		var { lineInput, props, pointInputIdx } = this._self,
			{ w, h, r } = props.data.layout,
			line = lineInput[pointInputIdx]
		x = x + (r || w / 2)
		y = y + (r || h / 2)

		line.init(null, null, x + 20, y + 20)
	}
	// 拖拽结束
	PointEnd = (x, y, node) => {
		var { lineInput, props, pointInputIdx } = this._self,
			line    = lineInput[pointInputIdx],
			{ id, parent } = __Node__.getNodeCur(),
			NodeTar = __Node__.getNodeTar(),
			is      = pointAllowTypeMap[NodeTar.type]

		line.init()

		if (is) {
			delete NodeTar.type
			__Redux__.actions.updateNodeInput({
				source: deepCopy(NodeTar),
				inputIndex: id,
				target: deepCopy(parent),
			})
		} else {
			
			// var { startX, startY } = line.state

			// node.style.top  = `${startY - 20}px`
			// node.style.left = `${startX - 20}px`

			
		}
		this._self.pointInputIdx = -1

		// $(node).show()
		
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

