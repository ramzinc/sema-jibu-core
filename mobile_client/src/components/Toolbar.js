import React, {Component} from "react";
import {
    StyleSheet,
    View,
	Text,
	Image,
	TouchableHighlight
} from 'react-native';
import packageJson from '../../package.json';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as CustomerActions from "../actions/CustomerActions";
import * as ToolBarActions from "../actions/ToolBarActions";
import Communications from "../services/Communications";
import PosStorage from "../database/PosStorage";
import * as SettingsActions from "../actions/SettingsActions";

import i18n from '../app/i18n';

class Toolbar extends Component {
    render() {
        return (
        	<View style ={styles.toolbar}>
				<View style = {[styles.leftToolbar]}>
					<Image source={require('../images/swe-logo.png')} resizeMode ='stretch' style={styles.logoSize}/>
					<TouchableHighlight onPress={() => this.onVersion()}>
						<Text style = {[styles.text_style, {marginLeft:50}]}>{i18n.t('version')} {packageJson.version}</Text>
					</TouchableHighlight>
					<Text style = {[styles.text_style, {marginLeft:20}, this.getNetworkStyle()]}>{this.getNetworkState()}</Text>
					<Text style = {[styles.text_style, {marginLeft:30}]}>{i18n.t('site')}:</Text>
					<View style = {[styles.site_container, {marginLeft:20}]}>
						<Text style = {styles.site_text}>{this.props.settings.site}</Text>
					</View>
				</View>
				<View style = {[styles.rightToolbar]}>
					<TouchableHighlight onPress={() => this.onSettings()}>
						<Image source={require('../images/gear-icon.png')} resizeMode ='stretch' style={[styles.iconSize, {marginRight:20} ]}/>
					</TouchableHighlight>
					{this.getLogoutUI()}
					<Text style = {[styles.text_style,{marginRight:20} ]}>{this.props.settings.user}</Text>
					<TouchableHighlight onPress={() => this.onShowRemoteReport()}>
						{this.getReportOrMainImage()}
					</TouchableHighlight>
				</View>
			</View>
        );
    };

    getLogoutUI(){
		if( this.props.showScreen.screenToShow !== "settings" ){
			return(
				<TouchableHighlight onPress={() => this.onLogout()}>
					<Text style = {[styles.text_style,{marginRight:20}]}>{i18n.t('logout')}</Text>
				</TouchableHighlight>

			)
		}else{
			return null;
		}
	};

    getNetworkState  = () =>{
    	return this.props.network.isNWConnected ? i18n.t('online') : i18n.t('offline');
	};
	getNetworkStyle  = () =>{
		return this.props.network.isNWConnected ? {} : {color:'red'};
	};
	getReportOrMainImage =() =>{
		if( this.props.showScreen.screenToShow === "main") {
			return (
				<Image source={require('../images/report-icon.png')} resizeMode ='stretch' style={[styles.iconSize, {marginRight:20} ]}/>

			)
		}else{
			return (
				<Image source={require('../images/home-icon.png')} resizeMode ='stretch' style={[styles.iconSize, {marginRight:20} ]}/>
			)
		}
	};
	onShowRemoteReport = () =>{
        console.log("onShowRemoteReport");
        if(this.props.showScreen.screenToShow !== "settings" ){
			if( this.props.showScreen.screenToShow === "main") {
				this.props.toolbarActions.ShowScreen("report");
			}else{
				this.props.toolbarActions.ShowScreen("main");
			}
		}
    };
	onVersion= () =>{
		console.log("onVersion");
		Communications.getCustomers()
			.then( customers => {
				console.log("CUSTOMERS -" + JSON.stringify(customers));
			});

	};

	onLogout= () =>{
		//console.log("onLogout");
		//Redirecting to the Setting page
		this.props.toolbarActions.ShowScreen("settings");
		// //this.props.toolbarActions.SetLoggedIn(false);
		// //let settings = PosStorage.getSettings();

		// // Save with empty token - This will force username/password validation
		// PosStorage.saveSettings( settings.semaUrl, settings.site, settings.user, settings.password, settings.uiLanguage, "", settings.siteId );
		// this.props.settingsActions.setSettings(PosStorage.getSettings());
		//As we are not going to the Login, the reason no reason to disable the token
		//Communications.setToken("");

	};

	onSettings= () =>{
		console.log("onSettings");
		if( this.props.showScreen.screenToShow !== "settings") {
			this.props.toolbarActions.ShowScreen("settings");
		}
	};
}

function mapStateToProps(state, props) {
	return {
		network: state.networkReducer.network,
		showScreen: state.toolBarReducer.showScreen,
		settings:state.settingsReducer.settings
	};
}


function mapDispatchToProps(dispatch) {
	return {customerActions:bindActionCreators(CustomerActions, dispatch),
		settingsActions:bindActionCreators(SettingsActions, dispatch),
		toolbarActions:bindActionCreators(ToolBarActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#2858a7',
        height: 56,
		flexDirection:'row',


    },
	leftToolbar: {
		flexDirection:'row',
		flex:1,
		alignItems:'center'

	},
	rightToolbar: {
		flexDirection:'row-reverse',
		flex:1,
		alignItems:'center'

	},

	toolbar_old: {
		backgroundColor: '#2858a7',
		height: 56,
		alignSelf: 'stretch',

	},
	text_style: {
		color:'white',
		fontSize:20,
		fontWeight:'bold'
	},
	logoSize: {
		width: 50,
		height: 50,
		left:20
	},
	iconSize: {
		width: 40,
		height: 40,
		// right:20
	},
	site_container: {
		backgroundColor:'#E0E0E0',
		// width:200,
		height:42,
		justifyContent:'center',
		alignItems:'center',
		paddingLeft:20,
		paddingRight:20,
		borderRadius:5
	},
	site_text:{
		fontSize:18,
		fontWeight:'bold'

	}


});
