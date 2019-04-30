import React, {Component}  from "react";
import { View, CheckBox, Text, Image, TouchableHighlight, TextInput, StyleSheet, Modal, Alert } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";
import * as CustomerBarActions from "../../actions/CustomerBarActions";
import PosStorage from '../../database/PosStorage';

import * as Utilities from "../../services/Utilities";
import i18n from "../../app/i18n";
import Events from "react-native-simple-events";

class PaymentDescription extends Component {
	render() {
		return (
			<View style={[{flex: 1, flexDirection: 'row', marginTop:"1%"} ]}>
				<View style={ [{flex: 3}]}>
					<Text style={[styles.totalTitle]}>{this.props.title}</Text>
				</View>
				<View style={[ {flex: 2}]}>
					<Text style={[styles.totalValue]}>{this.props.total}</Text>
				</View>
			</View>
		);
	}
}
class PaymentMethod extends Component{
	render(){
		return (
			<View style = {styles.checkBoxRow}>
				<View style={ [{flex: 1}]}>
					<CheckBox
						style = {styles.checkBox}
						value={this.props.checkBox}
						onValueChange={this.props.checkBoxChange}/>
				</View>
				<View style={ [{flex: 3}]}>
					<Text style = {styles.checkLabel} >{this.props.checkBoxLabel}</Text>
				</View>
				<View style={[{flex: 3}]}>
					{this.showTextInput()}
				</View>
			</View>
		);
	}
	showTextInput (){
		if( this.props.parent.state.isCredit || this.props.parent.isPayoffOnly()) {
			if (this.props.type === 'cash' && this.props.parent.state.isCash) {
				return (
					<TextInput
						underlineColorAndroid='transparent'
						onChangeText={this.props.valueChange}
						keyboardType = 'numeric'
						value = {this.props.value}
						style={[styles.cashInput]}/>
				);
			} else if (this.props.type === 'credit') {
				return (
					<Text style = {styles.checkLabel}>{this.props.value}</Text>
				);

			}if (this.props.type === 'mobile' && this.props.parent.state.isMobile) {
				return (
					<TextInput
					underlineColorAndroid='transparent'
					onChangeText={this.props.valueChange}
					keyboardType = 'numeric'
					value = {this.props.value}
					style={[styles.cashInput]}/>
				);
			}
		}
		return null;
	}
}

class OrderPaymentScreen extends Component {
	constructor(props) {
		super(props);
		this.saleSuccess = false;
		this.state = {
			isCash: true,
			isCredit: false,
			isMobile:false,
			isCompleteOrderVisible :false
		};
	}
	componentDidMount() {
		console.log("OrderPaymentScreen = Mounted");
		this.updatePayment(0, this.calculateOrderDue().toString());

	}

	render() {
		return (
			<KeyboardAwareScrollView
				style={styles.orderPayment}
				resetScrollToCoords={{ x: 0, y: 0 }}
				contentContainerStyle={styles.container}
				scrollEnabled={false}>
				<View style ={{justifyContent:'flex-end', flexDirection:"row", right:100, top:10}}>
					{this.getCancelButton()}
				</View>
				<View style={{flex:1, marginTop:0, marginBottom:50, marginLeft:100, marginRight:100}}>
					<PaymentMethod
						parent = {this}
						type = {"cash"}
						checkBox = {this.state.isCash}
						checkBoxChange = {this.checkBoxChangeCash.bind(this)}
						checkBoxLabel = {i18n.t('cash')}
						value = {this.props.payment.cashToDisplay}
						valueChange = {this.valuePaymentChange} />
					{this.getCreditComponent()}
					<PaymentMethod
						parent = {this}
						type = {"mobile"}
						checkBox = {this.state.isMobile}
						checkBoxChange = {this.checkBoxChangeMobile.bind(this)}
						checkBoxLabel = {i18n.t('mobile')}
						value = {this.props.payment.mobileToDisplay}
						valueChange = {this.valuePaymentChange}/>
					{this.getSaleAmount()}
					<PaymentDescription title = {`${i18n.t('previous-amount-due')}:`} total={Utilities.formatCurrency( this.calculateAmountDue())}/>
					<PaymentDescription title = {`${i18n.t('total-amount-due')}:`} total={Utilities.formatCurrency( this.calculateTotalDue())}/>
					<View style={styles.completeOrder}>
						<View style={{justifyContent:'center', height:80}}>
							<TouchableHighlight underlayColor = '#c0c0c0'
								onPress={() => this.onCompleteOrder()}>
								<Text style={ [ {paddingTop:20, paddingBottom:20}, styles.buttonText]}>{i18n.t('complete-sale')}</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
				<Modal visible = {this.state.isCompleteOrderVisible}
					   backdropColor={'red'}
					   transparent ={true}
					   onRequestClose ={this.closeHandler}>
					{this.ShowCompleteOrder()}
				</Modal>

			</KeyboardAwareScrollView>

		);
	}
	getSaleAmount(){
		if( !this.isPayoffOnly() ){
			return (
				<PaymentDescription title = {`${i18n.t('sale-amount-due')}: `} total={Utilities.formatCurrency( this.calculateOrderDue())}/>
			);
		}else{
			return null;
		}
	};


