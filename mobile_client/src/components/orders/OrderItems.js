import React, {Component}  from "react"
import { View, Modal, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";
import PosStorage from "../../database/PosStorage";

import i18n from "../../app/i18n";

const widthQuanityModal = 250;
const heightQuanityModal = 400;

const calculatorDigits = [
	{id:7, display:"7"},
	{id:8, display:"8"},
	{id:9, display:"9"},
	{id:4, display:"4"},
	{id:5, display:"5"},
	{id:6, display:"6"},
	{id:1, display:"1"},
	{id:2, display:"2"},
	{id:3, display:"3"},
	{id:0, display:"0"},
	{id:99, display:"CLEAR"},
];
class OrderItems extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isQuantityVisible :false,
			selectedItem:{},
			accumulator:0,
			firstKey:true};
	}

	render() {
		return (
			<View style = {styles.container}>
				<FlatList
					data={this.props.products}
					ListHeaderComponent = {this.showHeader}
					extraData={this.props.channel.salesChannel}
					renderItem={({item, index, separators}) => (
						<TouchableHighlight
							onPress={() => this.onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getRow(item, index, separators)}
						</TouchableHighlight>
					)}
					keyExtractor={item => item.product.productId.toString()}
				/>
				<Modal visible = {this.state.isQuantityVisible}
					   backdropColor={'red'}
					   transparent ={true}
					   onRequestClose ={this.closeHandler}>
					{this.ShowQuantityContent()}
				</Modal>
			</View>

		);
	}
	closeHandler = () =>{
		this.setState( {isQuantityVisible:false} );
	};
	onPressItem = (item) =>{
		this.setState( {isQuantityVisible:true} );
		this.setState( {selectedItem:item});
		this.setState( {accumulator: item.quantity});
		this.setState( {firstKey:true});
	};



	getRow = (item) =>{
		return (
			<View style={{flex: 1, flexDirection: 'row', backgroundColor:'white'} }>
				<View style={ [{flex: 3}]}>
					<Text style={[styles.baseItem,styles.leftMargin]}>{item.product.description}</Text>
				</View>
				<View style={[ {flex: 1}]}>
					<Text style={[styles.baseItem]}>{item.quantity}</Text>
				</View>
				<View style={ [ {flex: 1}]}>
					<Text numberOfLines={1} style={[styles.baseItem]}>{(item.quantity * this.getItemPrice( item.product)).toFixed(2)}</Text>
				</View>
			</View>
		);
	};
	showHeader = () =>{
		return (
			<View style={[{flex: 1, flexDirection: 'row'},styles.headerBackground]}>
				<View style={ [{flex: 3}]}>
					<Text style={[styles.headerItem,styles.headerLeftMargin]}>{i18n.t('item')}</Text>
				</View>
				<View style={[ {flex: 1}]}>
					<Text style={[styles.headerItem]}>{i18n.t('quantity')}</Text>
				</View>
				<View style={ [ {flex: 1}]}>
					<Text style={[styles.headerItem]}>{i18n.t('charge')}</Text>
				</View>
			</View>
		);
	};

	ShowQuantityContent = () => (
		<View style={styles.quantityModal}>
			<View style={styles.modalTotal }>
				<Text style={styles.accumulator}>{this.state.accumulator}</Text>
			</View>
			<View style={styles.modalCalculator }>
				<View style={{flex:1}}>
					<FlatList
						data={calculatorDigits}
						renderItem={({item, index, separators}) => (
							<TouchableHighlight
								onPress={() => this.onDigit(item)}
								onShowUnderlay={separators.highlight}
								onHideUnderlay={separators.unhighlight}>
								{this.getDigit(item)}
							</TouchableHighlight>
						)}
						keyExtractor={item => item.id}
						numColumns={3}
					/>

				</View>
			</View>

			<View style={styles.modalDone }>
				<TouchableHighlight style ={{flex:1}}
				onPress={() => this.onDone()}>
					<Text style={styles.doneButton}>Done</Text>
				</TouchableHighlight>
			</View>
		</View>
	);

	onDigit = (digit) =>{
		if( digit.id === 99 ){
			this.setState({accumulator:0});
		}else if( this.state.firstKey ){
			this.setState({firstKey:false});
			this.setState( {accumulator:digit.id});
		}else{
			this.setState( {accumulator: (this.state.accumulator *10) + digit.id});
		}
	};
	getDigit = (digit) =>{
		return (
			<View style={this.getDigitStyle(digit)}>
				<Text style={styles.digit} >{digit.display}</Text>
			</View>
		)
	};
	getDigitStyle = (digit) =>{
		return (digit.id === 99 ) ? styles.clearContainer : styles.digitContainer;
	};

	onDone = ()=>{
		this.setState( {isQuantityVisible:false} );
		if( this.state.accumulator ===0  ){
			this.props.orderActions.RemoveProductFromOrder( this.state.selectedItem.product );
		}else{
			this.props.orderActions.SetProductQuantity( this.state.selectedItem.product, this.state.accumulator );
		}
	};
	getItemPrice = (item) =>{
		let salesChannel = PosStorage.getSalesChannelFromName(this.props.channel.salesChannel);
		if( salesChannel ){
			let productMrp = PosStorage.getProductMrps()[PosStorage.getProductMrpKeyFromIds(item.productId, salesChannel.id)];
			if( productMrp ){
				return productMrp.priceAmount;
			}
		}
		return item.priceAmount;	// Just use product price
	};

}


