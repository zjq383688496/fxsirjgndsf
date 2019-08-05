import React from 'react'
import { types } from '@var'
import Shapes from './common/Shape'
var { Node }  = require('./common/handleNode')
var { Point } = require('./common/handlePoint')
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
		this.Node  = new Node(this)
		this.Point = new Point(this)
		this.init()
	}

	componentDidMount() {}

	componentWillReceiveProps(props) {
		var { data }  = this.state,
			newData   = props.data,
			{ input } = newData,
			{ lineInput } = this
		if (!objEqual(data, newData)) {
			console.log(data, newData, props.lines)
			this.setState({ data: newData }, () => {
				lineInput.forEach((_, i) => {
					_._data = input[i]
					_.init()
				})
			})
		}
	}

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
			this.lineInput.push(new InputLine(data, i, this, inputGroup, _))
		})
	}

	// 创建输入线段拖拽物
	inputLinesDrag = () => {
		var { lineInput, props, Point } = this,
			{ data, idx } = props,
			{ input } = data,
			moveCb = Point.PointMove,
			endCb  = Point.PointEnd

		return lineInput.map((_, i) => {
			var ipt = input[i],
				{ bind } = ipt

			var { startX, startY } = _.state,
				x = startX - 20,
				y = startY - 20,
				style = { top: y, left: x },
				item  = { id: i, data: _, parent: props.data },
				{ bind } = input[i]
			
			return (
				<div
					key={`${idx}_${i}_input`}
					className="drag-point"
					style={{...style}}
					draggable="true"
					onDragStart={e => __Node__.dragStart.call(this, e, Point.PointStart, item)}
					onDrag={e => __Node__.dragMove.call(this, e, moveCb, false)}
					onDragEnd={e => __Node__.dragEnd.call(this, e, endCb)}
					onDragEnter={e => Point.PointDragEnter(e, item)}
					onDragLeave={Point.PointDragLeave}
				></div>
			)
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
