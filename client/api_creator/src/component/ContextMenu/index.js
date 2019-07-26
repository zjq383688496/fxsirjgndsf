import React from 'react'
import './index.less'

export default class ContextMenu extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillUpdate(props) {
		var { Menu = {} } = window.__Redux__.Config,
			{ type } = Menu
		if (!type) return
		this._Menu_ = window.__Menu__[type] || {}
	}
	height = 0
	_Menu_ = {}
	close = () => {
		var { actions } = window.__Redux__
		this.height = 0
		actions.contextMenuState({ state: false, pageX: 0, pageY: 0 }, null, null)
	}
	renderList = type => {
		var menu = [...window.__menu__[type]]
		var list = menu.map(({ key, data }, i) => {
			var fn = this[`render_${key}`]
			this.height += data.length
			if (!fn || !data.length) return null
			return (
				<ul className="cm-ul" key={i}>{ fn(data, key) }</ul>
			)
		})
		return list
	}
	render_split = (data, type) => {
		return data.map(({ key, icon, name }, i) => {
			return (
				<li className="cm-li" onClick={e => this.handlerClick(e, key, type)} key={i}>
					<i className={`ic-${key}`}></i>{name}
				</li>
			)
		})
	}
	render_common = (data, type) => {
		var { parent = {} } = window.__Redux__.Config.Self.props
		var { layout = 0, panes = [] } = parent
		return data.map(({ key, name, is, bind, get }, i) => {
			if (is) {
				var cfg = window.__Redux__.Config,
					val = get.bind(cfg, bind)()
				name = is[val].name
			}
			// 只剩一个面板时禁止显示关闭
			if (key === 'close_pane' && layout === 0 && panes.length < 2) {
				this.height -= 1
				return null
			}
			return <li className="cm-li" onClick={e => this.handlerClick(e, key, type)} key={i}><i></i>{name}</li>
		})
	}
	render_tools = (data, type) => {
		return data.map(({ key, name }, i) => {
			return <li className="cm-li" onClick={e => this.handlerClick(e, key, type)} key={i}><i></i>{name}</li>
		})
	}
	getStyle = (x, y) => {
		var style = {},
			w  = document.body.clientWidth,
			h  = document.body.clientHeight,
			_w = x + 133 + 1,
			_h = y + 20 * this.height + 1
		style.left = `${_w > w? w - 133: x + 1}px`
		style.top  = `${_h > h? h - 20 * this.height: y + 1}px`

		return style
	}
	handlerClick = (e, key, type) => {
		var fn = this._Menu_[`${key}`]
		console.log(key, type)
		if (fn) fn.bind(window.__Redux__.Config.Self, key, type)()
		this.close()
	}
	render() {
		var { CurPane, Menu } = window.__Redux__.Config,
			{ type, state, pageX, pageY } = Menu
		if (!CurPane || !type) return null
		var menus = this.renderList(type)
		var style = this.getStyle(pageX, pageY)
		return (
			<div className={`contextmenu ${state? 'cm-show': ''}`}>
				<div className="cm-list" style={style}>
					{ menus }
				</div>
				<div className="cm-mask" onMouseDown={this.close}></div>
			</div>
		)
	}
}
