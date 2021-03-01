import React from 'react'
import Editor from './Editor'
import { Switch, Route } from 'react-router-dom'

import '@utils'

import 'assets/common.less'

export default class App extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return <Switch><Route path="/" component={Editor}/></Switch>
	}
}