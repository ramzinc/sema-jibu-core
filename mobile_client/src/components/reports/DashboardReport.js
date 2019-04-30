import React, { Component } from 'react';
import { WebView } from 'react-native';
export default class DashboardReport extends Component {
	render() {
		return (
			<WebView
				source={{uri: 'http://sema.untapped-inc.com/'}}
			/>
		);
	}
}
