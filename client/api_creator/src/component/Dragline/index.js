import React from 'react'
import './index.less'

export default class Dragline extends React.Component {
	constructor(props) {
		super(props)
		var { data, type, prevData } = props
		this.initVal     = data.value || 0
		this.prevInitVal = prevData.value || 0
		this._axis       = type === 'vertical'? 'Y': 'X'
		this._position   = type === 'vertical'? 'height': 'width'
		this._unit       = type === 'vertical'? 'vh': 'vw'
		this.nowVal      = data.value || 0
		this.prevVal     = prevData.value || 0
	}
	componentWillUpdate({ data, prevData }) {
		if (this.initVal     != data.value)     this.initVal     = data.value     || 0
		if (this.prevInitVal != prevData.value) this.prevInitVal = prevData.value || 0
	}
	init  = 0
	state = {
		isMove: false
	}
	mousedown = e => {
		this.setState({ isMove: true })
		this.init = e[`page${this._axis}`]
	}
	mousemove = e => {
		var { $dom, $prevDom, _axis, _position, _unit, init, initVal, prevInitVal } = this
		var diff    = e[`page${_axis}`] - init,
			diffV   = this.px2v(diff, _axis),
			nowV    = (initVal - diffV).toFixed(2),
			prevV   = (prevInitVal + diffV).toFixed(2)

		$dom.style[_position]     = `${nowV}${_unit}`
		$prevDom.style[_position] = `${prevV}${_unit}`

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
		return px / document.body[`client${axis === 'Y'? 'Height': 'Width'}`] * 100
	}
	getDom = e => {
		if (!e) return
		var $dom = this.$dom = e.parentNode.parentNode
		this.$prevDom = $dom.previousElementSibling
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
