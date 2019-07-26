module.exports = {
	pane: {
		vertical: function(type) {
			split.bind(this, type)()
		},
		horizontal: function(type) {
			split.bind(this, type)()
		},
		close_pane: function() {
			var { components, data, parent, idx } = this.props,
				{ actions, Config } = __Redux__,
				{ Workspace } = Config,
				{ layout, panes } = parent
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
		},
		full_screen_pane: function() {
			var { max } = this.state
			this.setState({ max: !max })
		},
		show_tab: function() {
			var { data } = this.props,
				{ actions, Config } = __Redux__,
				{ Workspace } = Config
			data.tabs = !data.tabs
			actions.updateWorkspace(Workspace)
		}
	}
}

// 面板分割
function split(type) {
	var { components, data, parent = {}, idx } = this.props,
		{ actions, Config } = __Redux__,
		{ layout = 0, panes = [] } = parent,
		val = this.getValue(type === 'horizontal'? 'Width': 'Height') / 2
	if (parent.type === type) {
		data.value = val
		parent.panes.splice(idx + 1, 0, {
			value: val,
			tabs: true,
			components: [],
			layout
		})
	} else {
		if (!data.panes) data.panes = []
		var lay = data.layout + 1
		data.type = type
		data.panes.push(
			{ value: val, tabs: true, components, layout: lay },
			{ value: val, tabs: true, components: [], layout: lay }
		)
		delete data.components
	}
	actions.updateWorkspace(Config.Workspace)
}