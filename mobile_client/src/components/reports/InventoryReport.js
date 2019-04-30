import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, FlatList, Modal, TextInput} from 'react-native';
import { bindActionCreators } from "redux";
import * as reportActions from "../../actions/ReportActions";
import { connect } from "react-redux";
import DateFilter from "./DateFilter";
import PosStorage from "../../database/PosStorage";
import i18n from '../../app/i18n';

class InventoryEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {inventoryQuantity:this.props.quantity};
		this.quantityInput = React.createRef();
	}
	componentWillUpdate(){
		this.state.inventoryQuantity = this.props.quantity;
		// if( this.quantityInput.current ) {
		// 	this.quantityInput.current.refs.quantityInput.focus();
		// }
	}

	render() {
		return (
			<Modal visible = {this.isVisible()}
				   transparent ={true}
				   onRequestClose ={this.closeCurrentSkuHandler.bind(this)}>
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>

					<View style={[styles.editInventory]}>
						<View style={{marginTop:5}}>
							<Text style={{fontSize:28, fontWeight:'bold'}}>{i18n.t('inventory')}</Text>
						</View>
						<View style={{flexDirection:'row',alignItems: 'center', justifyContent:'center', marginTop:20}}>
							<Text style={{fontSize:18, fontWeight:'bold', flex:.7, paddingLeft:20}}>{this.props.title}</Text>
							<TextInput
								reference = 'quantityInput'
								style={ [styles.inventoryInput, {flex:.5, paddingRight:40, marginRight:20 }]}
								underlineColorAndroid='transparent'
								onSubmitEditing = {() => this.props.okMethod(this.props.sku, this.state.inventoryQuantity)}
								keyboardType = 'numeric'
								onChangeText = {this.onChangeText.bind(this)}
								value = {this.state.inventoryQuantity}
								ref = {this.quantityInput}
								autoFocus = {true}
								placeholder = "Current Value">

							</TextInput>
						</View>
						<View style={{flexDirection:'row',  justifyContent:'center', marginTop:20}}>
							<View style={{backgroundColor:"#2858a7", borderRadius:10, flex:.3}}>
								<TouchableHighlight underlayColor = '#c0c0c0' onPress={() => this.props.okMethod( this.props.sku, this.state.inventoryQuantity)}>
									<Text style={styles.buttonText}>{i18n.t('ok')}</Text>
								</TouchableHighlight>
							</View>
							<View style={{flex:.1,backgroundColor:'white'}}>
							</View>
							<View style={{backgroundColor:"#2858a7", borderRadius:10, flex:.3 }}>
								<TouchableHighlight underlayColor = '#c0c0c0' onPress={() => this.props.cancelMethod()}>
									<Text style={styles.buttonText}>{i18n.t('cancel')}</Text>
								</TouchableHighlight>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);

	}
	closeCurrentSkuHandler(){
		this.props.cancelMethod();
	};
	isVisible(){
		if(this.props.type === "sku"){
			return this.props.skuToShow === this.props.sku;
		}else if(this.props.type === "currentMeter" ){
			return this.props.visible;
		}else{
			return false;
		}
	}
	onChangeText = (text )=>{
		this.setState({inventoryQuantity :text});
	}

}
const dayInMilliseconds =  24*60*60*1000;

class InventoryReport extends Component {
	constructor(props) {
		super(props);

		let currentDate = new Date();
		this.startDate = null;
		this.endDate = null;

		this.state = {
			currentSkuEdit:"",
			refresh: false,
			currentMeterVisible:false
		};
	}

	componentDidMount() {
		console.log("InventoryReport - componentDidMount");
	}

	componentWillUnmount() {
		console.log("InventoryReport - componentWillUnmount");
	}

