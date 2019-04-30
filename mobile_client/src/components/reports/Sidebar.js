import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import * as colors from "../../styles/sema_colors";
import { bindActionCreators } from "redux";
import * as reportActions from "../../actions/ReportActions";
import { connect } from "react-redux";

import i18n from '../../app/i18n';

class Sidebar extends Component {

	render() {
		return ( <View style={{ flex: 1, backgroundColor: colors.COLOR_REPORT_SIDEBAR_BACKGROUND }}>
					<TouchableHighlight onPress={() => this.onSales()}>
						<Text style={this.getSalesMenuStyle()}>{i18n.t('sales')}</Text>
					</TouchableHighlight>
					<TouchableHighlight onPress={() => this.onInventory()}>
						<Text style={this.getInventoryMenuStyle()}>{i18n.t('inventory')}</Text>
					</TouchableHighlight>
					<TouchableHighlight onPress={() => this.onSalesLog()}>
						<Text style={this.getSalesLogMenuStyle()}>Sales Log</Text>
					</TouchableHighlight>
				</View>
		);
	}

	onSales = () =>{
		this.props.reportActions.setReportType("sales");
	};

	onInventory = () =>{
		this.props.reportActions.setReportType("inventory");
	};

	onSalesLog = () =>{
		this.props.reportActions.setReportType("salesLog");
	};

	getSalesMenuStyle(){
		return (this.props.reportType === "sales") ?
			[styles.menuText, { color: "#3C93FC" }] :
			[styles.menuText]
	}

	getInventoryMenuStyle(){
		return (this.props.reportType === "inventory") ?
			[styles.menuText, { color: "#3C93FC" }] :
			[styles.menuText]
	}

	getSalesLogMenuStyle(){
		return (this.props.reportType === "salesLog") ?
			[styles.menuText, { color: "#3C93FC" }] :
			[styles.menuText]
	}

	// componentDidMount() {

	// }

	// componentWillUnmount() {

	// }

}
function mapStateToProps(state, props) {
	return { reportType: state.reportReducer.reportType };
}

function mapDispatchToProps(dispatch) {
	return {reportActions:bindActionCreators(reportActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

const styles = StyleSheet.create({

	menuText:{
		marginLeft:20,
		marginTop:15,
		color:'white',
		fontWeight:'bold',
		fontSize:20,
	},

});
