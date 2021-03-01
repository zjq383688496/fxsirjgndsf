import React from 'react'
import './index.less'

var axisMap = {
	horizontal: 'X',
	vertical:   'Y',
}
var styleMap = {
	horizontal: 'width',
	vertical:   'height',
}
var offsetMap = {
	X: 'offsetWidth',
	Y: 'offsetHeight'
}

export default class Dragline extends React.Component {
	constructor(props) {
		super(props)
		var { index, data, type, prevData } = props
		this.initVal     = this.nowVal  = data.value     || 0
		this.prevInitVal = this.prevVal = prevData.value || 0
		this._axis       = axisMap[type]
		this._position   = styleMap[type]
		this._unit       = '%'
		this.minValue    = 0
		this.maxValue    = 0
	}
	componentWillUpdate({ data, prevData }) {
		if (this.initVal     != data.value)     this.initVal     = data.value     || 0
		if (this.prevInitVal != prevData.value) this.prevInitVal = prevData.value || 0
	}
	init = 0
	state = {
		isMove: false
	}
	mousedown = e => {
		var { data, prevData } = this.props
		this.minValue = -prevData.value
		this.maxValue = data.value
		this.getDom()
		this.setState({ isMove: true })
		this.init = e[`page${this._axis}`]
	}
	mousemove = e => {
		var { $dom, $prevDom, _axis, _position, _unit, init, initVal, prevInitVal, minValue = 0, maxValue = 0 } = this
		var diff    = e[`page${_axis}`] - init,
			diffV   = this.px2v(diff, _axis)

		diffV = diffV < minValue? minValue: diffV > maxValue? maxValue: diffV

		var nowV    = (initVal - diffV).toFixed(2),
			prevV   = (prevInitVal + diffV).toFixed(2)

		$dom.style[_position]     = `${nowV}%`
		$prevDom.style[_position] = `${prevV}%`

		this.nowVal  = parseFloat(nowV)
		this.prevVal = parseFloat(prevV)
	}
	mouseup = e => {
		this.setState({ isMove: false })
		var { actions, Config } = __Redux__,
			{ nowVal, prevVal, props } = this,
			{ data, prevData } = props
		
		data.value     = nowVal
		prevData.value = prevVal
		this.init      = 0

		actions.updateWorkspace(Config.Workspace)
	}
	px2v = (px, axis) => {
		var { $parent } = this
		var scale = px / $parent[offsetMap[axis]] * 100
		return scale
		// return px / document.body[`client${axis === 'Y'? 'Height': 'Width'}`] * 100
	}
	getDom = e => {
		var { _id } = this.props
		var $dom = this.$dom = document.querySelector(`#${_id}`)
		this.$prevDom = $dom.previousElementSibling
		this.$parent  = $dom.parentElement
	}
	render() {
		var { type } = this.props,
			{ isMove } = this.state
		if (!type) return null
		return (
			<div className="dragline" ref={this.getDom}>
				<div className={`dl${type? ` dl-${type}`: ''}`} onMouseDown={this.mousedown}></div>
					<div
						style={{ display: isMove? 'block': 'none' }}
						className="dl-mask"
						onMouseMove={this.mousemove}
						onMouseUp={this.mouseup}
					></div>
			</div>
		)
	}
}
