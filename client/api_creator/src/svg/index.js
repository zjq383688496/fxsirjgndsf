import React from 'react'
import { types } from '@var'
import Shapes from './common/Shape'

import DragPoint from './DragPoint'

var { Node }  = require('./common/handleNode')
var { InputLine } = require('./common/handleInputLine')

import './index.less'

export default class SvgNode extends React.Component {
	constructor(props) {
		super(props)
		var { data, lines } = props,
			newData = deepCopy(data),
			{ id, layout }  = newData,
			{ x, y }  = layout

		var lines = lines[id] = []

		this.lineInput = lines

		this.state = {
			isMove: false,
			data: newData,
			x,
			y
		}
	}
	componentWillMount() {
		this.Node = new Node(this)
		this.init()
	}

	componentDidMount() {}

	componentWillReceiveProps(props) {
		var { lineInput, state } = this,
			{ data, x, y } = state,
			newData    = deepCopy(props.data),
			{ layout } = newData,
			{ cx, cy } = layout,
			{ input }  = newData
		if (!objEqual(data, newData)) {
			this.setState({ data: newData }, () => {
				lineInput.forEach((_, i) => {
					_.data = newData
					console.log('1. update')
					_.init()
				})
			})
		}
	}

	componentWillUnmount() {
		clearTimeout(this.dragTimeout)
	}
	
	dragTimeout = null
	pointInputIdx = -1		// 当前输入点索引

	// 初始化
	init = () => {
		var { data, view } = this.props,
			{ id }   = data,
			gInClass = `group_input_${id}`

		this.inputGroup = view.group().addClass(gInClass)
		this.inputLines()		// 初始化线段
	}

	// 创建输入线段
	inputLines = () => {
		var { state, inputGroup } = this,
			{ data }  = state,
			{ input } = data

		this.lineInput.splice(0, this.lineInput.length)
		
		if (!input || !input.length) return

		input.map((_, i) => {
			this.lineInput.push(new InputLine(data, i, this, inputGroup))
		})
	}

	// 创建输入线段拖拽物
	inputLinesDrag = () => {
		var { lineInput, props } = this,
			{ data, scale } = props,
			{ input } = data

		return lineInput.map((_, i) => {
			var ipt = input[i],
				{ bind } = ipt
			
			var inputPoint  = <DragPoint key={0} type="out" idx={i} data={data} scale={scale} line={_} lineInput={lineInput} />,
				outputPoint = <DragPoint key={1} type="in"  idx={i} data={data} scale={scale} line={_} lineInput={lineInput} />,
				points = [inputPoint]

			if (bind != null) points.push(outputPoint)

			return points
		})
	}

	createStyle = () => {
		var { data, x, y } = this.state,
			{ r, w, h }    = data.layout
		return {
			top:    y,
			left:   x,
			width:  w || (r * 2),
			height: h || (r * 2),
		}
	}

	render() {
		var { state, props, Node } = this,
			{ data } = state,
			{ conf, id, input } = data,
			{ color = '#f1f1f1' } = conf,
			{ name } = props.data,
			type   = types[name],
			style  = this.createStyle(),
			moveCb = Node.NodeMove,
			endCb  = Node.NodeEnd,
			Shape  = Shapes[type]

		if (!Shape) return null

		var inputsDrag = this.inputLinesDrag()

		return ([
			<div
				key={`${id}_0`}
				className={`node-child`}
				style={style}
				draggable="true"
				onDragStart={e => __Node__.dragStart.call(this, e, Node.NodeStart, data)}
				onDrag={e => __Node__.dragMove.call(this, e, moveCb, false)}
				onDragEnd={e => __Node__.dragEnd.call(this, e, endCb)}
				onDragEnter={e => Node.NodeDragEnter(e, data)}
				onDragLeave={Node.NodeDragLeave}
			><Shape color={color} index={id} data={props.data} /></div>,
			inputsDrag
		])
	}
}
