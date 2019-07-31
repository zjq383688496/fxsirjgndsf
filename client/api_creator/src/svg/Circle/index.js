import React from 'react'
import './index.less'

export default class Circle extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {}

	componentDidMount() {}

	componentWillReceiveProps(props) {}

	componentWillUnmount() {}

	render() {
		var { color } = this.props,
			style = { backgroundColor: color }

		return <div className="node-circle" style={style}></div>
	}
}