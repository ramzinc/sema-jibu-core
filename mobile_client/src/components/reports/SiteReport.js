import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import * as colors from '../../styles/sema_colors';
import SalesReport from './SalesReport';
import InventoryReport from './InventoryReport';
import SalesLog from './SalesLog';
import Sidebar from './Sidebar';

export default class SiteReport extends Component {
	render() {
		return (
			<View style = {{flex:1, flexDirection:'row'}}>
				<Sidebar/>
				<Report/>
			</View>
		);
	}
}
class Report extends Component {
	render() {
		return (
			<View style ={{flex:4, backgroundColor: colors.COLOR_REPORT__BACKGROUND}}>
				<SalesReport/>
				<InventoryReport/>
				<SalesLog/>
			</View>
		);
	}
}

const styles = StyleSheet.create({

	container: {
		flex: 2,
		backgroundColor:"#2858a7",

	},
	menuText:{
		marginLeft:20,
		marginTop:15,
		color:'white',
		fontWeight:'bold',
		fontSize:20,
	},

});
