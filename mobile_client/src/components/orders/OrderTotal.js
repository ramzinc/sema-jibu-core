import React, {Component}  from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as OrderActions from "../../actions/OrderActions";
import PosStorage from "../../database/PosStorage";
import * as Utilities from "../../services/Utilities";

import i18n from "../../app/i18n";

class OrderTotal extends Component {
	render() {
		return (
			<View style = {styles.container}>
				<Text style={[{flex: 2}, styles.totalText]}>{i18n.t('order-total')}</Text>
				<Text style={[{flex: 3}, styles.totalText]}>{Utilities.formatCurrency(this.getAmount())}</Text>

			</View>
		);
	}
	getAmount = () =>{
		return this.props.products.reduce( (total, item) => { return(total + item.quantity * this.getItemPrice(item.product)) }, 0);
	};

	getItemPrice = (product) =>{
		let salesChannel = PosStorage.getSalesChannelFromName(this.props.channel.salesChannel);
		if( salesChannel ){
			let productMrp = PosStorage.getProductMrps()[PosStorage.getProductMrpKeyFromIds(product.productId, salesChannel.id)];
			if( productMrp ){
				return productMrp.priceAmount;
			}
		}
		return product.priceAmount;	// Just use product price
	};

}

function mapStateToProps(state, props) {
	return {products: state.orderReducer.products,
		channel: state.orderReducer.channel};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderTotal);

const styles = StyleSheet.create({
	container: {
		flex: 2,
		backgroundColor:"#e0e0e0",
		borderColor: '#2858a7',
		borderTopWidth:5,
		borderRightWidth:5,

	},
	totalText:{
		marginTop:10,
		fontWeight:'bold',
		fontSize:18,
		color:'black',
		alignSelf:'center'
	}

});
