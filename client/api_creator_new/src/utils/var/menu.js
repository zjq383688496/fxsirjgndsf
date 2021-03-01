module.exports = {
	pane: [
		{
			key: 'split',
			data: [
				{
					icon: 'vertical',
					key:  'vertical',
					name: '垂直分割',
				},
				{
					icon: 'horizontal',
					key:  'horizontal',
					name: '水平分割',
				}
			]
		},
		{
			key: 'common',
			data: [
				{
					key:  'close_pane',
					name: '关闭面板',
				},
				{
					key:  'close_tab',
					name: '关闭标签',
				},
				{
					key:  'full_screen_pane',
					is: {
						true: {
							name: '取消全屏幕'
						},
						false: {
							name: '全屏幕'
						},
					},
					bind: 'Self.state.max',
					get
				},
				{
					key:  'show_tab',
					is: {
						true: {
							name: '隐藏标签栏'
						},
						false: {
							name: '显示标签栏'
						},
					},
					bind: 'CurPane.tabs',
					get
				}
			]
		},
		{
			key: 'tools',
			data:[
			]
		},
	]
}

function get(bind) {
	var val = this
	bind.split('.').map(_ => val = val[_])
	return val || false
}