	getCancelButton(){
		if( ! this.isPayoffOnly()){
			return(
				<TouchableHighlight
					onPress={() => this.onCancelOrder()}>
					<Image source={require('../../images/icons8-cancel-50.png')}/>
				</TouchableHighlight>
			);
		}else{
			return null;
		}
	}
	getCreditComponent(){
		if( ! this._isAnonymousCustomer(this.props.selectedCustomer) && !this.isPayoffOnly() ){
			return (
				<PaymentMethod
					parent = {this}
					type = {"credit"}
					checkBox = {this.state.isCredit}
					checkBoxChange = {this.checkBoxChangeCredit.bind(this)}
					checkBoxLabel = {i18n.t('loan')}
					value = {Utilities.formatCurrency(this.props.payment.credit)} />
			)
		}else{
			return null;
		}
	}
	_roundToDecimal( value ){
		return parseFloat(value.toFixed(2));

	}
	_isAnonymousCustomer( customer ){
		return PosStorage.getCustomerTypeByName("anonymous").id == customer.customerTypeId ? true : false;
	}

	calculateOrderDue(){
		if( this.isPayoffOnly()){
			// If this is a loan payoff then the loan payment is negative the loan amount due
			return this.calculateAmountDue();
		}else {
			return this.props.products.reduce((total, item) => {
				return (total + item.quantity * this.getItemPrice(item.product))
			}, 0);
		}
	}
	calculateAmountDue(){
		return this.props.selectedCustomer.dueAmount;
	}

	calculateTotalDue(){
		if( this.isPayoffOnly()){
			let paymentAmount = this.props.payment.cash;
			if( this.props.payment.hasOwnProperty("mobileToDisplay")){
				paymentAmount = this.props.payment.mobile;
			}
			return this._roundToDecimal((this.calculateAmountDue() - paymentAmount));

		}else{
			return this._roundToDecimal((this.calculateOrderDue() + this.calculateAmountDue()));
		}
	}

	onCompleteOrder = ()=>{
		this.setState({isCompleteOrderVisible:true});

	};
	onCancelOrder =() =>{
		this.props.orderActions.SetOrderFlow('products');
	};

	getItemPrice = (item) =>{
		let productMrp = this._getItemMrp( item );
		if( productMrp ){
			return productMrp.priceAmount;
		}
		return item.priceAmount;	// Just use product price
	};

	getItemCogs = (item) =>{
		let productMrp = this._getItemMrp( item );
		if( productMrp ){
			return productMrp.cogsAmount;
		}
		return item.cogsAmount;	// Just use product price
	};

	_getItemMrp = (item) =>{
		let salesChannel = PosStorage.getSalesChannelFromName(this.props.channel.salesChannel);
		if( salesChannel ){
			let productMrp = PosStorage.getProductMrps()[PosStorage.getProductMrpKeyFromIds(item.productId, salesChannel.id)];
			if( productMrp ){
				return productMrp;
			}
		}
		return null;
	};

