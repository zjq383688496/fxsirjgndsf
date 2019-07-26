import React from 'react'
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import * as actions from 'actions'

import './index.less'

export default class Properties extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {}

	render() {
		return (
			<div className="mv-properties">
				Properties
			</div>
		)
	}
}

// const mapStateToProps = state => state

// const mapDispatchToProps = dispatch => ({
// 	actions: bindActionCreators(actions, dispatch)
// })

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(Modular)