import React from 'react'
import './index.less'

export default class Dragline extends React.Component {
	constructor(props) {
		super(props)
		var { data, type } = props
		this.initVal   = data.value || 0
		this._axis     = type === 'vertical'? 'Y': 'X'
		this._position = type === 'vertical'? 'height': 'width'
		this._unit     = type === 'vertical'? 'vh': 'vw'
	}
	componentWillUpdate({ data }) {
		if (this.initVal != data.value) {
			this.initVal = data.value || 0
		}
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
		var { dom } = this.props
		var diff = e[`page${this._axis}`] - this.init
		var v = (this.initVal - this.px2v(diff, this._axis)).toFixed(2)
		this.$dom.style[this._position] = `${v}${this._unit}`
	}
	mouseup = e => {
		this.setState({ isMove: false })
		var { actions, Config } = __Redux__,
			{ data } = this.props,
			diff = e[`page${this._axis}`] - this.init,
			v = (this.initVal - this.px2v(diff, this._axis)).toFixed(2)
		data.value = parseFloat(v)
		this.init = 0
		actions.updateWorkspace(Config.Workspace)
	}
	px2v = (px, axis) => {
		return px / document.body[`client${axis === 'Y'? 'Height': 'Width'}`] * 100
	}
	getDom = e => {
		if (!e) return
		this.$dom = e.parentNode.parentNode
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