	render() {
		if (this.props.reportType === "inventory") {
			return (
				<View style={{ flex: 1 }}>
					<DateFilter/>
					<View style={{ flex: .7, backgroundColor: 'white', marginLeft: 10, marginRight: 10, marginTop: 10, }}>
						<View style = {styles.titleText}>
							<View style = {styles.leftHeader}>
								<Text style = {styles.titleItem}>{i18n.t('sales')}</Text>
							</View>
							<View style = {styles.rightHeader}>
								<Text style = {styles.titleItem}>{i18n.t('inventory')}</Text>
							</View>
						</View>
						<FlatList
							data={this.getInventoryData()}
							extraData={this.state.refresh}
							ListHeaderComponent={this.showHeader}
							renderItem={({ item, index, separators }) => (
								<View>
									{this.getRow(item, index, separators)}
								</View>
							)}
							keyExtractor={item => item.sku}
							initialNumToRender={50}
						/>

					</View>
					<View style={{
						flex: .5,
						backgroundColor: 'white',
						marginLeft: 10,
						marginRight: 10,
						marginBottom: 10,
					}}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={[styles.totalItem, { flex: 1.5 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .7 }]}>{i18n.t('total-sales')}</Text>
							<Text style={[styles.totalItem, { flex: 1.0 }]}>{this.getTotalLiters()}</Text>
							<Text style={[styles.totalItem, { flex: .8 }]}>{i18n.t('delta-inventory')}</Text>
							<Text style={[styles.totalItem, { flex: .6 }]}>{this.getTotalInventory()}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginTop:15 }}>
							<Text style={[styles.totalItem, { flex: 1.7 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .4}]}>{i18n.t('output')}</Text>
							<Text style={[styles.totalItem, { flex: 1.0 }]}>({i18n.t('sales')} + {i18n.t('inventory')})</Text>
							<Text style={[styles.totalItem, { flex: .5 }]}>{this.getOutput()} </Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginTop:15, alignItems:"center" }}>
							<Text style={[styles.totalItem, { flex: .50 }]}> </Text>
							<Text style={[styles.production, { flex: .33}]}>{i18n.t('production')}</Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>{i18n.t('previous-meter')}</Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>{i18n.t('current-meter')}</Text>
							<Text style={[styles.totalItem, { flex: .40 }]}>{i18n.t('total-production')}</Text>
						</View>

						<View style={[{ flex: 1, flexDirection: 'row', alignItems:"center", marginTop:5 }]}>
							<Text style={[styles.totalItem, { flex: .83 }]}> </Text>
							<Text style={[styles.rowItemCenter, { flex: .33 }]}>{this.getInventoryMeterForDisplay(false)}</Text>
							{this.getCurrentMeter()}
							<Text style={[styles.rowItemCenter, { flex: .40 }]}>{this.getTotalProduction()}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginTop:15, marginBottom:10 }}>
							<Text style={[styles.totalItem, { flex: .66 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>{i18n.t('wastage')}: </Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>{this.getWastage()}</Text>
						</View>
						<InventoryEdit
							type = "currentMeter"
							visible = {this.state.currentMeterVisible}
							sku={""}
							title = "Current Meter"
							quantity = {this.getInventoryCurrentMeterForEdit()}
							cancelMethod = {this.onCancelCurrentMeter.bind(this)}
							okMethod = {this.onOkCurrentMeter.bind(this)}>
						</InventoryEdit>
					</View>

				</View>
			);
		} else {
			return null;
		}
	}
	getInventoryCurrentMeterForEdit(){
		let value = this.props.inventoryData.inventory.currentMeter;
		if( value == null) return "";
		else return value.toFixed(2);
	}

	getInventoryData(){
		if( this.props.dateFilter.hasOwnProperty("startDate") && this.props.dateFilter.hasOwnProperty("endDate") ){
			if( this.props.dateFilter.startDate == this.startDate && this.props.dateFilter.endDate == this.endDate){
				return this.props.inventoryData.salesAndProducts.salesItems
			}else{
				// Get new data
				this.startDate = this.props.dateFilter.startDate;
				this.endDate = this.props.dateFilter.endDate;
				this.updateReport();
				return this.props.inventoryData.salesAndProducts.salesItems;
			}
		}else{
			return this.props.inventoryData.salesAndProducts.salesItems;
		}
	}

	getTotalSales() {
		if (this.props.inventoryData.salesAndProducts.totalSales) {
			return this.props.inventoryData.salesAndProducts.totalSales.toFixed(2);
		} else {
			return '-';
		}
	}

	getTotalLiters() {
		if (this.props.inventoryData.salesAndProducts.totalLiters && this.props.inventoryData.salesAndProducts.totalLiters !== 'N/A') {
			return this.props.inventoryData.salesAndProducts.totalLiters.toFixed(2) + ' L';
		} else {
			return '-';
		}

	}

	getItemTotalLiters(item) {
		if( item.totalLiters && item.totalLiters !== 'N/A' ){
			return `${item.totalLiters.toFixed(2)} L`;
		}
		return 'N/A';
	}

	getItemLitersPerSku(item) {
		if (item.litersPerSku && item.litersPerSku !== 'N/A') {
			return `${item.litersPerSku} L`;
		}
		return 'N/A';
	}

	getRow = (item) => {
		console.log("SalesReport - getRow");
		return (
			<View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, styles.rowBackground]}>
				<View style={[{ flex: 1 }]}>
					<Text numberOfLines={1}  style={[styles.rowItem, styles.leftMargin]}>{item.description}</Text>
				</View>
				<View style={[{ flex: .5 }]}>
					<Text style={[styles.rowItemCenter]}>{item.quantity}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItemCenter]}>{this.getItemLitersPerSku(item)}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItemCenter]}>{this.getItemTotalLiters(item)}</Text>
				</View>
				<View style ={[{width:20}]}/>

				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItemCenter]}>{this.getInventorySkuForDisplay(false, item)}</Text>
				</View>
				{this.getCurrentInventory(item)}
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItemCenter]}>{this.getTotalForSkuDisplay(item)}</Text>
				</View>
				<InventoryEdit
					type = "sku"
					skuToShow = {this.state.currentSkuEdit}
					sku = {item.sku}
					title = {item.description}
					quantity = {this.getInventorySkuForEdit(true, item)}
					cancelMethod = {this.onCancelEditCurrentSku.bind(this)}
					okMethod = {this.onOkEditCurrentSku.bind(this)}>
				</InventoryEdit>
			</View>
		);
	};
	getInventorySkuForEdit(currentPrev, item){
		let value = this.getInventorySkuForDisplay(currentPrev, item);
		if( value == '-') return "";
		else return value.toFixed(2);
	}
	onCancelEditCurrentSku(){
		this.setState({currentSkuEdit:""});
		this.setState({refresh: !this.state.refresh});
	}

	onOkEditCurrentSku( sku, newQuantity ){
		this.setState({currentSkuEdit:""});
		let update = null;
		if( newQuantity.trim().length > 0 ){
			update = parseInt(newQuantity);
		}
		if( !isNaN(update)) {
			for (let index = 0; index < this.props.inventoryData.inventory.currentProductSkus.length; index++) {
				if (this.props.inventoryData.inventory.currentProductSkus[index].sku === sku) {
					this.props.inventoryData.inventory.currentProductSkus[index].inventory = update;
					PosStorage.addOrUpdateInventoryItem(this.props.inventoryData.inventory, this.props.inventoryData.inventory.date);
					break;
				}
			}
			this.setState({ refresh: !this.state.refresh });
		}else{
			// TODO - Show alert
		}
	}




	showHeader = () => {
		return (
			<View
				style={[{ flex: 1, flexDirection: 'row', height: 50, alignItems: 'center' }, styles.headerBackground]}>
				<View style={[{ flex: 1 }]}>
					<Text style={[styles.headerItem, styles.leftMargin]}>SKU</Text>
				</View>
				<View style={[{ flex: .5 }]}>
					<Text style={[styles.headerItemCenter]}>{i18n.t('quantity')}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItemCenter]}>{i18n.t('liters-per-sku')}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItemCenter]}>{i18n.t('total-liters')}</Text>
				</View>
				<View style ={[{width:20}]}/>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItemCenter]}>{i18n.t('previous')}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItemCenter]}>{i18n.t('current')}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItemCenter]}>{i18n.t('delta-liters')}</Text>
				</View>
			</View>
		);
	};


	updateReport() {
		this.props.reportActions.GetInventoryReportData(this.startDate, this.endDate, this.props.products);
	}

	getCurrentInventory( item ){
		return (
			<View style={[{ flex: .7}]}>
				<TouchableHighlight
					style={styles.currentInventory}
					onPress= {() => this.displayEditCurrentSku( item.sku )}
					underlayColor='#18376A'>
					<Text style={[styles.currentInventoryText]}>{ this.getInventorySkuForDisplay(true, item)}</Text>
				</TouchableHighlight>
			</View>
		);
	}
	getInventorySkuForDisplay(currentPrev, item ){
		let inventoryArray = (currentPrev) ? this.props.inventoryData.inventory.currentProductSkus : this.props.inventoryData.inventory.previousProductSkus;
		for( let index = 0; index < inventoryArray.length; index ++ ){
			if( inventoryArray[index].sku === item.sku ){
				if( inventoryArray[index].inventory != null && !isNaN(inventoryArray[index].inventory)){
					return inventoryArray[index].inventory;
				}
				break;
			}
		}
		return "-";		// No data
	}

	getTotalForSkuDisplay( item ) {
		if (!item.litersPerSku || item.litersPerSku === 'N/A') return '-';
		let current = this.getInventorySkuForDisplay(true, item);
		if (current == '-') return '-';
		let previous = this.getInventorySkuForDisplay(false, item);
		if (previous == '-') return '-';
		return `${((current - previous) * item.litersPerSku).toFixed(2)} L`;
	}

	getTotalInventory(){
		try {
			let result = 0;
			let valid = false;
			for (let index = 0; index < this.props.inventoryData.salesAndProducts.salesItems.length; index++) {
				let inventoryItem = this.getTotalForSkuDisplay(this.props.inventoryData.salesAndProducts.salesItems[index]);
				if (inventoryItem != '-') {
					valid = true;
					result += parseFloat(inventoryItem);
				}
			}
			if (valid) {
				return result.toFixed(2) + ' L';
			} else {
				return '-';
			}
		}catch( error ){
			console.log(JSON.stringify(this.props.inventoryData));
			console.log("getTotalInventory " + error.message);
		}
		return '-';
	}
	getOutput(){
		let sales = 0;
		let inventory = 0;
		let totalSales = this.getTotalLiters();
		let getTotalInventory = this.getTotalInventory();
		if(totalSales == '-' && getTotalInventory == '-' ){
			return '-';
		}
		if( totalSales != '-'){
			sales = parseFloat(totalSales);
		}
		if( getTotalInventory != '-'){
			inventory = parseFloat(getTotalInventory);
		}
		return (sales + inventory).toFixed(2) + ' L';
	}

	displayEditCurrentSku(sku ){
		this.setState({currentSkuEdit:sku});
		this.setState({refresh: !this.state.refresh});
	}

	getCurrentMeter( value ){
		return (
			<View style={[{ flex: .33}]}>
				<TouchableHighlight
					style={styles.currentInventory}
					onPress={() => {this.displayCurrentMeter()}}
					underlayColor='#18376A'>
					<Text style={[styles.currentInventoryText]}>{this.getInventoryMeterForDisplay(true)}</Text>
				</TouchableHighlight>
			</View>
		);
	}

	getInventoryMeterForDisplay(currentPrev ){
		let meter = (currentPrev) ? this.props.inventoryData.inventory.currentMeter : this.props.inventoryData.inventory.previousMeter;
		if( meter != null && !isNaN(meter)){
			return meter.toFixed(2) + ' L';
		}else{
			return "-";		// No data
		}
	}
	getTotalProduction(){
		let current = this.getInventoryMeterForDisplay(true);
		let previous = this.getInventoryMeterForDisplay(false);
		if( current == '-' || previous == '-'){
			return '-'
		}else{
			return (parseFloat(current) - parseFloat(previous)).toFixed(2) + ' L';
		}
	}
	getWastage(){
		let totalProduction = this.getTotalProduction();
		let output = this.getOutput();
		if( totalProduction == '-' || output == '-'){
			return 'N/A'
		}else{
			if( parseFloat(totalProduction)  == 0 ){
				return 'N/A'
			}
			let wastage = ((parseFloat(totalProduction) - parseFloat(output))/parseFloat(totalProduction) *100);
			if( isNaN( wastage)){
				return 'N/A'
			}else{
				return wastage.toFixed(2) + ' %';
			}
		}


	}
	displayCurrentMeter(){
		this.setState({currentMeterVisible:true});

	}
	onCancelCurrentMeter(){
		this.setState({currentMeterVisible:false});

	}
	onOkCurrentMeter( sku, newQuantity){
		this.setState({currentMeterVisible:false});
		let update = null;
		if( newQuantity.trim().length > 0 ){
			update = parseFloat(newQuantity);
		}
		if( !isNaN(update)) {
			this.props.inventoryData.inventory.currentMeter = update;
			PosStorage.addOrUpdateInventoryItem(this.props.inventoryData.inventory, this.props.inventoryData.inventory.date);
			this.setState({ refresh: !this.state.refresh });
		}else{
			// TODO - Show alert
		}

	}

}


