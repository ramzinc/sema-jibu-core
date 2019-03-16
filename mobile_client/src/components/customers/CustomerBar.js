import React, {Component} from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Alert,
} from 'react-native';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PosStorage from "../../database/PosStorage";
import * as NetworkActions from "../../actions/NetworkActions";
import * as CustomerActions from "../../actions/CustomerActions";
import * as CustomerBarActions from "../../actions/CustomerBarActions";
import * as ToolbarActions from "../../actions/ToolBarActions";

import CustomerBarButton from './CustomerBarButton';
import * as OrderActions from "../../actions/OrderActions";
import Events from "react-native-simple-events";

import i18n from '../../app/i18n';

const anonymousId = "9999999-9999-9999-9999-9999999";

class SelectedCustomerDetails extends React.Component {
	render() {
		return (
			<View style = {styles.commandBarContainer}>
				<View style={{ flexDirection:'row', height:40 }}>
					<Text style={styles.selectedCustomerText}>{i18n.t('account-name')}</Text>
					<Text style={styles.selectedCustomerText}>{this.getName()}</Text>
				</View>
				<View style={{ flexDirection:'row', height:40 }}>
					<Text style={styles.selectedCustomerText}>{i18n.t('telephone-number')}</Text>
					<Text style={styles.selectedCustomerText}>{this.getPhone()}</Text>
				</View>
			</View>
		);
	}
	getName (){
		if( this.props.selectedCustomer.hasOwnProperty("name")){
			return this.props.selectedCustomer.name;
		}else{
			return "";
		}
	};
	getPhone (){
		if( this.props.selectedCustomer.hasOwnProperty("phoneNumber")){
			return this.props.selectedCustomer.phoneNumber;
		}else{
			return "";
		}
	};

}

class CustomerBar extends Component {
	constructor(props) {
		super(props);
		if( this.props.showView.showCustomers){
			this.state = {
				addFunction: true,
				orderFunction: true,
				editFunction: true,
				deleteFunction: true
			}
		}else{
			this.state = {
				addFunction: false,
				orderFunction: true,
				editFunction: false,
				deleteFunction: false
			}
		}
	}
	componentDidMount() {
		console.log("CustomerBar:componentDidMount going back");
		Events.on('onOrder', 'toolbarEvent1', this.onOrder.bind(this) );
	}
    componentWillUnmount(){
	console.log("CustomersBar : COMPONENT WILL UNMOUNT")
		//Events.rm('onOrder', 'toolbarEvent1') ;
	}
	onOrder( ){
		console.log("CustomerBar: onOrder");
		this.onOrder();
	}

	render() {
		return (
			<View style={{ flexDirection:'row', height:100, backgroundColor:'white',  alignItems:'center'}}>
				<View style = {[styles.leftToolbar]}>
					{this.showAddButton()}
					{this.showOrderCancelOrderButton()}
					{this.showEditButton()}
					{this.showDeleteButton()}
					{this.showPayoffButton()}
					{this.showSearchTool()}
				</View>
				<View style = {[styles.rightToolbar]}>
					<SelectedCustomerDetails selectedCustomer = {this.props.selectedCustomer}/>
				</View>
			</View>
		);
	}

	onTextChange = (searchText) =>{
		console.log( searchText );
		this.props.customerActions.SearchCustomers( searchText);
		console.log( "onTextChange ---" + this.props.customers.length);

	};

	showOrderCancelOrderButton(){
		return (
			<CustomerBarButton
				title = {this.props.showView.showNewOrder ? 'Cancel' : 'Order'}
				handler = {this.onOrder.bind(this)}
				image = {this.props.showView.showNewOrder ? require('../../images/customer-back-order.png') : require('../../images/customer-order.png')}
				enabled = {this.state.orderFunction && this.props.selectedCustomer.hasOwnProperty('name')}
			/>
		);
	}
	showAddButton(){
		if( this.props.showView.showCustomers ){
			return (
				<CustomerBarButton
					title = "Add"
					handler = {this.onAdd.bind(this)}
					image = {require('../../images/customer-add.png')}
					enabled = {this.state.addFunction}
				/>
			);
		}else{
			return null;
		}
	}

	showEditButton(){
		if( this.props.showView.showCustomers ){
			return (
				<CustomerBarButton
					title = "Edit"
					handler = {this.onEdit.bind(this)}
					image = {require('../../images/customer-edit.png')}
					enabled = {this.state.editFunction &&
					this.props.selectedCustomer.hasOwnProperty('name') &&
					! this._isAnonymousCustomer(this.props.selectedCustomer)}
				/>
			);
		}else{
			return null;
		}
	}

	showDeleteButton(){
		if( this.props.showView.showCustomers ){
			return (
				<CustomerBarButton
				title = "Delete"
				handler = {this.onDelete.bind(this)}
				image = {require('../../images/customer-delete.png')}
				enabled = {this.state.deleteFunction &&
				this.props.selectedCustomer.hasOwnProperty('name') &&
				! this._isAnonymousCustomer(this.props.selectedCustomer)}
				/>
			);
		}else{
			return null;
		}
	}

	showPayoffButton(){
		if( this.props.showView.showCustomers ){
			return (
				<CustomerBarButton
					title = "Pay Loan"
					handler = {this.onPayoff.bind(this)}
					image = {require('../../images/customer-pay-balance.png')}
					enabled = {this.state.deleteFunction &&
					this.props.selectedCustomer.hasOwnProperty('name') &&
					! this._isAnonymousCustomer(this.props.selectedCustomer) &&
					this.props.selectedCustomer.dueAmount > 0}
				/>
			);
		}else{
			return null;
		}
	}

