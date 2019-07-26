import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import Workspace   from '@comp/Workspace'
import ContextMenu from '@comp/ContextMenu'

import './index.less'

class Edit extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {
		var { actions, Config } = this.props
		Object.assign(window.__Redux__, {
			actions,
			Config
		})
	}

	render() {
		return (
			<div className="content-wrap" ref={this.wrap}>
				<Workspace />
				<ContextMenu />
			</div>
		)
	}
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)