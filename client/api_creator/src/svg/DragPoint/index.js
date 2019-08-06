import React from 'react'
import './index.less'

var { Point } = require('../common/handlePoint')

export default class DragPoint extends React.Component {
	constructor(props) {
		super(props)
		var { data } = props,
			newData = deepCopy(data)

		this.state = {
			data: newData
		}
	}
	componentWillMount() {
		this.lineInput = this.props.lineInput
		this.Point = new Point(this)
	}

	componentDidMount() {}

	componentWillReceiveProps(props) {
		var { data } = this.state,
			newData  = props.data
		if (!objEqual(data, newData)) {
			setTimeout(() => {
				this.setState({ data: newData })
			})
		}
	}

	componentWillUnmount() {}

	getSidePos = (layout, sourcePos) => {
		var { r, h, w } = layout
		if (w && h) return __Node__.getPointRect(sourcePos, layout)
		else if (r) {
			if (r < 20) {
				layout = deepCopy(layout)
				layout.r = 20
			}
			return __Node__.getPointCircle(sourcePos, layout)
		}
	}

	createStyle = ({ startX, startY, endX, endY }, type) => {
		var { data, idx } = this.props,
			{ input, layout } = data,
			{ bind } = input[idx],
			point, x, y, style

		if (bind === null) {
			x = startX - 20
			y = startY - 20
		} else {
			if (type === 'in') {
				var { id, index } = bind,
					node = __Redux__.Config.Nodes[id]
				point = this.getSidePos(node.layout, { startX: endX, startY: endY })
			} else {
				point = this.getSidePos(layout, { startX, startY })
			}
			x = point.x - 20
			y = point.y - 20
		}
		style = { top: y, left: x }

		return style
	}

	render() {
		var { props, Point } = this,
			{ data, idx, line, type } = props

		var { id } = data,
			key    = `${idx}_${id}_${type}put`,
			item   = { id: idx, data: line, parent: data },
			style  = this.createStyle(line.state, type)

		return (
			<div
				key={key}
				className="drag-point"
				data-type={type}
				style={style}
				draggable="true"
				onDragStart={e => __Node__.dragStart.call(this, e, Point.PointStart, item)}
				onDrag={e => __Node__.dragMove.call(this, e, Point.PointMove, false)}
				onDragEnd={e => __Node__.dragEnd.call(this, e, Point.PointEnd)}
				onDragEnter={e => Point.PointDragEnter(e, item)}
				onDragLeave={Point.PointDragLeave}
			></div>
		)
	}
}