import * as types from '../constants'
import state from '@state'

import { nodes } from '@var'

// var { Workspace, CurPane, MenuState } = state
var initialState = { ...state }

export default function business(state = initialState, action) {
	let {
		_this,
		menu,
		node_key,
		node_data,
		pane,
		work_space,
	} = action
	let {
		Nodes,
		NodeInfo,
	} = state
	switch (action.type) {
		// 组件操作
		case types.UPDATE_WORKSPACE:
			WS.parse(work_space.panes, work_space)
			return ReduxUpdate(Object.assign({}, state, {
				Workspace: work_space
			}))

		case types.MENU_STATE:
			return ReduxUpdate(Object.assign({}, state, {
				CurPane: pane,
				Menu:    menu,
				Self:    _this,
			}))

		case types.ADD_NODE:
			++NodeInfo.Max
			var { Max } = NodeInfo,
				node = Object.assign(deepCopy(nodes[node_key]), { id: Max })
			Nodes[Max] = node
			return ReduxUpdate(Object.assign({}, state, {
				Nodes,
				NodeInfo,
			}))

		case types.UPDATE_NODE:
			var { id } = node_data
			Nodes[id] = node_data
			return ReduxUpdate(Object.assign({}, state, { Nodes }))

		default:
			return ReduxUpdate(state)
	}
}

var WS = {
	parse: function(space, parent) {
		if (!space.length) return
		space.map((_, i) => {
			var { layout, panes } = _
			if (!Object.keys(_).length) {
				space.splice(i, 1)
			} else if (panes) {
				var len = this.parse(panes, _)
				// 只有一个子元素时 向上层元素合并
				if (len === 1) {
					var p = panes[0]
					var { components, tabs, type, value } = p,
						pane = p.panes
					_.tabs = tabs
					if (components) {
						_.components = components
						delete _.panes
						delete _.type
					}
					if (pane) {
						pane.map(__ => __.layout -= 1)
						Object.assign(_, {
							panes: pane,
							type,
							value
						})
					}
				}
			}
		})
		if (space.length === 1 && parent.layout === 0) {
			var sp = space[0]
			var { components, tabs, type, value = 100 } = sp,
				pane = sp.panes
			parent.tabs = tabs
			if (components) {
				parent.components = components
				delete parent.panes
			}
			if (pane) {
				pane.map(_ => _.layout -= 1)
				Object.assign(parent, {
					panes: pane,
					type,
					value
				})
			}
		}
		return space.length
	}
}

function ReduxUpdate(o) {
	window.__Redux__.Config = o
	return o
}