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
			var val = idx? -1: 1
			adja = parent.panes[idx + val]
			adja.value += data.value
			parent.panes.splice(idx, 1)
		} else {
			Object.keys(parent).map(_ => delete parent[_])
		}
		actions.updateWorkspace(Workspace)
	}
	contextmenu = e => {
		e.preventDefault()
		var { pageX, pageY } = e,
			{ actions, Config } = __Redux__,
			{ data } = this.props
		actions.contextMenuState({ type: 'pane', state: true, pageX, pageY }, data, this)
	}
	render() {
		var { _id, components, data, idx, parent = {} } = this.props
		var { max } = this.state
		var { layout = 0, panes = [], type } = parent
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
					<Dragline type={type} _id={_id} data={data} prevData={panes[idx - 1]} />
					: null
				}
			</div>
		)
	}
}