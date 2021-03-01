import React from 'react'
import Pane from '@comp/Pane'
import Dragline from '@comp/Dragline'
import './index.less'

var styleMap = {
	horizontal: 'width',
	vertical:   'height',
}

export default class Work extends React.Component {
	constructor(props) {
		super(props)
	}
	createStyle = (type, value) => {
		var style = { flex: 'initial' }
		style[styleMap[type]] = `${value}%`
		return style
	}
	createSpace = (data, parent, idx) => {
		var { layout, type, components, value } = data
		var style = {}
		if (parent) style = this.createStyle(parent.type, value)
		var props = {
			idx,
			data,
			components,
			parent
		}
		var _id = cId(layout, idx)
		return (
			<div key={idx} layout={layout} id={_id} className={`ws-block${type? ` ws-${type}`: ''}`} style={style}>
				<Pane {...props} _id={_id}  />
			</div>
		)
	}
	resolve = (space, parent) => {
		if (!space) return this.createSpace(parent, undefined, 0)
		var panesDom = space.map((_, idx) => {
			var { type, components, layout, value, panes } = _
			var style = {}
			if (panes && panes.length) {
				if (idx) style = this.createStyle(parent.type, value)
				var _id = cId(layout, idx)
				return (
					<div key={idx} layout={layout} id={_id} className={`ws-block`} style={style}>
						<div className={`wrap-pane${type? ` ws-${type}`: ''}`}>
							{this.resolve(panes, _)}
							{
								idx
								?
								<Dragline type={parent.type} _id={_id} data={_} prevData={space[idx - 1]} />
								: null
							}
						</div>
					</div>
				)
			} else {
				return this.createSpace(_, parent, idx)
			}
		})
		return panesDom
	}
	render() {
		var { Workspace } = __Redux__.Config
		var panesDom = this.resolve(Workspace.panes, Workspace)
		return (
			<div className="wrap-workspace">
				<div className={`ws-${Workspace.type}`}>
					{panesDom}
				</div>
			</div>
		)
	}
}

function cId(layout, idx) {
	var ran = randomRange(1000, 99999),
		num = pad(ran, 6)
	return `ws_${layout}_${idx}__${num}`
}