	showSearchTool(){
		if( this.props.showView.showCustomers ){
			return (
				<TextInput
					// Adding hint in Text Input using Place holder.
					placeholder={i18n.t("search-placeholder")}

					// Making the Under line Transparent.
					underlineColorAndroid='transparent'
					onChangeText = {this.onTextChange}
					value={this.props.searchString}
					style={ [styles.SearchInput]}/>
			);
		}else{
			return null;
		}
	}


	onDelete = ()=>{
		if(this.state.deleteFunction &&
			this.props.selectedCustomer.hasOwnProperty('name') &&
			! this._isAnonymousCustomer(this.props.selectedCustomer)) {

			console.log("CustomerBar:onDelete");
			let alertMessage = "Delete  customer " + this.props.selectedCustomer.name;
			if (this.props.selectedCustomer.dueAmount === 0) {
				Alert.alert(
					alertMessage,
					'Are you sure you want to delete this customer?',
					[
						{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
						{
							text: 'OK', onPress: () => {
								PosStorage.deleteCustomer(this.props.selectedCustomer);	// Delete from storage
								this.props.customerActions.CustomerSelected({});		// Clear selected customer
								this.props.customerActions.setCustomers(PosStorage.getCustomers());

							}
						},
					],
					{ cancelable: false }
				);
			}else{
				Alert.alert(
					"Customer '" + this.props.selectedCustomer.name + "' has an outstanding credit and cannot be deleted",
					'',
					[
						{ text: 'OK', onPress: () => console.log('OK Pressed') },
					],
					{ cancelable: true }
				);

			}
		}
	};
	onEdit = ()=>{
		if(this.state.editFunction &&
			this.props.selectedCustomer.hasOwnProperty('name') &&
			! this._isAnonymousCustomer(this.props.selectedCustomer)) {

			console.log("CustomerBar:onEdit");
			this.props.toolbarActions.ShowScreen("editCustomer");
		}
	};

	onOrder = ()=>{
		if(this.state.orderFunction &&
			this.props.selectedCustomer.hasOwnProperty('name')){

			console.log("CustomerBar:onOrder");
			if (!this.props.showView.showNewOrder) {
				this.props.customerBarActions.ShowHideCustomers(0);
				this.setState({ 'addFunction': false });
				this.setState({ 'editFunction': false })
				this.setState({ 'deleteFunction': false });
				this.setState({ 'orderFunction': true });
				this.props.orderActions.ClearOrder();
				this.props.orderActions.SetOrderFlow('products');
			} else {
				if( this.props.hasOwnProperty("orderProducts") && this.props.orderProducts.length > 0 ) {
					Alert.alert(
						i18n.t('cancel-order'),
						i18n.t('are-you-sure', {doThat: i18n.t('cancel-this-order')}),
						[
							{ text: i18n.t('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
							{
								text: i18n.t('yes'), onPress: () => {
									this.doCancelOrder();
								}
							},
						],
						{ cancelable: false }
					);
				}else{
					this.doCancelOrder();
				}

			}
		}
	};
	doCancelOrder = () =>{
		this.props.orderActions.ClearOrder();
		this.props.customerBarActions.ShowHideCustomers(1);
		this.setState({ 'addFunction': true });
		this.setState({ 'editFunction': true })
		this.setState({ 'deleteFunction': true });
		this.setState({ 'orderFunction': true });

	}
	onAdd = ()=>{
		if(this.state.addFunction ) {
			console.log("CustomerBar:onAdd");
			this.props.toolbarActions.ShowScreen("newCustomer");
		}
	};

	onPayoff = ()=>{
		this.props.customerBarActions.ShowHideCustomers(0);
		this.props.orderActions.SetOrderFlow('payment');
	};

	_isAnonymousCustomer( customer ){
		const customerType = PosStorage.getCustomerTypeByName("anonymous");
		if( customerType &&  customerType.id == customer.customerTypeId ){
			return true;
		}
		return false;
	}
}

function mapStateToProps(state, props) {
	return {
		selectedCustomer: state.customerReducer.selectedCustomer,
		customers: state.customerReducer.customers,
		searchString: state.customerReducer.searchString,
		showView: state.customerBarReducer.showView,
		orderProducts: state.orderReducer.products
	};
}

function mapDispatchToProps(dispatch) {
	return {customerActions:bindActionCreators(CustomerActions, dispatch),
		networkActions:bindActionCreators(NetworkActions, dispatch),
		customerBarActions:bindActionCreators(CustomerBarActions, dispatch),
		toolbarActions:bindActionCreators(ToolbarActions, dispatch),
		orderActions: bindActionCreators(OrderActions,dispatch)};
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerBar);

const styles = StyleSheet.create({

	SearchInput : {
		textAlign: 'left',
		height: 50,
		borderWidth: 2,

		borderColor: '#404040',
		borderRadius: 10,
		backgroundColor: "#FFFFFF",
		flex:.5,
		alignSelf:'center',
		marginLeft:30
	},
	Button: {
		flex: .1,
		alignSelf:'center',
		height:50,
		marginLeft:30
	},
	commandBarContainer :{
		flex: 1,
		backgroundColor:'#ABC1DE',
		height:80,
		alignSelf:'center',
		marginLeft:20,
		marginRight:20
	},
	selectedCustomerText: {
		marginLeft:10,
		alignSelf:'center',
		flex:.5,
		color:'black'
	},
	leftToolbar: {
		flexDirection:'row',
		flex:.66,
		alignItems:'center'

	},
	rightToolbar: {
		flexDirection:'row-reverse',
		flex:.34,
		alignItems:'center'

	},

});

