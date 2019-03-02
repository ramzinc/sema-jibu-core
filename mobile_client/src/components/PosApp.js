import React, { Component } from "react";
import {
	StyleSheet,
	View,
	NetInfo,
} from 'react-native';

import Toolbar from './Toolbar';
import CustomerViews from './customers/CustomerViews';
import CustomerBar from "./customers/CustomerBar";
import OrderView from "./orders/OrderView";
import Login from './Login';
import CustomerEdit from './customers/CustomerEdit';
import Settings from './Settings';

import { bindActionCreators } from 'redux';

import { connect } from "react-redux";
import * as CustomerActions from '../actions/CustomerActions';
import * as NetworkActions from '../actions/NetworkActions';
import * as SettingsActions from '../actions/SettingsActions';
import * as ProductActions from '../actions/ProductActions';
import * as ToolbarActions from "../actions/ToolBarActions";
import * as receiptActions from "../actions/ReceiptActions";

import PosStorage from "../database/PosStorage";
import Synchronization from "../services/Synchronization";
import SiteReport from "./reports/SiteReport";
import Communications from "../services/Communications";
import Events from "react-native-simple-events";

console.ignoredYellowBox = ['Warning: isMounted', 'Setting a timer'];

class PosApp extends Component {
	constructor(props) {
		super(props);

		this.state = {
			synchronization: { productsLoaded: false },
			isConnected: false
		};
		this.posStorage = PosStorage;
	}
	componentDidMount() {
		console.log("PosApp - componentDidMount enter");
		this.posStorage.initialize(false).then((isInitialized) => {
			console.log("PosApp - componentDidMount - Storage initialized");

			let settings = this.posStorage.getSettings();
			this.props.settingsActions.setSettings(settings);
			// this.props.settingsActions.setConfiguration(configuration);

			Communications.initialize(settings.semaUrl, settings.site, settings.user, settings.password);
			Communications.setToken(settings.token);
			Communications.setSiteId(settings.siteId);

			// let timeout = 200;
			if (isInitialized) {
				// Data already configured
				this.props.customerActions.setCustomers(this.posStorage.getCustomers());
				this.props.productActions.setProducts(this.posStorage.getProducts());
				this.props.receiptActions.setRemoteReceipts(this.posStorage.getRemoteReceipts());
			}
			// if (isInitialized && this.posStorage.getCustomers().length > 0) {
			// 	// Data already configured
			// 	timeout = 20000;	// First sync after a bit
			// }

			Synchronization.initialize(
				PosStorage.getLastCustomerSync(),
				PosStorage.getLastProductSync(),
				PosStorage.getLastSalesSync());
			Synchronization.setConnected(this.props.network.isNWConnected);

			// Determine the startup screen as follows:
			// If the settings contain url, site, username, password, token and customerTypes, proceed to main screen
			// If the settings contain url, site, username, password, customerTypes but NOT token, proceed to login screen, (No token => user has logged out)
			// Otherwise proceed to the settings screen.
			// Note: Without customerTypes. Customers can't be created since Customer creation requires both salesChannelIds AND customerTypes
			if (this.isLoginComplete()) {
				console.log("PosApp - Auto login - All settings exist");
				this.props.toolbarActions.SetLoggedIn(true);
				this.props.toolbarActions.ShowScreen("main");
				console.log("PosApp - starting synchronization");
				Synchronization.scheduleSync();
			}
			//Making setting page as Main Page
			// else if (this.isSettingsComplete()) {
			// 	console.log("PosApp - login required - No Token");
			// 	this.props.toolbarActions.SetLoggedIn(false);
			// }

			else {
				console.log("PosApp - Settings not complete");
				this.props.toolbarActions.SetLoggedIn(true);	// So that the login screen doesn't show
				this.props.toolbarActions.ShowScreen("settings");

			}

		});
		NetInfo.isConnected.fetch().then(isConnected => {
			console.log('Network is ' + (isConnected ? 'online' : 'offline'));
			this.props.networkActions.NetworkConnection(isConnected);
			Synchronization.setConnected(isConnected);
		});
		NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
		Events.on('CustomersUpdated', 'customerUpdate1', this.onCustomersUpdated.bind(this));
		Events.on('ProductsUpdated', 'productsUpdate1', this.onProductsUpdated.bind(this));
		Events.on('SalesChannelsUpdated', 'SalesChannelsUpdated1', this.onSalesChannelUpdated.bind(this));
		Events.on('UILanguageUpdated', 'UILanguageUpdated1', this.onLanguageUpdated.bind(this));
		Events.on('ReceiptsFetched', 'ReceiptsFetched1', this.onReceiptsFetched.bind(this));
		Events.on('NewSaleAdded', 'NewSaleAdded1', this.onNewSaleAdded.bind(this));
		Events.on('RemoveLocalReceipt', 'RemoveLocalReceipt1', this.onRemoveLocalReceipt.bind(this));
		Events.on('ClearLoggedSales', 'ClearLoggedSales1', this.onClearLoggedSales.bind(this));
		console.log("PosApp = Mounted-Done");

	}
	componentWillUnmount() {
		Events.rm('CustomersUpdated', 'customerUpdate1');
		Events.rm('ProductsUpdated', 'productsUpdate1');
		Events.rm('SalesChannelsUpdated', 'SalesChannelsUpdated1');
		Events.rm('UILanguageUpdated', 'UILanguageUpdated1');
		Events.rm('ReceiptsFetched', 'ReceiptsFetched1');
		Events.rm('NewSaleAdded', 'NewSaleAdded1');
		Events.rm('RemoveLocalReceipt', 'RemoveLocalReceipt1');
		Events.rm('ClearLoggedSales', 'ClearLoggedSales1');
		NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
	}

