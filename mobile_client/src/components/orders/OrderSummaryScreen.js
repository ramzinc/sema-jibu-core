import React, {Component}  from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import OrderSummary from "./OrderSummary";
import OrderTotal from "./OrderTotal";
import OrderItems from "./OrderItems";
import OrderCheckout from "./OrderCheckout";

export default class OrderSummaryScreen extends Component {
	render() {
		return (
			<View style = {{flex:.6, backgroundColor:"blue", borderColor: '#2858a7', borderLeftWidth:5}}>
				<OrderSummary/>
				<OrderTotal/>
				<OrderItems/>
				<OrderCheckout/>
			</View>
		);
	}
}
