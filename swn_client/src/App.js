import React, { Component } from 'react';
import './App.css';
import './css/SeamaNav.css'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
	authActions,
	kioskActions,
	volumeActions,
	customerActions
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
		let self = this;
		window.addEventListener('resize', this.resize)
		this.unlisten = history.listen((location, action) => {
			console.log("on route change", self);
			switch( location.pathname ){
				case "/":
					if( ! this.props.volume.loaded && this.props.kiosk.selectedKiosk && this.props.kiosk.selectedKiosk.kioskID  ){
						this.props.volumeActions.fetchVolume(this.props.kiosk.selectedKiosk);
					}
					break;
				case "/Demographics":

					if( ! this.props.customer.loaded && this.props.kiosk.selectedKiosk && this.props.kiosk.selectedKiosk.kioskID ) {
						this.props.customerActions.fetchCustomer(this.props.kiosk.selectedKiosk);
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
		customerActions: bindActionCreators(customerActions, dispatch)
	};
}

function mapStateToProps(state) {
	return {
		kiosk: state.kiosk,
		volume: state.volume,
		customer: state.customer,
		auth: state.auth
	};
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
