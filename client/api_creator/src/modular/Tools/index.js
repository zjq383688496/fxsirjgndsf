import React from 'react'

import * as menu from './menu'
import './index.less'

export default class Tools extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			switchKey: ''
		}
	}

	componentDidMount() {}

	clearCache = () => {
		localStorage.removeItem('temporaryData')
	}

	reload = () => {
		location.reload()
	}

	clearReload = () => {
		localStorage.removeItem('temporaryData')
		location.reload()
	}

	// 菜单开关
	menuSwitch = key => {
		var { switchKey } = this.state
		this.setState({ switchKey: switchKey === key? '': key })
	}

	// 组件调用
	addNode = key => {
		__Tools__.addNode(key)
		this.closeMenu()
	}

	// 关闭菜单
	closeMenu = () => {
		this.setState({ switchKey: '' })
	}

	renderMenuChild = (children, pKey) => {
		if (!children || !children.length) return null
		return children.map(({ name, key, icon }, i) => <a key={`${pKey}-${i}`} onClick={e => this.addNode(key)}>{name}</a>)
	}

	renderMenu = () => {
		var { switchKey } = this.state,
			{ MENU } = menu
		return MENU.map(({ name, key, icon, children }, i) => {
			var child = this.renderMenuChild(children, i)
			return (
				<dl className={`mv-tools${switchKey === key? ' s-active': ''}`} key={i}>
					<dt className="mv-tools-dt" onClick={e => this.menuSwitch(key)}>{name}</dt>
					<dd className={`mv-tools-dd`}>{child}</dd>
				</dl>
			)
		})
	}

	render() {
		var { switchKey } = this.state,
			menuDom = this.renderMenu()
		return (
			<div className="mv-tools-view">
				{ menuDom }
				{
					switchKey
					?
					<div className="mv-tools-mask" onClick={this.closeMenu}></div>
					: null
				}
			</div>
		)
	}
}
				// <a onClick={__Tools__.addNode} data-key={'source'}>source</a>
				// <a onClick={__Tools__.addNode} data-key={'dot'}>dot</a>
				// <a onClick={__Tools__.addNode} data-key={'input'}>input</a>
				// <a onClick={__Tools__.addNode} data-key={'outer'}>outer</a>
				// <a onClick={this.clearCache}>请空缓存</a>
				// <a onClick={this.reload}>刷新</a>
				// <a onClick={this.clearReload}>清空刷新</a>