import React from 'react'
import './index.less'

import { types } from '@var'
import svg from '@svg'

export default class NodeView extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			nodes: Object.assign({}, __Redux__.Config.Nodes)
		}
	}

	Nodes = null

	// SVG初始化
	componentDidMount() {
		var { _SVG_ } = this.refs
		this.View = SVG(_SVG_)
		this.ergodicNodes()
	}

	componentWillReceiveProps(props) {
		this.ergodicNodes()
	}

	renderNode(node, idx) {
		var { name } = node,
			type = types[name],
			Render = svg[`${type}`]
		if (!Render) return
		return (<Render key={idx} view={this.View} data={node} idx={idx} />)
	}

	render_rect = (node, idx) => {
		var { props, Nodes, View } = this,
			{ x, y } = node.layout
		var rect = Nodes[idx] = View.rect(80, 40).move(x, y).fill('rgba(0, 0, 0, .5)')
		rect.draggable()
	}

	ergodicNodes = () => {
		var { NodeInfo, Nodes } = __Redux__.Config,
			indexs = Object.keys(Nodes),
			length = indexs.length
		if (!length) return
		this.Nodes = indexs.map(idx => this.renderNode(Nodes[idx], ~~idx))
	}

	render() {
		return (
			<div className="mv-node-view" ref="_SVG_">{this.Nodes}</div>
		)
	}
}