function mapStateToProps(state, props) {
	return {
		products: state.orderReducer.products,
		channel: state.orderReducer.channel};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderItems);

const styles = StyleSheet.create({
	container: {
		flex: 6,
		backgroundColor:"white",
		borderColor: '#2858a7',
		borderTopWidth:5,
		borderRightWidth:5,
	},
	headerBackground:{
		backgroundColor:'#ABC1DE'
	},
	leftMargin:{
		left:10
	},
	headerLeftMargin:{
		left:10
	},
	headerItem:{
		fontWeight:'bold',
		fontSize:18,
		color:'black',
		paddingTop:5,
		paddingBottom:5,
	},
	baseItem:{
		fontWeight:'bold',
		fontSize:16,
		color:'black',
		paddingTop:4,
		paddingBottom:4,

	},
	quantityModal: {
		width:widthQuanityModal,
		height:heightQuanityModal,
		position: 'absolute',
		bottom:120,
		right:100,
		backgroundColor: '#e0e0e0',
		// padding: 22,
		// justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 1)',
		borderWidth:2
	},
	modalTotal: {
		flex: .15,
		flexDirection: 'row',
		backgroundColor:'white',
		alignItems:'center',
		borderColor:'black',
		borderWidth:4,
		borderRadius:3
	},
	modalCalculator: {
		flex: .70,
		flexDirection: 'row',
	},
	modalDone: {
		flex: .15,
		backgroundColor:'#2858a7',
		flexDirection: 'row',
		alignItems:'center',

	},
	digitContainer:{
		flex: 1,
		width:widthQuanityModal/3,
		height:(.7*heightQuanityModal)/4,
		alignItems:'center',
		justifyContent: 'center'
	},
	clearContainer:{
		flex: 1,
		width:widthQuanityModal*2/3,
		height:(.7*heightQuanityModal)/4,
		alignItems:'center',
		justifyContent: 'center'
	},
	digit: {
		textAlign: 'center',
		color: 'black',
		fontWeight: 'bold',
		fontSize: 30,
	},
	accumulator:{
		color: 'black',
		fontWeight: 'bold',
		fontSize: 30,
		flex:1,
		textAlign: 'center'
	},
	doneButton: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 30,
		flex: 1,
		textAlign: 'center'
	}
});
