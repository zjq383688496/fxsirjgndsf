import React from 'react'
import { types } from '@var'
import Shapes from './Shape'

import './index.less'

export default class SvgNode extends React.Component {
	constructor(props) {
		super(props)
		var { data } = props,
			{ x, y } = data.layout,
			{ Scale }  = __Redux__.Config.NodeInfo
		this.state = {
			isMove: false,
			data:   data,
			Scale,
			x: x * Scale,
			y: y * Scale
		}
	}
	componentWillMount() {
		this.init()
	}

	componentDidMount() {}

	componentWillReceiveProps(props) {}

	componentWillUnmount() {
		clearTimeout(this.dragTimeout)
	}

	// 当前节点
	nodeCur = {
		index: -1,	// 索引值
		sX: 0,		// 开始坐标X
		sY: 0,		// 开始坐标Y
	}
	// 目标节点
	nodeTar = {
		index: -1,	// 索引值
	}
	
	dragTimeout = null
	lineInput = []			// 输入线段
	pointInputIdx = -1		// 当前输入点索引

	// 初始化
	init = () => {
		var { data, view } = this.props,
			{ id } = data
		var gInClass  = `group_input_${id}`,
			gOutClass = `group_output_${id}`

		this.inputGroup  = view.group().addClass(gInClass)
		this.outputGroup = view.group().addClass(gOutClass)

		this.inputLines()		// 创建线段
	}

	// 创建输入线段
	inputLines = () => {
		var { state, inputGroup, lineInput } = this,
			{ data }  = state,
			{ input } = data

		if (!input || !input.length) return

		input.map((_, i) => {
			lineInput.push(new InputLine(data, i, this, inputGroup))
		})
	}

	// 创建输入线段拖拽物
	inputLinesDrag = () => {
		var { lineInput, props } = this,
			{ idx } = props,
			moveCb = this.PointMove,
			endCb  = this.PointEnd

		return lineInput.map((_, i) => {
			var { startX, startY } = _.state,
				x = startX - 20,
				y = startY - 20,
				style = { top: y, left: x }

			return (
				<div
					key={`${idx}_${i}_input`}
					className="drag-point"
					style={{...style}}
					draggable="true"
					onDragStart={e => {
						this.pointInputIdx = i
						__Node__.dragStart.call(this, e, null)
					}}
					onDrag={e => __Node__.dragMove.call(this, e, moveCb, false)}
					onDragEnd={e => __Node__.dragEnd.call(this, e, endCb)}
				></div>
			)
		})
	}
	
	// 节点拖拽开始
	NodeStart = node => {
		this.dragTimeout = setTimeout(() => {
			$(node).addClass('s-active')
			clearTimeout(this.dragTimeout)
		}, 16)
	}
	// 节点拖拽中
	NodeMove = (x, y, node) => {
		var { lineInput } = this
		lineInput.forEach(_ => _.init(x, y))
	}
	// 节点拖拽结束
	NodeEnd = (x, y, node) => {
		var { Scale } = this.state

		node.style.top  = `${y}px`
		node.style.left = `${x}px`
		
		this.setState({ x, y })
		$(node).removeClass('s-active')
	}
	// 
	NodeDragEnter = e => {
		console.log('Enter', e.target.className)
	}
	NodeDragLeave = e => {
		console.log('Leave', e.target.className)
	}

	// 线段辅点移动中
	PointMove = (x, y, node) => {
		var { lineInput, props, pointInputIdx } = this,
			{ w, h, r } = props.data.layout,
			line = lineInput[pointInputIdx]
		x = x + (r || w / 2)
		y = y + (r || h / 2)

		line.init(null, null, x, y)
	}

	// 线段辅点移动结束
	PointEnd = (x, y, node) => {
		var { lineInput, props, pointInputIdx } = this,
			line = lineInput[pointInputIdx]

		line.init()

		var { startX, startY } = line.state

		node.style.top  = `${startY - 20}px`
		node.style.left = `${startX - 20}px`

		this.pointInputIdx = -1
	}

	createStyle = () => {
		var { data, x, y } = this.state,
			{ r, w, h }    = data.layout,
			{ Scale } = __Redux__.Config.NodeInfo
		return {
			top:    y * Scale,
			left:   x * Scale,
			width:  (w || (r * 2)) * Scale,
			height: (h || (r * 2)) * Scale,
		}
	}

	getMoveCb = () => {
		if (!this.moveNode) return null
		var cls = this.moveNode.classList[0]
		return this[moveMap[cls]]
	}

	getEndCb = () => {
		if (!this.moveNode) return null
		var cls = this.moveNode.classList[0]
		return this[endMap[cls]]
	}

	render() {
		var { state, props } = this,
			{ data, isMove } = state,
			{ conf, id, input } = data,
			{ color = '#f1f1f1' } = conf,
			{ name } = props.data,
			type   = types[name],
			style  = this.createStyle(),
			moveCb = this.NodeMove,
			endCb  = this.NodeEnd,
			Shape  = Shapes[type]

		if (!Shape) return null

		var inputsDrag = this.inputLinesDrag()

		return ([
			<div
				key={`${id}_0`}
				className={`node-child`}
				style={style}
				draggable="true"
				onDragStart={e => __Node__.dragStart.call(this, e, this.NodeStart)}
				onDrag={e => __Node__.dragMove.call(this, e, moveCb, false)}
				onDragEnd={e => __Node__.dragEnd.call(this, e, endCb)}
				onDragEnter={this.NodeDragEnter}
				onDragLeave={this.NodeDragLeave}
			><Shape color={color} index={id} data={props.data} /></div>,
			inputsDrag
		])
	}
}

class InputLine {
	constructor(data, index, parent, group) {
		Object.assign(this, { data, index, parent, group })

		this.state = {
			isMove: false,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
		}

		this.init()
	}
	// 初始化
	// targetX: 目标点 X
	// targetY: 目标点 Y
	// startX: 起始点 X
	// startY: 起始点 Y
	init = (targetX, targetY, startX, startY) => {
		var { data, index, parent } = this,
			{ props, state }  = parent,
			{ input, layout } = props.data,
			length = input.length,
			{ w, h, r } = layout,
			x  = targetX || state.x,
			y  = targetY || state.y,
			cx = r? x + r: x + w / 2,				// 目标中点 X
			cy = r? y + r: y + h / 2,				// 目标中点 Y
			sx = (startX + 20) || (cx + (-length * 40 / 2) + index * 40),		// 线段默认开始点 X
			sy = (startY + 20) || (cy - 40	)								// 线段默认开始点 Y

		Object.assign(this.state, {
			startX: sx,
			startY: sy,
			endX:   cx,
			endY:   cy,
		})

		this.draw()
	}
	draw = () => {
		var { group, parent } = this,
			{ Scale } = parent.state,
			{ startX, startY, endX, endY } = this.state
		if (!this.line) {
			this.line = group.path(`M ${startX * Scale},${startY * Scale} L ${endX * Scale},${endY * Scale}`).fill('none').stroke({ width: 2, color: '#000' })
		} else {
			this.line.plot(`M ${startX * Scale},${startY * Scale} L ${endX * Scale},${endY * Scale}`)
		}
	}
}
