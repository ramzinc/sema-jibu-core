import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, FlatList} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reportActions from "../../actions/ReportActions";
import * as customerActions from '../../actions/CustomerActions';
import * as customerBarActions from "../../actions/CustomerBarActions";
import * as toolBarActions from "../../actions/ToolBarActions";
import * as orderActions from "../../actions/OrderActions";
import PosStorage from "../../database/PosStorage";
import CustomerBar from "../customers/CustomerBar";
import {ViewSwitcher} from "../../components/PosApp";
//import DateFilter from './DateFilter'
import Events from 'react-native-simple-events';

import i18n from '../../app/i18n';

class RemindersReport extends Component {
      constructor(props){
	  super(props);
	  this.state ={
		refresh: false
	    }
       }
	componentDidMount() {
		console.log("has Mounted")
	    this.props.reportActions.getRemindersReport()
	    this.onPressItem.bind(this);
	    
	}
    	componentWillUnmount(){


    	}
	getReminders() {
		this.props.reportActions.getReminderReport()
	}

	getRemindersData() {
		this.getReminders()
	    return this.props.reminderData;
	}

    showHeader = () => {
	
	return (
		<View>
		<CustomerBar />
			<View style={[{flex: 1, flexDirection: 'row', height:50, alignItems:'center'},styles.headerBackground]}>
				<View style={ [{flex: 2}]}>
					<Text style={[styles.headerItem,styles.leftMargin]}>account-name</Text>
				</View>
				<View style={[ {flex: 2.5}]}>
					<Text style={[styles.headerItem]}>telephone-number</Text>
				</View>
				<View style={ [ {flex: 2}]}>
					<Text style={[styles.headerItem]}>address</Text>
				</View>
				<View style={ [{flex: 1.5}]}>
					<Text style={[styles.headerItem]}>total</Text>
				</View>
				<View style={ [{flex: 2.5}]}>
					<Text style={[styles.headerItem]}>product</Text>
				</View>
				<View style={ [{flex: 1.5}]}>
					<Text style={[styles.headerItem]}>Frequency</Text>
				</View>
		</View>
		</View>
		    
		);
	};

	onPressItem = (item) =>{
	    console.log("_onPressReminderItem");
	    this.props.customerActions.CustomerSelected(item);
	    //this.props.customerActions.SearchCustomers(item);
	    //this.props.customerBarActions.ShowHideCustomers(0);
	    this.setState({refresh: !this.state.refresh});
	    //this.props.orderActions.ClearOrder();
	    //this.props.orderActions.SetOrderFlow('products');
	    Events.trigger('onOrder', {customer:item});
	
	    //this.props.toolbarActions.ShowScreen("main");
	    //
	    
	};

	getRow = (item, index, separators) =>{
		// console.log("getRow -index: " + index)
		let isSelected = false;
		if( this.props.selectedCustomer && this.props.selectedCustomer.customerId === item.customerId){
			console.log("Selected item is " + item.customerId);
			isSelected = true;
		}
		if( true ) {
			return (
				<View style={[this.getRowBackground(index, isSelected), {flex: 1, flexDirection: 'row', height:50, alignItems:'center'}]}>
					<View style={{flex: 2}}>
						<Text style={[styles.baseItem, styles.leftMargin]}>{item.name}</Text>
					</View>
					<View style={{flex: 2.5}}>
						<Text style={[styles.baseItem]}>{item.phoneNumber}</Text>
					</View>
					<View style={{flex: 2}}>
						<Text style={[styles.baseItem]}>{item.address}</Text>
					</View>
					<View style={{flex: 1.5}}>
						<Text style={[styles.baseItem]}>{item.amount_cash}</Text>
				       </View>
				      <View style={{flex: 2.5}}>
						<Text style={[styles.baseItem]}>{item.product_name}</Text>
					</View>
					<View style={{flex:1.5}}>
						<Text style={[styles.baseItem]}>{item.frequency}</Text>
					</View>
				</View>
			);
		}else{
			return (<View/>);
		}
	};

	getRowBackground = (index, isSelected) =>{
		if( isSelected ){
			return styles.selectedBackground;
		}else {
			return ((index % 2) === 0) ? styles.lightBackground : styles.darkBackground;
		}
	};

	
	displayReminders() {
		if (this.props.reminderData.length == 0 ) {
		    return (<Text style={styles.titleText}>No Reminders Available</Text>);
		} else {
			return (
				<FlatList
			    ListHeaderComponent = {this.showHeader}
			    extraData={this.state.refresh}
					data={this.props.reminderData.reminderDetails}
					renderItem={({item, index, separators}) => (
						<TouchableHighlight
							onPress={() => this.onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getRow(item, index, separators)}
						</TouchableHighlight>
					)}
					keyExtractor={item => item.product_name+item.customerId}
				/>
			)
		}
	}

    render() {
        if (this.props.reportType === "reminders") {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: .7, backgroundColor: 'white', marginLeft: 10, marginRight: 10, marginTop: 10, }}>
						<View style = {styles.titleText}>
							<View style = {styles.leftHeader}>
								<Text style = {styles.titleItem}>Reminders</Text>
							</View>
						</View>
						{ this.displayReminders() }
					</View>
                </View>
            ); 
        } else {
            return null;
        } 
        
    }
}

function mapStateToProps(state, props) {
	return { 
		reportType: state.reportReducer.reportType,
		reminderData: state.reportReducer.reminderData,
	    	selectedCustomer: state.customerReducer.selectedCustomer,
	    	orderProducts : state.orderReducer.products,
	    	showView: state.customerBarReducer.showView,
	        products : state.productReducer.products

	};
}

function mapDispatchToProps(dispatch) {
	return {
		reportActions:bindActionCreators(reportActions, dispatch),
		customerActions:bindActionCreators(customerActions, dispatch),
		toolbarActions:bindActionCreators(toolBarActions, dispatch),
		customerBarActions:bindActionCreators(customerBarActions, dispatch),
		orderActions:bindActionCreators(orderActions, dispatch)
		};
}

export default connect(mapStateToProps, mapDispatchToProps)(RemindersReport);


const styles = StyleSheet.create({
	baseItem:{
		fontSize:18
	},
	headerItem:{
		fontWeight:"bold",
		fontSize:18,
	},
	headerItemCenter:{
		fontWeight:"bold",
		fontSize:18,
		textAlign:'center'
	},
	rowItem:{
		fontSize:16,
		paddingLeft:10,
		borderLeftWidth:1,
		borderColor:'black',
		borderTopWidth:1,
		borderBottomWidth:1,
		borderRightWidth:1
	},
	rowItemCenter:{
		fontSize:16,
		paddingLeft:10,
		borderLeftWidth:1,
		borderColor:'black',
		borderTopWidth:1,
		borderBottomWidth:1,
		borderRightWidth:1,
		textAlign:'center'
	},

	rowBackground:{
		backgroundColor:'white'
	},

	headerBackground:{
		backgroundColor:'white'
	},
	totalItem:{
		fontWeight:"bold",
		fontSize:18,
		paddingLeft:10,
	},
	titleItem:{
		fontWeight:"bold",
		fontSize:20
	},
	titleText: {
		backgroundColor: 'white',
		height: 36,
		flexDirection:'row',
	},

	leftHeader: {
		flexDirection:'row',
		flex:1,
		alignItems:'center'

	},
	lightBackground:{
		backgroundColor:'white'
	},
	darkBackground:{
		backgroundColor:'#F0F8FF'
	},
	selectedBackground:{
		backgroundColor:'#9AADC8'
	}
});

