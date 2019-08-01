import React from 'react'
import './index.less'

export default class Rect extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {}

	componentDidMount() {}

	componentWillReceiveProps(props) {}

	componentWillUnmount() {}

	render() {
		var { color, data } = this.props,
			style = { backgroundColor: color }

		return <div className="node-rect" style={style} data-name={data.name}></div>
	}
}