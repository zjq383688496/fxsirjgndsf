import React from 'react'
import './index.less'

import { types } from '@var'
import svg from '@svg'

export default class Rect extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isMove: false,
			data: props.data
		}
	}
	componentWillMount() {}

	componentWillReceiveProps(props) {}

	componentWillUnmount() {}

	createLine = () => {
	}
	
	handleEnd = (x, y) => {
		var { data }   = this.state,
			{ layout } = data
		layout.x = x
		layout.y = y
		__Redux__.actions.updateNode(data)
	}

	createStyle = () => {
		var { layout, conf } = this.state.data,
			{ x, y, w, h } = layout,
			{ color = '#f1f1f1' } = conf,
			{ Scale }  = __Redux__.Config.NodeInfo
		return {
			top:    y * Scale,
			left:   x * Scale,
			width:  w * Scale,
			height: h * Scale,
			backgroundColor: color
		}
	}

	render() {
		var { isMove, data } = this.state,
			style = this.createStyle()
		return [
			<div
				key={0}
				className={`node-rect${isMove? ' s-active': ''}`}
				style={style}
				onMouseDown={e => __Node__.handleDown.call(this, e)}
				data-name={data.name}
			></div>
			,
			isMove
			?
			<div
				key={1}
				className="node-mask"
				onMouseMove={e => __Node__.handleMove.call(this, e, this.handleMove)}
				onMouseUp={e => __Node__.handleUp.call(this, e, this.handleEnd)}
			>
			</div>
			: null
		]
	}
}