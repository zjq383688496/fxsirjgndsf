var Workspace  = {
	default: {
		// key: 'Professional'
		key: 'default',
		data: {
			// horizontal: 水平布局 vertical: 垂直布局
			type: 'horizontal',
			panes: [
				{
					value: 40,
					tabs: true,
					components: ['NodeView', 'Properties'],
				},
				{
					value: 60,
					tabs: true,
					components: ['Tools', 'Properties', 'TaskQueue']
				}
			]
		}
	}
}

Object.keys(Workspace).map(_ => {
	function layoutFn(da, idx) {
		da.layout = idx
		++idx
		if (da.panes && da.panes.length) {
			da.panes.map(__ => {
				layoutFn(__, idx)
			})
		}
	}
	layoutFn(Workspace[_].data, 0)
})

module.exports = {
	Workspace: Workspace.default.data,
	CurPane:    null,	// 当前面板数据
	CurModular: null,	// 当前模块数据
	CurNode:    null,	// 当前节点
	Self:       null,	// 当前组件 ( 菜单用 )
	// 菜单信息
	Menu: {
		type: '',		// 类型
		state: false,	// 是否显示
		pageX: 0,		// 鼠标坐标X轴
		pageY: 0,		// 鼠标坐标Y轴
	},
	// 节点信息
	NodeInfo: {
		Max: -1,
	},
	// 节点
	Nodes: {},
}