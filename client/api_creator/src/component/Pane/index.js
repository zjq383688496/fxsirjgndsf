import React from 'react'
import Dragline from '@comp/Dragline'
import Tab      from '@comp/Tab'
import './index.less'

export default class Pane extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			max: false
		}
	}
	close = () => {
		var { components, data, parent, idx } = this.props,
			{ actions, Config } = __Redux__
		var { Workspace } = Config
		var { layout, panes } = parent
		if (layout === 0 && panes.length < 2) return
		var adja
		if (panes.length > 1) {
			if (idx) {
				adja = parent.panes[idx - 1]
			} else {
				adja = parent.panes[idx + 1]
			}
			adja.value += data.value
			parent.panes.splice(idx, 1)
		} else {
			Object.keys(parent).map(_ => delete parent[_])
		}
		actions.updateWorkspace(Workspace)
	}
	getValue = type => {
		var { paneEle } = this.refs
		var val = paneEle[`offset${type}`] / document.body[`client${type}`] * 100
		return val
	}
	contextmenu = e => {
		e.preventDefault()
		var { pageX, pageY } = e,
			{ actions, Config } = __Redux__,
			{ data } = this.props
		actions.contextMenuState({ type: 'pane', state: true, pageX, pageY }, data, this)
	}
	render() {
		var { components, data, idx, parent = {} } = this.props
		var { max } = this.state
		var { layout = 0, panes = [] } = parent
		var menuBtn = (<div className="wp-menu-btn ic-menu" onClick={this.contextmenu}></div>)
		return (
			<div className={`wrap-pane${max? ' wp-max': ''}`} ref="paneEle" onContextMenu={this.contextmenu}>
				<Tab
					prevElement={menuBtn}
					data={data}
				/>
				{
					idx
					?
					<Dragline type={parent.type} data={data} />
					: null
				}
			</div>
		)
	}
}