	checkBoxChangeCash=()=>{
		this.setState({isCash:!this.state.isCash} );
		this.setState({isMobile:!this.state.isMobile},function(){this.updatePayment(0, this.calculateOrderDue().toFixed(2))});

	};
	valuePaymentChange=(textValue)=>{
		if(! textValue.endsWith('.')) {
			let cashValue = parseFloat(textValue);
			if (isNaN(cashValue)) {
				cashValue = 0;
			}
			if (cashValue > this.calculateOrderDue()) {
				cashValue = this.calculateOrderDue();
			}
			let credit = this._roundToDecimal(this.calculateOrderDue() - cashValue);
			this.updatePayment(credit,textValue );
		}else{
			this.updatePayment(this.calculateOrderDue() - parseFloat(textValue), textValue );
		}
	};


	checkBoxChangeCredit=()=>{
		this.setState({isCredit:!this.state.isCredit},function(){this.updatePayment(0, this.calculateOrderDue().toFixed(2))} );
	};

	checkBoxChangeMobile=()=> {
		this.setState({isMobile:!this.state.isMobile} , function(){this.updatePayment(0, this.calculateOrderDue().toFixed(2))});
		this.setState({isCash:!this.state.isCash} );
	};

	updatePayment=( credit, textToDisplay)=> {
		let payment = {
			cash: this.calculateOrderDue()-credit,
			cashToDisplay: textToDisplay,
			credit: credit,
			mobile: 0
		};
		if (this.state.isMobile) {
			payment = {
				mobile: this.calculateOrderDue()-credit,
				mobileToDisplay: textToDisplay,
				credit: credit,
				cash: 0
			};
		}
		this.props.orderActions.SetPayment( payment );
	};

	closeHandler= ()=>{
		this.setState( {isCompleteOrderVisible:false} );
		if( this.saleSuccess) {
			this.props.customerBarActions.ShowHideCustomers(1);
		}else{
			Alert.alert(
				"Invalid payment amount. ",
				'The amount paid cannot exceed to cost of goods and customer amount due',
				[
					{ text: 'OK', onPress: () => console.log('OK Pressed') },
				],
				{ cancelable: false }
			);

		}
	};

	ShowCompleteOrder = () =>{
		let that = this;
		if( this.state.isCompleteOrderVisible ) {
			if( this.formatAndSaveSale() ) {
				this.saleSuccess = true;
				setTimeout(() => {
					that.closeHandler()
				}, 500);
			}else{
				this.saleSuccess = false;
				setTimeout(() => {
					that.closeHandler()
				}, 1);
			}
		}
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}>

