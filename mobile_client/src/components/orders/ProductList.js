import React, { Component }  from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as ProductActions from '../../actions/ProductActions';
import * as OrderActions from "../../actions/OrderActions";
import PosStorage from "../../database/PosStorage";
import randomMC from 'random-material-color';

class ProductList extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.log("ProductList = Mounted");
	}

	render() {
		return (
			<View  style={styles.container} >
				<FlatList
					data={this.prepareData()}
					renderItem={({item, index, separators}) => (
						<TouchableOpacity
							onPress={() => this.onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getItem(item, index, separators)}

						</TouchableOpacity>
					)}
					keyExtractor={item => item.productId}
					numColumns={4}
					horizontal={false}
				/>
			</View>
		);
	}

	getItem = (item, index) => {
		return (
			<View style={[this.getItemBackground(index ), {flex:1, height:this.props.viewWidth/4, width:this.props.viewWidth/4}]}>
				<Image
					source={{uri: this.getImage(item) }}
					resizeMethod ='scale'
					style={{flex:1}}>
				</Image>
				<Text style={[styles.imageLabel,this.getLabelBackground(item.categoryId)]}>{item.description}{'\n'}{this.getItemPrice(item)}</Text>
			</View>
		);
	};

	prepareData = () => {
		let productMrp = PosStorage.getProductMrps();

		if (Object.keys(productMrp).length === 0 && productMrp.constructor === Object) {
			return this.props.products; // No mapping tables
		} else {
			let salesChannel = PosStorage.getSalesChannelFromName(this.props.filter);

			if(salesChannel) {
				return this.props.products.filter(product => {
					// If product has no mapping tables at all for the selected kiosk, display it
					if (!this.hasMappingTable(product, productMrp)) return true;
					// If product has a mapping with the customer's sales channel and is of the same kiosk
					// as the selected customer, display it
					const mapping = productMrp[PosStorage.getProductMrpKeyFromIds(product.productId, salesChannel.id)];
					if (mapping) return mapping.siteId === this.props.selectedCustomer.siteId;
					return false;
				});
			} else {
				return this.props.products;
			}
		}
	}

	hasMappingTable(product, productMrp) {
		// Search through the keys of productMrp
		return Object.keys(productMrp).reduce((hasMrp, key) => {
			if (key.startsWith(`${product.productId}-`)) return true;
			return hasMrp;
		}, false);
	}

	getImage = item => {
		if( item.base64encodedImage.startsWith('data:image')){
			return item.base64encodedImage;
		}else {
			return 'data:image/png;base64,' + item.base64encoded_image
		}
	}

	onPressItem = item =>{
		console.log("onPressItem");
		this.props.orderActions.AddProductToOrder(item, 1);
	}

	getItemBackground = index => {
		return ((index % 2) === 0) ? styles.lightBackground : styles.darkBackground;
	}

	getLabelBackground = categoryId => {
		// random-material-color will get a different color for each category of the sales channel
		// It will remember the color based on the text property we pass
		return { backgroundColor: `${randomMC.getColor({text: `${categoryId}-${this.props.filter}`})}` };
	}

	getItemPrice = item => {
		let salesChannel = PosStorage.getSalesChannelFromName(this.props.filter);

		if (salesChannel) {
			let productMrp = PosStorage.getProductMrps()[PosStorage.getProductMrpKeyFromIds(item.productId, salesChannel.id)];

			if (productMrp) {
				return productMrp.priceAmount;
			}
		}
		return item.priceAmount;	// Just use product price
	};

}

function mapStateToProps(state, props) {
	return {
		products: state.productReducer.products,
		selectedCustomer: state.customerReducer.selectedCustomer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		productActions: bindActionCreators(ProductActions, dispatch),
		orderActions: bindActionCreators(OrderActions,dispatch)
	};
}



export default connect(mapStateToProps, mapDispatchToProps)(ProductList);

const styles = StyleSheet.create({
	container:{
		flex:1,
		borderColor:'#ABC1DE',
		borderTopWidth:5
	},

	imageLabel:{
		fontWeight:'bold',
		paddingTop:5,
		paddingBottom:5,
		textAlign: 'center',
		color:'white'
	},

	lightBackground:{
		backgroundColor:'#ABC1DE'
	},

	darkBackground:{
		backgroundColor:'#ABC1DE'
	}
});
