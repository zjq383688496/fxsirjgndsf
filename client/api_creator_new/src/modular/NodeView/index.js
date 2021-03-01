import React from 'react'
import './index.less'

import Svg from '@svg'

export default class NodeView extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			nodes: Object.assign({}, __Redux__.Config.Nodes),
			update: 1,
			scale:  1
		}
	}

	NodeLines = {}
	SourceMap = {}

	maxW = 8192		// 最大分辨率 8K
	maxH = 8192		// 最大分辨率 8K

	// SVG初始化
	componentDidMount() {
		var { _SVG_, _VIEW_ } = this.refs
		this.View = SVG(_SVG_)
		debugger
		__Node__.createArrow(this.View)

		this.ergodicNodes()
	}

	componentWillReceiveProps(props) {
		this.SourceMap = {}
		this.ergodicNodes()
	}

	renderNode(node) {
		var { SourceMap } = this,
			{ scale } = this.state,
			{ input } = node

		// 更新来源映射列表
		if (input) {
			input.forEach(({ bind }, i) => {
				if (!bind) return
				var { id } = bind
				if (!SourceMap[id]) SourceMap[id] = {}
				SourceMap[id][node.id] = i
			})
		}

		return (
			<Svg
				key={node.id}
				view={this.View}
				data={node}
				lines={this.NodeLines}
				sourceMap={this.SourceMap}
				scale={scale}
				img={this.refs.img}
			/>
		)
	}

	ergodicNodes = () => {
		var { NodeInfo, Nodes } = __Redux__.Config,
			indexs = Object.keys(Nodes),
			length = indexs.length
		if (!length) return
		this.Nodes = indexs.map(idx => this.renderNode(Nodes[idx]))
		this.setState({ update: 1 })
	}

	viewZoom = num => {
		var { scale } = this.state,
			max = 10,
			stepS = 0.1,
			stepB = 0.2,
			size = (scale <= 0.9 || (scale === 1 && num < 0))? stepS: stepB
		if ((scale === max && num > 0) || (scale === stepB && num < 0)) return
		scale += num * size
		scale = +(scale < stepB? stepB: scale > max? max: scale).toFixed(2)

		this.setState({ scale }, this.ergodicNodes)
		this.renderZoomMessage(scale)
	}

	renderZoomMessage = scale => {
		var { _ZOOM_ } = this.refs
		_ZOOM_.className = ''
	}

	scrollFunc = _throttle(e => {
		var { wheelDeltaY } = e.nativeEvent
		this.viewZoom(wheelDeltaY < 0? 1: -1)
	})

	render() {
		var { scale } = this.state,
			style = { zoom: scale }
		return (
			<div className="mv-node-view" onWheel={this.scrollFunc} ref="_VIEW_">
				<div className="nv-view-parent">
					<div className="nv-view-zoom" style={style} ref="_SVG_">
						{this.Nodes}
					</div>
				</div>
				<div className="mv-node-message" ref="_ZOOM_"></div>
			</div>
		)
	}
}
				// <div className="nv-zoom">
				// 	<a onClick={e => this.viewZoom(1)}>+</a>
				// 	<span>{scale * 100}%</span>
				// 	<a onClick={e => this.viewZoom(-1)}>-</a>
				// </div>