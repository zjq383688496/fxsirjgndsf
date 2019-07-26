import React from 'react'

import './index.less'

export default class Tools extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {}

	render() {
		return (
			<div className="mv-tools-view">
				<a onClick={__Tools__.addNode} data-key={'source'}>source</a>
				<a onClick={__Tools__.addNode} data-key={'dot'}>dot</a>
				<a onClick={__Tools__.addNode} data-key={'input'}>input</a>
				<a onClick={__Tools__.addNode} data-key={'outer'}>outer</a>
			</div>
		)
	}
}