function mapStateToProps(state, props) {
	return {
		inventoryData: state.reportReducer.inventoryData,
		products: state.productReducer.products,
		dateFilter: state.reportReducer.dateFilter,
		reportType: state.reportReducer.reportType
	};
}

function mapDispatchToProps(dispatch) {
	return {reportActions:bindActionCreators(reportActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryReport);

const styles = StyleSheet.create({

	headerItem:{
		fontWeight:"bold",
		fontSize:18
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
		borderRightWidth:1,
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
		height: 25,
		flexDirection:'row',

	},
	leftHeader: {
		flexDirection:'row',
		flex:.62,
		alignItems:'center'

	},
	rightHeader: {
		flexDirection:'row-reverse',
		flex:.38,
		alignItems:'center',
		justifyContent:'flex-end'

	},
	titleContent: {
		backgroundColor: 'white',
		flexDirection:'row',
		justifyContent: 'space-between',
	},
	leftContent: {
		flexDirection:'row',
		flex:.6,
		alignItems:'center'

	},
	rightContent: {
		flexDirection:'row-reverse',
		flex:.38,
		alignItems:'center'

	},

	currentInventory:{
		marginRight:2,
		marginLeft:2,
		// marginTop:2,
		// paddingTop:2,
		// paddingBottom:2,
		backgroundColor:'#2858a7',
		borderRadius:5,
		borderWidth: 1,
		borderColor: '#fff'
	},
	currentInventoryText:{
		fontSize:16,
		color:'#fff',
		textAlign:'center',
	},
	production:{
		fontWeight:"bold",
		fontSize:24,
	},
	editInventory: {
		height:300,
		width:500,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		backgroundColor:'white',
		borderColor:"#2858a7",
		borderWidth:5,
		borderRadius:10
	},
	buttonText:{
		fontWeight:'bold',
		fontSize:28,
		color:'white',
		textAlign:'center',
		// width:180
	},
	inventoryInput : {
		textAlign: 'left',
		height: 50,
		width: 100,
		borderWidth: 2,
		fontSize: 20,
		borderColor: '#404040',
	}
});
