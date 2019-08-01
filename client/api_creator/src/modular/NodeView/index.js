import React from 'react'
import './index.less'

import Svg from '@svg'

export default class NodeView extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			nodes: Object.assign({}, __Redux__.Config.Nodes),
			update: 1,
			scale: 1
		}
	}

	NodeLines = {}

	// SVG初始化
	componentDidMount() {
		var { _SVG_ } = this.refs
		this.View = SVG(_SVG_)
		__Node__.createArrow(this.View)
		this.ergodicNodes()
	}

	componentWillReceiveProps(props) {
		this.ergodicNodes()
	}

	renderNode(node, idx) {

		return (
			<Svg
				key={idx}
				view={this.View}
				data={node}
				lines={this.NodeLines}
				idx={idx}
				img={this.refs.img}
			/>
		)
	}

	ergodicNodes = () => {
		var { NodeInfo, Nodes } = __Redux__.Config,
			indexs = Object.keys(Nodes),
			length = indexs.length
		if (!length) return
		this.Nodes = indexs.map(idx => this.renderNode(Nodes[idx], ~~idx))
		this.setState({ update: 1 })
	}

	viewZoom = num => {
		var { scale } = this.state,
			size = (scale <= 0.8 || (scale === 1 && num < 0))? 0.2: 0.5
		scale += num * size
		scale = +(scale < 0.2? 0.2: scale > 3? 3: scale).toFixed(2)

		this.setState({ scale })
	}

	render() {
		var { scale } = this.state
		return (
			<div className="mv-node-view">
				<div className="nv-view-parent">
					<div className="nv-view-zoom" ref="_SVG_">
						{this.Nodes}
					</div>
				</div>
				<div className="nv-zoom">
					<a onClick={e => this.viewZoom(1)}>+</a>
					<span>{scale * 100}%</span>
					<a onClick={e => this.viewZoom(-1)}>-</a>
				</div>
			</div>
		)
	}
}