import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Navbar, Label, Nav,NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
	kioskActions,
	volumeActions,
	customerActions,
	salesActions,
	authActions,
	healthCheckActions,
	waterOperationsActions
} from 'actions';
import { withRouter } from 'react-router'
import SemaDateFilter from "./SemaDateFilter";

const menuStyle = {};


const LabelStyleLeft = {
	float:"left",
	background:"none",
	marginTop:"15px",
	fontSize:"14px",
	fontWeight: "normal"
};
const LabelStyleRight = {
	float:"right",
	background:"none",
	marginTop:"15px",
	fontSize:"14px",
	fontWeight: "normal"
};


class SemaToolbar extends Component {
	constructor(props, context) {
		super(props, context);
		console.log("SeamToolbar-constructor");

		this.handleSelectKiosk = this.handleSelectKiosk.bind(this);
		this.buildKioskMenuItems = this.buildKioskMenuItems.bind(this);
		this.logOut = this.logOut.bind(this);
		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), 0, 1 );
		this.state = {
			kiosks: "--Sites--",
		};
	}

	componentDidMount() {
		window.addEventListener('tokenExpired', this.handleExpiredEvent.bind(this));

	}
	handleExpiredEvent( event ){
		console.log("tokenExpired");
		this.props.authActions.logout();

	}
	componentWillUnmount(){
		window.removeEventListener('tokenExpired', this.handleExpiredEvent );
	}


	handleSelectKiosk(eventKey){
		console.log(eventKey, this.props.kiosk.kiosks[eventKey].name);

		this.setState({kiosks: this.props.kiosk.kiosks[eventKey].name});

		let kioskParams = {kioskID:this.props.kiosk.kiosks[eventKey].id};
		const previousKioskID = this.props.kiosk.selectedKiosk ?
			this.props.kiosk.selectedKiosk.kioskID :
			null;

		if(kioskParams.kioskID !== previousKioskID) {
			this.props.kioskActions.selectKiosk(kioskParams);
			this.loadActivePage(kioskParams );
		}
	};


	loadActivePage(kioskParams ){
		let params = {};
		if( kioskParams === null ){
			if( this.props.kiosk.selectedKiosk === null ){
				return;	// TODO - Shouldn't get here
			}
			params.kioskID = this.props.kiosk.selectedKiosk.kioskID;
		}else{
			params.kioskID = kioskParams.kioskID;
		}
		params.startDate = this.startDate;
		params.endDate = this.endDate;
		params.groupBy = this.props.dateFilter.groupType;
		console.log("--------------------PARAMS "+ JSON.stringify(params));
		this.props.volume.loaded = false;
		this.props.customer.loaded = false;
		this.props.sales.loaded = false;
		this.props.water.loaded = false;

		switch (this.props.location.pathname) {
			case "/Volumes":
				this.props.volumeActions.fetchVolume(params);
				break;
			case "/Demographics":
				this.props.customerActions.fetchCustomer(params);
				break;
			case "/Sales":
				this.props.salesActions.fetchSales(params);
				break;
			case "/":
				this.props.waterOperationsActions.fetchWaterOperations(params);
				break;
			default:
				console.log("Not implemented:", this.props.location.pathname);
		}

	}
	buildKioskMenuItems(){
		let menuItems = [];
		if( this.props.kiosk.kiosks){
			let keys = Object.keys(this.props.kiosk.kiosks);
			for( let i = 0; i < keys.length; i++ ){
				let kiosk = this.props.kiosk.kiosks[keys[i]];
				 menuItems.push(<MenuItem eventKey={keys[i]} key={keys[i]} style={menuStyle}>{kiosk.name}</MenuItem>);
			}
		}
		return menuItems;
	}


	logOut (){
		console.log("logout");
		this.props.authActions.logout();
	}

	render() {
		return (
			<div className="SeamaNavToolbar" id = "semaToolbar">
				{this.updateData()}
				<Navbar bsStyle="inverse" style={{marginBottom:"0px",
					borderRadius: 0}}>
					<Label style={LabelStyleLeft}>
						Version {this.props.Version}
					</Label>
					<Label style={LabelStyleLeft}>
						Site:
					</Label>
					<Nav >
						<NavDropdown title={this.state.kiosks} onSelect={this.handleSelectKiosk} id="basic-nav-dropdown" >
							{this.buildKioskMenuItems()}
						</NavDropdown>
					</Nav>
					<Label style={LabelStyleLeft}>
						Date Range:
					</Label>
					<SemaDateFilter/>

					<Label style={LabelStyleRight}> Server: {this.showServer()}</Label>
					<Label onClick={this.logOut} href="#" style={LabelStyleRight}>
						<a href="/">Logout</a>
					</Label>
					<Label style={LabelStyleRight}>
						{ `${this.props.currentUser.firstName}
						${this.props.currentUser.lastName}`}
					</Label>
				</Navbar>
			</div>
		);
	}
	showServer () {
		if (this.props.healthCheck.server === "Ok") {
			return this.props.healthCheck.version;
		}
		return this.props.healthCheck.server;
	}

	updateData(){
		console.log("SemaToolbar - updateData - New Range: ", this.props.dateFilter.startDate, "-", this.props.dateFilter.endDate );
		console.log("SemaToolbar - updateData - Old Range: ", this.startDate, "-", this.endDate );
		if( this.startDate !== this.props.dateFilter.startDate ||
			this.endDate !== this.props.dateFilter.endDate ){
			this.startDate = this.props.dateFilter.startDate;
			this.endDate = this.props.dateFilter.endDate;
			this.loadActivePage(null );
		}
	}
}

function mapStateToProps(state) {
	return {
		logState: state.auth.LogState,
		currentUser: state.auth.currentUser,
		healthCheck: state.healthCheck,
		kiosk:state.kiosk,
		sales:state.sales,
		water:state.waterOperations,
		volume:state.volume,
		customer:state.customer,
		dateFilter:state.dateFilter
	};
}

function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch),
		kioskActions: bindActionCreators(kioskActions, dispatch),
		volumeActions: bindActionCreators(volumeActions, dispatch),
		salesActions:bindActionCreators(salesActions, dispatch),
		waterOperationsActions:bindActionCreators(waterOperationsActions, dispatch),
		customerActions: bindActionCreators(customerActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaToolbar));