				<View style={styles.orderProcessing}>
					<Text style={{fontSize:24, fontWeight:'bold'}}>{i18n.t('processing-order')}</Text>
				</View>
			</View>
		);
	};

	formatAndSaveSale = async () => {
		let receipt = null;
		let priceTotal = 0;
		if (!this.isPayoffOnly()) {

			// Assumes that there is at least one product
			let receiptDate = new Date(Date.now());
			receipt = {
				id: receiptDate.toISOString(),
				createdDate: receiptDate,
				currencyCode: this.props.products[0].product.priceCurrency,
				customerId: this.props.selectedCustomer.customerId,
				amountCash: this.props.payment.cash,
				amountLoan: this.props.payment.credit,
				amountMobile: this.props.payment.mobile,
				siteId: this.props.selectedCustomer.siteId,
				paymentType: "",		// NOT sure what this is
				salesChannelId: this.props.selectedCustomer.salesChannelId,
				customerTypeId: this.props.selectedCustomer.customerTypeId,
				products: [],
				active: 1
			};

			if (!receipt.siteId) {
				// This fixes issues with the pseudo direct customer
				receipt.siteId = PosStorage.getSettings().siteId;
			}


			let cogsTotal = 0;

			receipt.products =await this.props.products.map(product => {
				let receiptLineItem = {};
				let tempValue=this.getItemCogs(product.product) * product.quantity;
				receiptLineItem.priceTotal = this.getItemPrice(product.product) * product.quantity;
				receiptLineItem.quantity = product.quantity;
				receiptLineItem.productId = product.product.productId;
				receiptLineItem.cogsTotal = tempValue==0?product.quantity:tempValue;
				// The items below are used for reporting...
				receiptLineItem.sku = product.product.sku;
				receiptLineItem.description = product.product.description;
				if (product.product.unitMeasure == "liters") {
					receiptLineItem.litersPerSku = product.product.unitPerProduct;
				} else {
					receiptLineItem.litersPerSku = "N/A";
				}
				priceTotal += receiptLineItem.priceTotal;
				cogsTotal += receiptLineItem.cogsTotal;
				receiptLineItem.active = 1;
				return receiptLineItem;
			});
			receipt.total = priceTotal;
			receipt.cogs = cogsTotal;

		}
		// Check loan payoff
		let payoff = 0;
		try {
			if (this.props.payment.hasOwnProperty("cashToDisplay")) {
				payoff = parseFloat(this.props.payment.cashToDisplay);
			} else if (this.props.payment.hasOwnProperty("mobileToDisplay")) {
				payoff = parseFloat(this.props.payment.mobileToDisplay);
			}
			if (payoff > priceTotal) {
				// User is paying of loan amount
				payoff -= priceTotal;
				if (payoff > this.props.selectedCustomer.dueAmount) {
					// Overpayment... this is an error
					return false;
				}
			} else {
				payoff = 0;
			}
		} catch (err) {
			console.log("formatAndSaveSale " + err.message);
		}
		if (receipt != null){
			await PosStorage.addSale(receipt)
				.then(saleKey => {
					Events.trigger('NewSaleAdded', {
						key: saleKey,
						sale: receipt
					});
				});

			// Update dueAmount if required
			if (receipt.amountLoan > 0) {
				this.props.selectedCustomer.dueAmount += receipt.amountLoan;
				await PosStorage.updateCustomer(
					this.props.selectedCustomer,
					this.props.selectedCustomer.phoneNumber,
					this.props.selectedCustomer.name,
					this.props.selectedCustomer.address,
					this.props.selectedCustomer.salesChannelId);
			} else if (payoff > 0) {
				this.props.selectedCustomer.dueAmount -= payoff;
				await PosStorage.updateCustomer(
					this.props.selectedCustomer,
					this.props.selectedCustomer.phoneNumber,
					this.props.selectedCustomer.name,
					this.props.selectedCustomer.address,
					this.props.selectedCustomer.salesChannelId);
			}
		}else {
			if (payoff > 0) {
				this.props.selectedCustomer.dueAmount -= payoff;
				await PosStorage.updateCustomer(
					this.props.selectedCustomer,
					this.props.selectedCustomer.phoneNumber,
					this.props.selectedCustomer.name,
					this.props.selectedCustomer.address,
					this.props.selectedCustomer.salesChannelId);

			}
		}
		return true;
	};

	isPayoffOnly(){
		return this.props.products.length === 0;
	};
}

function mapStateToProps(state, props) {
	return {
		products: state.orderReducer.products,
		channel: state.orderReducer.channel,
		payment: state.orderReducer.payment,

		selectedCustomer: state.customerReducer.selectedCustomer};
}
function mapDispatchToProps(dispatch) {
	return {
		orderActions: bindActionCreators(OrderActions,dispatch),
		customerBarActions:bindActionCreators(CustomerBarActions, dispatch)
	};
}

export default  connect(mapStateToProps, mapDispatchToProps)(OrderPaymentScreen);

const styles = StyleSheet.create({
	orderPayment: {
		flex: 1,
		backgroundColor: "white",
		borderTopColor:'black',
		borderTopWidth:5
	},
	checkBoxRow: {
		flex: 1,
		flexDirection:"row",
		marginTop:"1%",
		alignItems:'center'
	},
	checkBox: {
	},
	checkLabel: {
		left: 20,
		fontSize:20,
	},
	totalSubTotal: {
		flex: 1,
		flexDirection:"row"
	},
	totalTitle: {
		fontSize:20,
	},
	totalValue: {
		fontSize:20,
	},
	completeOrder: {
		backgroundColor:"#2858a7",
		borderRadius:30,
		marginTop:"1%"

	},
	buttonText:{
		fontWeight:'bold',
		fontSize:20,
		alignSelf:'center',
		color:'white'
	},
	cashInput : {
		textAlign: 'left',
		height: 50,
		width:100,
		borderWidth: 2,
		fontSize:20,
		borderColor: '#404040',
		// alignSelf: 'center',
	},
	orderProcessing: {
		height:100,
		width:500,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#ABC1DE',
		borderColor:"#2858a7",
		borderWidth:5,
		borderRadius:10
	}

});

