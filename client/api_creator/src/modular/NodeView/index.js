import React from 'react'
import './index.less'

import Svg from '@svg'

import iconDrag from 'assets/icons/icon-drag.gif'

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
			type = types[name]
		return (
			<Svg
				key={idx}
				view={this.View}
				data={node}
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
	}

	render() {
		return ([
			<div key={0} className="mv-node-view" ref="_SVG_">{this.Nodes}</div>,
			<img key={1} src={iconDrag} ref={e => { __Node__.updateIconDrag(e) }} />
		])
	}
}