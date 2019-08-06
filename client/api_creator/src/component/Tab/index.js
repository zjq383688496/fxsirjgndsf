import React from 'react'
import Modulars from '@modular/index'

import './index.less'

export default class Tab extends React.Component {
	constructor(props) {
		super(props)
	}
	range = []
	reIdx = null
	state = {
		idx: 0,
		pageX: 0,
		isMove: false
	}
	componentDidMount() {
		this.tabRange()
	}
	componentDidUpdate() {
		this.tabRange()
	}
	componentWillUpdate(props) {
	}
	tabRange = () => {
		var par   = this.refs['tabParent'],
			nodes = par.querySelectorAll('.wp-tab-node'),
			tabs  = par.querySelectorAll('.wp-tab-child'),
			range = []
		if (!tabs.length) return
		tabs.forEach(({ offsetWidth }, i) => {
			var x = 0
			if (i) {
				var cur = range[i - 1]
				x = cur.x + cur.w
			}
			range.push({ x, d: x + offsetWidth / 2, w: offsetWidth })
		})
		this.range = range
		this.tabs  = tabs
		this.nodes = nodes
	}
	select = (e, index) => {
		e.stopPropagation()
		var { idx } = this.state
		if (idx === index) return
		this.setState({ idx: index })
	}
	close = (e, index) => {
		e.stopPropagation()
		var { data } = this.props,
			{ actions, Config } = __Redux__,
			{ components } = data
		components.splice(index, 1)
		actions.updateWorkspace(Config.Workspace)
		this.setState({ idx: index > 0? index - 1: 0 })
	}
	mousedown = (e, index) => {
		if (!this.range.length) return
		var { pageX } = e
		this.setState({ pageX, isMove: true })
		
		// 初始化目标节点索引
		this.reIdx = null
	}
	mousemove = e => {
		var { nodes, range, reIdx, state, tabs } = this,
			{ pageX, idx } = state,
			{ x, d, w }  = range[idx],	// 当前节点信息
			off   = e.pageX - pageX,	// 自身偏移量
			diff  = off + x,			// 全局偏移量 (相对父级)
			cur   = tabs[idx],			// 当前子节点
			prev  = nodes[reIdx],		// 上一个父节点
			pcls  = ((prev && prev.className) || ''),		// 上一个父节点样式名
			len   = range.length,		// 节点数
			last  = range[len - 1],		// 最后节点信息
			lMax  = -x,					// 最大偏移量-左
			rMax  = last.x - x,			// 最大偏移量-右
			index = len - 1				// 目标索引-当前偏移位置索引

		// 遍历计算正确的索引
		for (var i = 0; i < len; i++) {
			var dd = range[i].d
			if (diff < dd) { index = i; break }
		}
		// 当前子节点渲染偏移值
		cur.style.left = `${off < lMax? -x: off > rMax? rMax: off}px`

		// 目标索引 与 上一索引不等 并 上一索引非空
		// 上一个父节点存在并清除样式
		if (index !== reIdx && reIdx != null) prev.className = pcls.replace(/\s*s-insert-(before|after)\s*/g, ' ').replace(/\s+/g, ' ').replace(/(^\s+|\s+$)/g, '')

		// 目标索引 与 当前索引 相等 则不做处理并返回
		if (index === idx) {
			return this.reIdx = null
		}

		var next = nodes[index],		// 目标父节点
			cls  = next.className		// 目标样式名

		// 目标索引 与 上一索引不等
		// 目标父节点添加
		if (index !== reIdx) next.className = cls += ` s-insert-${index < idx? 'before': 'after'}`

		// 更新目标节点索引
		this.reIdx = index
	}
	mouseup = e => {
		var { nodes, reIdx } = this,
			{ actions, Config } = __Redux__,
			{ data } = this.props,
			{ components } = data,
			{ idx } = this.state,
			cur  = this.tabs[idx],
			node = nodes[reIdx]
		cur.removeAttribute('style')
		var st = { pageX: 0, isMove: false }
		if (reIdx !== null) st.idx = reIdx
		this.setState(st)
		if (idx === reIdx || reIdx === null) return
		if (reIdx < idx) {
			var item = components.splice(idx, 1)
			components.splice(reIdx, 0, [...item])
		} else {
			components.splice(reIdx + 1, 0, components[idx])
			components.splice(idx, 1)
		}
		node.className = node.className.replace(/\s*s-insert-(before|after)\s*/g, ' ').replace(/\s+/g, ' ').replace(/(^\s+|\s+$)/g, '')
	}
	contextmenu = e => {
		e.stopPropagation()
		e.preventDefault()
	}
 	renderTabs = components => {
		var { idx, isMove } = this.state
		return components.map((_, i) => {
			return (
				<div key={i} className={`wp-tab-node${idx === i? ' s-active': ''}${idx === i && isMove? ' s-move': ''}`}>
					<div className="wp-tab-child">
						<div
							className="wp-tab-name"
							onMouseDown={e => { this.select(e, i); this.mousedown(e, i) }}
						>{_}</div>
						<i className="ic-close" onClick={e => this.close(e, i)}></i>
					</div>
				</div>
			)
		})
	}
	renderModular = components => {
		var { idx } = this.state
		return Modulars[components[idx]]
	}
	render() {
		var { data, prevElement } = this.props,
			{ idx, isMove } = this.state,
			{ components } = data,
			tabsDom    = this.renderTabs(components),
			ModularDom = this.renderModular(components)
		return (
			<div className="wp-tab" ref="tabParent">
				{
					data.tabs
					?
					<div className="wt-bar" onContextMenu={this.contextmenu}>
						{ prevElement? prevElement: null }
						<div className="wt-bar-list">
							{ tabsDom }
						</div>
					</div>
					: null
				}
				<div className="wt-content">
					{
						ModularDom
						?
						<ModularDom data={data} />
						: null
					}
				</div>
				<div
					style={{ display: isMove? 'block': 'none' }}
					className="wp-mask"
					onMouseMove={this.mousemove}
					onMouseUp={this.mouseup}
				></div>
			</div>
		)
	}
}