	onRemoveLocalReceipt(saleId) {
		this.props.receiptActions.removeLocalReceipt(saleId);
	}

	onClearLoggedSales() {
		this.props.receiptActions.clearLoggedReceipts();
	}

	onNewSaleAdded(receiptData) {
		const newReceipt = {
			active: 1,
			id: receiptData.sale.id,
			key: receiptData.key,
			created_at: receiptData.sale.createdDate,
			customer_account: this.getCustomer(receiptData.sale.customerId),
			receipt_line_items: this.getProducts(receiptData.sale.products),
			isLocal: true,
			amount_loan: receiptData.sale.amountLoan
		};

		this.props.receiptActions.addRemoteReceipt(newReceipt);
		PosStorage.logReceipt(newReceipt);
	}

	getProducts(products) {
        return products.map(product => {
			let newProduct = {};

			newProduct.id = product.productId;
			newProduct.price_total = product.priceTotal;
			newProduct.quantity = product.quantity;
			newProduct.product = this.getProduct(product.productId);
            newProduct.active = 1;
            return newProduct;
        })
    }

    getProduct(productId) {
        return this.props.products.reduce((final, product) => {
			if (product.productId === productId) return product;
			return final;
        }, {});
	}

	getCustomer(customerId) {
        return this.props.customers.reduce((final, customer) => {
			if (customer.customerId === customerId) return customer;
			return final;
		}, {});
    }

	onCustomersUpdated = () => {
		this.props.customerActions.setCustomers(this.posStorage.getCustomers());
	};

	onReceiptsFetched(receipts) {
		this.props.receiptActions.setRemoteReceipts(receipts);
	}

	onProductsUpdated = () => {
		this.props.productActions.setProducts(this.posStorage.getProducts());
	};

	onSalesChannelUpdated() {
		console.log('Update sales channels bar');
		CustomerViews.buildNavigator().then(() => {
			this.forceUpdate();
		});
	}

	onLanguageUpdated() {
		console.log('New UI language set - Update sales channels bar');
		CustomerViews.buildNavigator().then(() => {
			this.forceUpdate();
		});
	}

	handleConnectivityChange = isConnected => {
		console.log("handleConnectivityChange: " + isConnected);
		this.props.networkActions.NetworkConnection(isConnected);
		Synchronization.setConnected(isConnected);
	};

	render() {
		return (this.getLoginOrHomeScreen());
	}



	getLoginOrHomeScreen() {
		console.log("getLoginOrHomeScreen - isLoggedIn: " + this.props.showScreen.isLoggedIn);
		if (!this.props.showScreen.isLoggedIn) {
			return (
				//<Login />
				<Settings />
			);
		} else {
			return (
				<View style={{ flex: 1 }}>
					<Toolbar />
					<ScreenSwitcher currentScreen={this.props.showScreen} Pos={this} />
				</View>

			);
		}
	}

	isLoginComplete() {
		let settings = this.posStorage.getSettings();
		console.log("isLoginComplete " + JSON.stringify(settings));
		if (settings.semaUrl.length > 0 &&
			settings.site.length > 0 &&
			settings.user.length > 0 &&
			settings.password.length > 0 &&
			settings.token.length > 0 &&
			this.posStorage.getCustomerTypes().length > 0) {
			console.log("All settings valid - Proceed to main screen");
			return true;
		}
		return false;
	}
	isSettingsComplete() {
		let settings = this.posStorage.getSettings();
		if (settings.semaUrl.length > 0 &&
			settings.site.length > 0 &&
			settings.user.length > 0 &&
			settings.password.length > 0 &&
			settings.token.length == 0 &&
			this.posStorage.getCustomerTypes().length > 0) {
			return true;
		}
		return false;
	}

}

class ViewSwitcher extends Component {
	render() {
		if (this.props.Pos.props.showView.showNewOrder) {
		    return (<OrderView />);
		} else {
			return (CustomerViews.navigator ? <CustomerViews.navigator screenProps={{ parent: this.props.Pos }} /> : null);
		}
	}
}

class ScreenSwitcher extends Component {
	render() {
		switch (this.props.currentScreen.screenToShow) {
			case 'settings':
				return (<Settings />);
			case 'report':
				return (<View style={{ flex: 1 }}>
					<SiteReport />
				</View>);
			case 'newCustomer':
				return (<CustomerEdit isEdit={false} />);
			case 'editCustomer':
				return (<CustomerEdit isEdit={true} />);
			case 'main':
				return (
					<View style={{ flex: 1 }}>
						<CustomerBar />
						<ViewSwitcher ref={this.viewSwitcherInstance} Pos={this.props.Pos} />
					</View>
				);
		}
	}
}

function mapStateToProps(state, props) {
	return {
		selectedCustomer: state.customerReducer.selectedCustomer,
		customers: state.customerReducer.customers,
		network: state.networkReducer.network,
		showView: state.customerBarReducer.showView,
		showScreen: state.toolBarReducer.showScreen,
		settings: state.settingsReducer.settings,
		receipts: state.receiptReducer.receipts,
		remoteReceipts: state.receiptReducer.remoteReceipts,
        products: state.productReducer.products
	};
}

function mapDispatchToProps(dispatch) {
	return {
		customerActions: bindActionCreators(CustomerActions, dispatch),
		productActions: bindActionCreators(ProductActions, dispatch),
		networkActions: bindActionCreators(NetworkActions, dispatch),
		toolbarActions: bindActionCreators(ToolbarActions, dispatch),
		settingsActions: bindActionCreators(SettingsActions, dispatch),
		receiptActions: bindActionCreators(receiptActions, dispatch)
	};
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(PosApp);



const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});
