import React, {Component}  from "react"
import { View, Text, Button, TouchableHighlight, StyleSheet, TouchableNativeFeedback } from "react-native";
import * as OrderActions from "../../actions/OrderActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import i18n from "../../app/i18n";

class OrderCheckout extends Component {
	render() {
		return (
			<View style={styles.container}>
				<View style={[{flex: 1, justifyContent:'center'}, this.getOpacity()]}>
					<TouchableHighlight underlayColor = '#c0c0c0'
						onPress={() => this.onPay()}>
						<Text style={[{paddingTop:20, paddingBottom:20}, styles.buttonText]}>{i18n.t('pay')}</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
	onPay = ()=>{
		console.log("onPay");
		if( this.props.products.length > 0 ) {
			this.props.orderActions.SetOrderFlow('payment');
		}
	};
	getOpacity = ()=>{
		if( this.props.products.length == 0 || this.props.flow.page != 'products'){
			return {opacity:.3};
		}else{
			return {opacity:1};
		}
	}
}

function mapStateToProps(state, props) {
	return {products: state.orderReducer.products,
		    flow: state.orderReducer.flow };
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderCheckout);


const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor:"#2858a7",

	},
	buttonText:{
		fontWeight:'bold',
		fontSize:30,
		alignSelf:'center',
		color:'white'
	}

});
