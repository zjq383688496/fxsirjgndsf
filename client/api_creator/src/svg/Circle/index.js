import React from 'react'
import './index.less'

import { types } from '@var'
import svg from '@svg'

export default class Circle extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isMove: false,
			data: props.data,
			Scale: __Redux__.Config.NodeInfo.Scale
		}
	}
	componentWillMount() {
		this.init()
	}

	componentDidMount() {
	}

	componentWillReceiveProps(props) {}

	componentWillUnmount() {}

	line_input = []

	init = () => {
		var { input, ouput } = this.state.data
		if (input) {
			this.createInput()
			this.createInputNodes(input)
		}
	}

	createInputNodes = input => {
		var { id } = this.state.data,
			{ Scale } = this.state
		this.nodes = input.map(({ bind }, i) => {
			if (bind) return null
			var { sx, sy, ex, ey } = this.line_input[i].cood,
				x = (sx - 20) * Scale,
				y = (sy - 20) * Scale,
				style = { top:  y, left: x },
				ipt = this.line_input[i]
			return (
				<div
					key={`${id}_3_${i}`}
					className="drag-point"
					style={style}
					onMouseDown={e => __Node__.handleDown.call(this, e, ipt.drag, () => this.dragDown(i))}
					ref={e => {if(e) ipt.drag = e}}
				>
				</div>
			)
		})
	}

	createInput = (x, y) => {
		var { layout, input } = this.state.data,
			{ r } = layout,
			x  = x || layout.x,
			y  = y || layout.y,
			cx = x + r,
			cy = y + r,
			len = input.length,
			sp  = 40,
			ix  = cx + (-len * sp / 2)
		var xs  = input.map((_, i) => ix + i * sp),
			yy  = cy - 40
		input.forEach((_, i) => this.cIpt(i, input[_], xs[i], yy, { cx, cy, r }))
	}
	cIpt = (idx, da, x, y, { cx, cy, r }) => {
		var { view } = this.props,
			line = this.line_input[idx],
			pos  = __Node__.getPointCircle({ sx: x, sy: y }, { cx, cy, r }),
			cood = { sx: x, sy: y, ex: pos.x, ey: pos.y },
			{ Scale } = __Redux__.Config.NodeInfo
		if (!line) {
			line = this.line_input[idx] = {
				path:  view.path(`M ${x * Scale},${y * Scale} L ${pos.x * Scale},${pos.y * Scale}`).fill('none').stroke({ width: 2, color: '#000' }),
				arrow: view.marker(10, 4,  __Node__.arrow),
				cood
			}
			line.path.marker('end', line.arrow)
		} else {
			line.path.plot(`M ${x * Scale},${y * Scale} L ${pos.x * Scale},${pos.y * Scale}`)
			line.cood = cood
			line.drag.style.top  = `${(y - 20) * Scale}px`
			line.drag.style.left = `${(x - 20) * Scale}px`
		}
	}
	
	dragDown = idx => {
		this.moveIndex = idx
	}
	handleMove = (x, y, node) => {
		var [ cls ] = node.classList,
			{ data, Scale } = this.state
		if (cls === 'node-circle') this.createInput(x, y)
		else {
			var { path } = this.line_input[this.moveIndex],
				sx  = (x + 20) * Scale,
				sy  = (y + 20) * Scale,
				{ x, y, r } = data.layout,
				pos = __Node__.getPointCircle({ sx, sy }, { cx: x + r, cy: y + r, r })
			path.plot(`M ${sx},${sy} L ${pos.x * Scale},${pos.y * Scale}`)
		}
	}
	handleEnd = (x, y, node) => {
		var { data }   = this.state,
			{ layout } = data,
			[ cls ] = node.classList
		if (cls === 'node-circle') {
			layout.x = x
			layout.y = y
			__Redux__.actions.updateNode(data)
		}
		this.moveIndex = -1
	}

	createStyle = () => {
		var { layout, conf } = this.state.data,
			{ x, y, r } = layout,
			{ color = '#f1f1f1' } = conf,
			{ Scale }  = __Redux__.Config.NodeInfo
		return {
			top:    y * Scale,
			left:   x * Scale,
			width:  r * 2 * Scale,
			height: r * 2 * Scale,
			backgroundColor: color
		}
	}

	render() {
		var { data, isMove } = this.state,
			{ id, input } = data,
			style = this.createStyle()

		return ([
			<div
				key={`${id}_0`}
				className={`node-circle${isMove? ' s-active': ''}`}
				style={style}
				onMouseDown={e => __Node__.handleDown.call(this, e, this.refs.node)}
				ref="node"
			></div>,
			isMove
			?
			<div
				key={`${id}_1`}
				className="node-mask"
				onMouseMove={e => __Node__.handleMove.call(this, e, this.moveNode, this.handleMove)}
				onMouseUp={e => __Node__.handleUp.call(this, e, this.moveNode, this.handleEnd)}
			></div>
			: null,
			this.nodes,
			<div key={`${id}_3`} className="ouput-drag">
			</div>
		])
	}
}