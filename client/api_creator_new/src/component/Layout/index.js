import React, { Component } from 'react'
import { Route } from 'react-router-dom'

var filter = ['path', 'location', 'computedMatch']

function DefaultLayout({ component: Component, ...rest }) {
	return (
		<Route {...rest} render={matchProps => (
			<Component {...matchProps}/>
		)} />
	)
}

export default DefaultLayout