import React from 'react'

import './index.less'

export default class Tools extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {}

	clearCache = () => {
		localStorage.removeItem('temporaryData')
	}

	reload = () => {
		location.reload()
	}

	clearReload = () => {
		localStorage.removeItem('temporaryData')
		location.reload()
	}

	render() {
		return (
			<div className="mv-tools-view">
				<a onClick={__Tools__.addNode} data-key={'source'}>source</a>
				<a onClick={__Tools__.addNode} data-key={'dot'}>dot</a>
				<a onClick={__Tools__.addNode} data-key={'input'}>input</a>
				<a onClick={__Tools__.addNode} data-key={'outer'}>outer</a>
				<a onClick={this.clearCache}>请空缓存</a>
				<a onClick={this.reload}>刷新</a>
				<a onClick={this.clearReload}>清空刷新</a>
			</div>
		)
	}
}