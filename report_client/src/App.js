import React, { Component } from 'react';
import './App.css';
import './css/SeamaNav.css'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
	authActions,
	kioskActions,
	volumeActions,
	customerActions,
	salesActions,
	waterOperationsActions
} from 'actions';
import { history } from './utils';
import {
	Router
} from 'react-router-dom';
import {
	SemaContainer,
	SemaLogin
} from 'components';

class App extends Component {
	componentWillMount() {
		document.body.style.backgroundColor = "rgb(24,55,106)";
		let self = this;
		window.addEventListener('resize', this.resize)
		this.unlisten = history.listen((location, action) => {
			let params = {}
			params.startDate = this.props.dateFilter.startDate;
			params.endDate = this.props.dateFilter.endDate;
			params.groupBy = this.props.dateFilter.groupType;
			if( this.props.kiosk.selectedKiosk && this.props.kiosk.selectedKiosk.kioskID ){
				params.kioskID = this.props.kiosk.selectedKiosk.kioskID;
			}

			console.log("on route change", self);
			switch( location.pathname ){
				case "/":

					if( ! this.props.water.loaded && this.props.kiosk.selectedKiosk && this.props.kiosk.selectedKiosk.kioskID ) {
						this.props.waterOperationsActions.fetchWaterOperations(params);
					}
					break;
				case "/Volumes":
					if( ! this.props.volume.loaded && this.props.kiosk.selectedKiosk && this.props.kiosk.selectedKiosk.kioskID  ){
						this.props.volumeActions.fetchVolume(params);
					}
					break;
				case "/Demographics":

					if( ! this.props.customer.loaded && this.props.kiosk.selectedKiosk && this.props.kiosk.selectedKiosk.kioskID ) {
						this.props.customerActions.fetchCustomer(params);
					}
					break;
				case "/Sales":
					if( ! this.props.sales.loaded && this.props.kiosk.selectedKiosk && this.props.kiosk.selectedKiosk.kioskID ) {
						this.props.salesActions.fetchSales(params);
					}
					break;
				default:
					break;
			}
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize)
		this.unlisten();
	}
	resize = () => this.forceUpdate();

	render() {
		return (
			<Router history={ history }>
				{this.userIsValid() ?
					<SemaContainer /> :
					<SemaLogin />
				}
			</Router>
		);
	}
	userIsValid(){
		if( this.props.auth.currentUser ){
			let now = Date.now()/1000;
			if( now < this.props.auth.currentUser.exp ){
				console.log("Token is valid - Proceed to home page");
				return true;
			}
		}
		return false;
	}
}

function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authActions, dispatch),
		kioskActions: bindActionCreators(kioskActions, dispatch),
		volumeActions: bindActionCreators(volumeActions, dispatch),
		customerActions: bindActionCreators(customerActions, dispatch),
		salesActions: bindActionCreators(salesActions, dispatch),
		waterOperationsActions: bindActionCreators(waterOperationsActions, dispatch)
	};
}

function mapStateToProps(state) {
	return {
		kiosk: state.kiosk,
		volume: state.volume,
		customer: state.customer,
		sales:state.sales,
		water:state.waterOperations,
		dateFilter:state.dateFilter,
		auth: state.auth
	};
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
