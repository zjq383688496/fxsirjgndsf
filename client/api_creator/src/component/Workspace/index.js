import React from 'react'
import Pane from '@comp/Pane'
import Dragline from '@comp/Dragline'
import './index.less'

export default class Work extends React.Component {
	constructor(props) {
		super(props)
	}
	createStyle = (type, value) => {
		var style = { flex: 'initial' }
		if (type === 'horizontal') style.width = `${value}vw`
		else style.height = `${value}vh`
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
		return (
			<div key={idx} layout={layout} className={`ws-block${type? ` ws-${type}`: ''}`} style={style}>
				<Pane {...props} />
			</div>
		)
	}
	resolve = (space, parent) => {
		if (!space) {
			return this.createSpace(parent, undefined, 0)
		}
		var panesDom = space.map((_, idx) => {
			var { type, components, layout, value, panes } = _
			var style = {}
			if (panes && panes.length) {
				if (idx) style = this.createStyle(parent.type, value)
				return (
					<div key={idx} layout={layout} className={`ws-block`} style={style}>
						<div className={`wrap-pane${type? ` ws-${type}`: ''}`}>
							{this.resolve(panes, _)}
							{
								idx
								?
								<Dragline type={parent.type} data={_} />
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