import React, {Component}  from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {bindActionCreators} from "redux";
import * as ProductActions from "../../actions/ProductActions";
import * as OrderActions from "../../actions/OrderActions";
import {connect} from "react-redux";

import i18n from "../../app/i18n";

class OrderSummary extends Component {
	render() {
		return (
			<View style = {styles.container}>
				<View style={{flex: 1, flexDirection: 'row'}}>
					<Text style={[{flex: 3, marginLeft:20}, styles.summaryText]}>{i18n.t('order-summary')}</Text>
					<Text style={[{flex: 1}, styles.summaryText]}>{i18n.t('cart')} ({this.getTotalOrders()})</Text>
				</View>
			</View>

		);
	}
	getTotalOrders = () =>{
		console.log("getTotalOrders");
		return this.props.products.reduce( (total, item) => { return(total + item.quantity) }, 0);
	};
}

function mapStateToProps(state, props) {
	return {products: state.orderReducer.products};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"white",
		borderColor: '#2858a7',
		borderTopWidth:5,
		borderRightWidth:5,

},
	summaryText:{
		fontWeight:'bold',
		fontSize:18,
		color:'black',
		alignSelf:'center'
	}

});


