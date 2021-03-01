'use strict';

import * as types from '../constants'

export const updateWorkspace = work_space => ({
	type: types.UPDATE_WORKSPACE,
	work_space
})

export const contextMenuState = (menu, pane, _this) => ({
	type: types.MENU_STATE,
	menu,
	pane,
	_this
})

export const addNode = node_key => ({
	type: types.ADD_NODE,
	node_key
})

export const selectNode = node_id => ({
	type: types.SELECT_NODE,
	node_id
})

export const updateNode = node_data => ({
	type: types.UPDATE_NODE,
	node_data
})

export const nodeConnect = node_connect => ({
	type: types.NODE_CONTENT,
	node_connect
})

export const nodeDisconnect = node_disconnect => ({
	type: types.NODE_DISCONTENT,
	node_disconnect
})
