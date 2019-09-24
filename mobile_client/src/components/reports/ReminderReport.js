import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, FlatList} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reportActions from "../../actions/ReportActions";
import * as customerActions from '../../actions/CustomerActions';
import * as customerBarActions from "../../actions/CustomerBarActions";
import * as toolBarActions from "../../actions/ToolBarActions";
import * as orderActions from "../../actions/OrderActions";
import * as reminderActions from "../../actions/ReminderActions.js";
import PosStorage from "../../database/PosStorage";
import CustomerBar from "../customers/CustomerBar";
import {ViewSwitcher} from "../../components/PosApp";
import DateFilter from './DateFilter';
import Events from 'react-native-simple-events';

import i18n from '../../app/i18n';

class RemindersReport extends Component {
      constructor(props){
	  super(props);
	  this.state ={
	      refresh: false   
	  };
	  this.reminderDate=null;
	  // this.endDate=null;
       }
	componentDidMount() {
	    console.log("Reminders Report has Mounted");
	    console.log("Current Date Being Used In Reminders" + this.props.dateFilter.startDate);
	    this.props.reportActions.getRemindersReport(this.props.dateFilter.currentDate);
	    this.onPressItem.bind(this);
	    // this.prepareReminderCustomersData.bind(this);
	    

	}
    	// componentWillUnmount(){


    	// }
    	// //Assuming this is your update function
    	getReminders(filterDate){
	    this.props.reportActions.getRemindersReport(filterDate);
	}

	getRemindersData(){
	    if(this.props.dateFilter.hasOwnProperty("startDate") && this.props.dateFilter.hasOwnProperty("endDate")){
		this.reminderDate=this.props.dateFilter.startDate;
		console.log("ENTERED THE GETREMINDERDATA");
		if(this.props.dateFilter.endDate == this.reminderDate){
		    this.getReminders(this.reminderDate);
	      	    return this.props.reminderData;

		}else{
		    this.reminderDate=this.props.dateFilter.startDate;
		    this.getReminders(this.reminderDate);
		    return this.props.reminderData;
	    	    }

	    }else{
		console.log("LASTTRY");
		this.getReminders(new Date());
		return this.props.reminderData;
	    }
	}
    
      // prepareReminderCustomersData = (reminders)=>{
      // 	      let aggregatedCustomers = [];
      // 	      for(var i=0;i< reminders.length;i++){
      // 	      if(aggregatedCustomers.length === 0){
      // 	      		aggregatedCustomers[i]= reminders[i]
      // 	      }else if(reminders[i].customer_id == reminders[i+1].customer_id){
      // 		  aggregatedCustomers[i].product_name = `${aggregatedCustomers[i].product_name + ', '} + ${reminders[i+1].product_name}`
      // 	      }else{
      // 		    continue;
      // 	      }
	      
      // 	      }
      // 	 return aggregatdCustomers;

      // 	};


    showHeader = () => {
	
	return (
		<View>
		<CustomerBar />
		<DateFilter />
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
				<View style={ [{flex: 2.5}]}>
					<Text style={[styles.headerItem]}>products</Text>
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
	    //this.props.toolbarActions.ShowScreen('orderReminder');
	    this.props.toolbarActions.ShowScreen("main");
	    //
	    
	};
    	
    	// getReceipts(){
	//     receipts = PosStorage.getReceipts();
	

    	// }
	getRow = (item, index, separators) =>{
		// console.log("getRow -index: " + index)
		let isSelected = false;
		if( this.props.selectedCustomer && this.props.selectedCustomer.customerId === item.customerId){
			console.log("Selected item is " + item.customerId);
			isSelected = true;
		}
		if( true ) {
			return (
				<View style={[this.getRowBackground(index, isSelected), {flex: 1, flexDirection: 'row', height:100, alignItems:'center'}]}>
					<View style={{flex: 2}}>
						<Text style={[styles.baseItem, styles.leftMargin]}>{item.name}</Text>
					</View>
					<View style={{flex: 2.5}}>
						<Text style={[styles.baseItem]}>{item.phoneNumber}</Text>
					</View>
					<View style={{flex: 2}}>
						<Text style={[styles.baseItem]}>{item.address}</Text>
				</View>
				
				      <View style={{flex: 2.5}}>
						<Text style={[styles.baseItem]}>{item.product_name}</Text>
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
		if (!this.props.reminderData || this.props.reminderData.length == 0 ) {
		    return (
			    <View style={{flex:1}}>
			    <View>{this.showHeader()}</View>
			    <Text style={styles.titleText}>No Reminders Available</Text>
			    </View>
		    );
		    
		} else {
		    console.log("I AM IN THE REPORTS=>" + Object.values(this.props.reminderData));
		    
			return (
				<FlatList
			    ListHeaderComponent = {this.showHeader}
			     extraData={this.state.refresh}
			    data={this.getRemindersData()}
					renderItem={({item, index, separators}) => (
						<TouchableHighlight
							onPress={() => this.onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getRow(item, index, separators)}
						</TouchableHighlight>
					)}
					keyExtractor={item => `${item.customerId}${item.receipt}`}
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
	    	products : state.productReducer.products,
	    	dateFilter: state.reportReducer.dateFilter

	};
}

function mapDispatchToProps(dispatch) {
	return {
		reportActions:bindActionCreators(reportActions, dispatch),
		customerActions:bindActionCreators(customerActions, dispatch),
		toolbarActions:bindActionCreators(toolBarActions, dispatch),
	    	customerBarActions:bindActionCreators(customerBarActions, dispatch),
	    	reminderActions: bindActionCreators(reminderActions, dispatch),
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

