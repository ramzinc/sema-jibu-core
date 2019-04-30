import React, {Component}  from "react";
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Modal, ImageBackground, Image } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as ToolbarActions from "../actions/ToolBarActions";
import PosStorage from "../database/PosStorage";
import Synchronization from "../services/Synchronization";

import i18n from '../app/i18n';


class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoginComplete:false,
			username:"",
			password:"",
			invalidCredentials:false
		};

	}
	componentDidMount() {
		console.log("Login = Mounted");
	}

	render() {
		return (
			<View style={{flex:1}}>
				<ImageBackground
					source={require('../images/swe-login.jpg')}
					resizeMode ='cover'
					style = {styles.imgBackground}>
					<KeyboardAwareScrollView
						style={{flex:1}}
						resetScrollToCoords={{ x: 0, y: 0 }}
						scrollEnabled={false}>
						<View style ={{flex:1, alignItems:'center' }}>
								<View style ={{marginTop:'1.5%'}}>
									<Image source={require('../images/swe-logo.png')} resizeMode ='stretch' style={styles.logoSize}/>
								</View>
								<View style ={[{marginTop:'1.5%'}, styles.inputContainer]}>
									<TextInput
										style = {[styles.inputText, ]}
										underlineColorAndroid='transparent'
										placeholder = {i18n.t('username-or-email-placeholder')}
										value = {this.state.username}
										onChangeText={(text) => {this.setState({username:text}); this.setState({ invalidCredentials: false })}}/>

								</View>
								<View style ={[{marginTop:'1.5%'}, styles.inputContainer]}>
									<TextInput
										style = {[styles.inputText, ]}
										underlineColorAndroid='transparent'
										secureTextEntry = {true}
										placeholder = {i18n.t('password-placeholder')}
										value = {this.state.password}
										onChangeText={(text) => {this.setState({password:text}); this.setState({ invalidCredentials: false })}}/>

								</View>
								{this.ShowInvalidCredentials()}
								<View style={styles.signIn}>
									<View style={{justifyContent:'center', height:100, width:'30%', alignItems:'center'}}>
										<TouchableHighlight underlayColor = '#c0c0c0'
															onPress={() => this.onLogin()}>
											<Text style={ [ {paddingTop:30, paddingBottom:30, width:300 }, styles.buttonText]}>{i18n.t('sign-in')}</Text>
										</TouchableHighlight>
									</View>
								</View>
								<Modal visible = {this.state.isLoginComplete}
									   backdropColor={'red'}
									   transparent ={true}
									   onRequestClose ={this.closeHandler}>
									{this.ShowLoggingIn()}
								</Modal>
						</View>

					</KeyboardAwareScrollView>
				</ImageBackground>
			</View>

		);
	}
	closeHandler= ()=>{
		this.setState( {isLoginComplete:false} );
	};

	onLogin= ()=>{
		let settings = PosStorage.getSettings();
		if( settings && settings.user.length > 0 && settings.password.length > 0 ){
			if( settings.user.toLowerCase() === this.state.username.toLowerCase() &&
				settings.password.toLowerCase() === this.state.password.toLowerCase()){
				this.setState({ isLoginComplete: true });
				Synchronization.scheduleSync( );
			}else{
				this.setState({invalidCredentials:true})
			}

		}else {
			this.setState({invalidCredentials:true})
		}
	};
	ShowLoggingIn = () =>{
		let that = this;
		if( this.state.isLoginComplete ) {
			setTimeout(() => {
				that.closeHandler();
				that.props.toolbarActions.SetLoggedIn(true);
			}, 500);
		}
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}>

				<View style={styles.loggingIn}>
					<Text style={{fontSize:24, fontWeight:'bold'}}>{i18n.t('signing-in')}</Text>
				</View>
			</View>
		);
	};
	ShowInvalidCredentials = () => {
		if (this.state.invalidCredentials) {
			return (
				<View style={[{ marginTop: 30 }, styles.errorContainer]}>
					<Text style={styles.inputText}>{i18n.t('invalid-credentials')}</Text>
				</View>

			)
		}else{
			return null;
		}
	}
}



function mapStateToProps(state, props) {
	return {};
}
function mapDispatchToProps(dispatch) {
	return {
		toolbarActions:bindActionCreators(ToolbarActions, dispatch)
	};
}

export default  connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
	imgBackground: {
		width: '100%',
		height: '100%',
		flex: 1
	},
	signIn: {
		backgroundColor:"#2858a7",
		borderRadius:20,
		marginTop:'1.5%',

	},
	inputContainer:{
		borderWidth:5,
		borderRadius:15,
		borderColor:"#2858a7",
		backgroundColor:'white'
	},
	errorContainer:{
		borderWidth:4,
		borderColor:"#a72828",
		backgroundColor:'white'
	},

	inputText:{
		fontSize:24,
		alignSelf:'center',
		backgroundColor:'white',
		width:400,
		margin:5

	},
	buttonText:{
		fontWeight:'bold',
		fontSize:28,
		color:'white',
		textAlign:'center',
		width:300
	},
	loggingIn: {
		height:100,
		width:500,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#ABC1DE',
		borderColor:"#2858a7",
		borderWidth:5,
		borderRadius:10
	},
	logoSize: {
		width: 200,
		height: 200,
	},



});

