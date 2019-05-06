import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableHighlight,
	TextInput,
	StyleSheet,
	Modal,
	Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Events from 'react-native-simple-events';

import * as ToolbarActions from '../../actions/ToolBarActions';
import ModalDropdown from 'react-native-modal-dropdown';
import PosStorage from '../../database/PosStorage';
import * as CustomerActions from '../../actions/CustomerActions';

import i18n from '../../app/i18n';

class CustomerProperty extends Component {
	constructor(props) {
		super(props);
		this.state = { propertyText: this.props.valueFn(this.props.parent) };
	}

	render() {
		return (
			<View
				style={[
					{ marginTop: this.props.marginTop },
					styles.inputContainer
				]}>
				<TextInput
					ref={this.props.reference}
					style={[styles.inputText]}
					underlineColorAndroid="transparent"
					placeholder={this.props.placeHolder}
					value={this.state.propertyText}
					keyboardType={this.props.kbType}
					onChangeText={this.onChangeText}
				/>
			</View>
		);
	}
	onChangeText = text => {
		if (this.props.reference === 'customerFrequency') {
			if (/^\d+$/.test(text)) {
				this.setState({
					propertyText: text
				});
			} else {
				alert('Digits only please');
			}
		} else {
			this.setState({ propertyText: text });
		}
	};
}

class CustomerEdit extends Component {
	constructor(props) {
		super(props);
		this.state = { isEditInProgress: false };
		this.phone = React.createRef();
		this.name = React.createRef();
		this.address = React.createRef();
		this.customerChannel = React.createRef();
		this.customerType = React.createRef();
		this.frequency = React.createRef();
		this.salesChannels = PosStorage.getSalesChannelsForDisplay();
		this.channelOptions = this.salesChannels.map(channel => {
			return channel.displayName;
		});
		this.customerTypes = PosStorage.getCustomerTypesForDisplay();
		this.customerTypeOptions = this.customerTypes.map(customerType => {
			return customerType.displayName;
		});
		this.customerTypesIndicies = this.customerTypes.map(customerType => {
			return customerType.id;
		});
	}
	componentDidMount() {
		console.log('CustomerEdit = Mounted');
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							flexDirection: 'row',
							flex: 1,
							alignItems: 'center',
							height: 80
						}}>
						<Text style={[styles.headerText]}>
							{this.getHeaderText()}
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'row-reverse',
							flex: 1,
							alignItems: 'center',
							height: 80
						}}>
						<TouchableHighlight onPress={() => this.onCancelEdit()}>
							<Image
								source={require('../../images/icons8-cancel-50.png')}
								style={{ marginRight: 100 }}
							/>
						</TouchableHighlight>
						{/*<Image source={require('../../images/icons8-cancel-50.png')} />;*/}
					</View>
				</View>

				<KeyboardAwareScrollView
					style={{ flex: 1 }}
					resetScrollToCoords={{ x: 0, y: 0 }}
					scrollEnabled={false}>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<CustomerProperty
							reference="customerNumber"
							marginTop={0}
							placeHolder={i18n.t('telephone-number')}
							parent={this}
							kbType="phone-pad"
							valueFn={this.getTelephoneNumber}
							ref={this.phone}
						/>
						<CustomerProperty
							reference="customerName"
							marginTop="1%"
							placeHolder={i18n.t('account-name')}
							parent={this}
							kbType="default"
							valueFn={this.getName}
							ref={this.name}
						/>
						<CustomerProperty
							reference="customerAddress"
							marginTop="1%"
							placeHolder={i18n.t('address')}
							parent={this}
							kbType="default"
							valueFn={this.getAddress}
							ref={this.address}
						/>
						<CustomerProperty
							reference="customerFrequency"
							marginTop="1%"
							placeHolder="frequency"
							parent={this}
							kbType="numeric"
							valueFn={this.getFrequency}
							ref={this.frequency}
						/>

						<View
							style={[
								{
									marginTop: '1%',
									flexDirection: 'row',
									alignItems: 'center'
								}
							]}>
							<ModalDropdown
								style={{ width: 250 }}
								textStyle={styles.dropdownText}
								dropdownTextStyle={[
									styles.dropdownText,
									{ width: 250 }
								]}
								dropdownStyle={{
									borderColor: 'black',
									borderWidth: 2
								}}
								ref={this.customerChannel}
								defaultValue={this.getDefaultChannelValue()}
								defaultIndex={this.getDefaultChannelIndex()}
								options={this.channelOptions}
							/>
							<TouchableHighlight
								underlayColor="#c0c0c0"
								onPress={() => this.onShowChannel()}>
								<Text style={{ fontSize: 40 }}>{'\u2B07'}</Text>
							</TouchableHighlight>
							<View style={{ width: 50 }} />
							<ModalDropdown
								style={{ width: 250 }}
								textStyle={styles.dropdownText}
								dropdownTextStyle={[
									styles.dropdownText,
									{ width: 250 }
								]}
								dropdownStyle={{
									borderColor: 'black',
									borderWidth: 2
								}}
								ref={this.customerType}
								defaultValue={this.getDefaultTypeValue()}
								defaultIndex={this.getDefaultTypeIndex()}
								options={this.customerTypeOptions}
							/>
							<TouchableHighlight
								underlayColor="#c0c0c0"
								onPress={() => this.onShowCustomerType()}>
								<Text style={{ fontSize: 40 }}>{'\u2B07'}</Text>
							</TouchableHighlight>
						</View>
						<View style={styles.submit}>
							<View
								style={{
									justifyContent: 'center',
									height: 90,
									width: '30%',
									alignItems: 'center'
								}}>
								<TouchableHighlight
									underlayColor="#c0c0c0"
									onPress={() => this.onEdit()}>
									<Text
										style={[
											{
												paddingTop: 30,
												paddingBottom: 30,
												width: 300
											},
											styles.buttonText
										]}>
										{this.getSubmitText()}
									</Text>
								</TouchableHighlight>
							</View>
						</View>

						<Modal
							visible={this.state.isEditInProgress}
							backdropColor={'red'}
							transparent={true}
							onRequestClose={this.closeHandler}>
							{this.showEditInProgress()}
						</Modal>
					</View>
				</KeyboardAwareScrollView>
			</View>
		);
	}
	getTelephoneNumber(me) {
		if (me.props.isEdit) {
			return me.props.selectedCustomer.phoneNumber;
		} else {
			return '';
		}
	}
	getName(me) {
		if (me.props.isEdit) {
			return me.props.selectedCustomer.name;
		} else {
			return '';
		}
	}
	getAddress(me) {
		if (me.props.isEdit) {
			return me.props.selectedCustomer.address;
		} else {
			return '';
		}
	}
	getFrequency(me) {
		if (me.props.isEdit) {
			return me.props.selectedCustomer.frequency;
		} else {
			return '';
		}
	}

	getDefaultChannelValue() {
		if (this.props.isEdit) {
			for (let i = 0; i < this.salesChannels.length; i++) {
				if (
					this.salesChannels[i].id ==
					this.props.selectedCustomer.salesChannelId
				) {
					return this.salesChannels[i].displayName;
				}
			}
		}
		return i18n.t('sales-channel');
	}

	getDefaultTypeValue() {
		if (this.props.isEdit) {
			for (let i = 0; i < this.customerTypes.length; i++) {
				if (
					this.customerTypes[i].id ==
					this.props.selectedCustomer.customerTypeId
				) {
					return this.customerTypes[i].displayName;
				}
			}
		}
		return i18n.t('customer-type');
	}

	getDefaultChannelIndex() {
		if (this.props.isEdit) {
			const salesChannels = PosStorage.getSalesChannels();
			for (let i = 0; i < salesChannels.length; i++) {
				if (
					salesChannels[i].id ==
					this.props.selectedCustomer.salesChannelId
				) {
					return i;
				}
			}
		}
		return -1;
	}

	getDefaultTypeIndex() {
		if (this.props.isEdit) {
			for (let i = 0; i < this.customerTypesIndicies.length; i++) {
				if (
					this.customerTypesIndicies[i] ==
					this.props.selectedCustomer.customerTypeId
				) {
					return i;
				}
			}
		}
		return -1;
	}

	getHeaderText() {
		return this.props.isEdit
			? i18n.t('edit-customer')
			: i18n.t('new-customer');
	}
	getSubmitText() {
		return this.props.isEdit
			? i18n.t('update-customer')
			: i18n.t('create-customer');
	}
	onCancelEdit() {
		this.props.toolbarActions.ShowScreen('main');
		var that = this;
		setTimeout(() => {
			Events.trigger('ScrollCustomerTo', {
				customer: that.props.selectedCustomer
			});
		}, 10);
	}
	closeHandler() {
		this.setState({ isEditInProgress: false });
		this.onCancelEdit();
	}

	isNumeric(text){
		return /^\d+$/.test(text);
	}

	onEdit() {
		let salesChannelId = -1;
		let customerTypeId = -1;
		if (this._textIsEmpty(this.phone.current.state.propertyText)) {
			this.phone.current.refs.customerNumber.focus();
			return;
		}
		if (this._textIsEmpty(this.name.current.state.propertyText)) {
			this.name.current.refs.customerName.focus();
			return;
		}
		if (this._textIsEmpty(this.address.current.state.propertyText)) {
			this.address.current.refs.customerAddress.focus();
			return;
		}
		if (this.customerChannel.current.state.selectedIndex === -1) {
			this.customerChannel.current.show();
			return;
		}
		if (this._textIsEmpty(this.frequency.current.state.propertyText)) {
			this.frequency.current.refs.customerFrequency.focus();
			return;
		} else {
			salesChannelId = this.salesChannels[
				this.customerChannel.current.state.selectedIndex
			].id;
		}
		if (this.customerType.current.state.selectedIndex === -1) {
			this.customerType.current.show();
			return;
		} else {
			customerTypeId = this.customerTypes[
				this.customerType.current.state.selectedIndex
			].id;
		}
		if (this.props.isEdit) {
			PosStorage.updateCustomer(
				this.props.selectedCustomer,
				this.phone.current.state.propertyText,
				this.name.current.state.propertyText,
				this.address.current.state.propertyText,
				salesChannelId,
				customerTypeId,
				this.frequency.current.state.propertyText
			);
		} else {
			let newCustomer = PosStorage.createCustomer(
				this.phone.current.state.propertyText,
				this.name.current.state.propertyText,
				this.address.current.state.propertyText,
				this.props.settings.siteId,
				salesChannelId,
				customerTypeId,
				this.frequency.current.state.propertyText
			);
			this.props.customerActions.setCustomers(PosStorage.getCustomers());
			this.props.customerActions.CustomerSelected(newCustomer);
		}

		this.setState({ isEditInProgress: true });
	}
	onShowChannel() {
		this.customerChannel.current.show();
	}
	onShowCustomerType() {
		this.customerType.current.show();
	}

	_textIsEmpty(txt) {
		if (txt === null || txt.length === 0) {
			return true;
		}
		return false;
	}
	showEditInProgress() {
		let that = this;
		if (this.state.isEditInProgress) {
			setTimeout(() => {
				that.closeHandler();
			}, 1000);
		}
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				<View style={styles.updating}>
					<Text style={{ fontSize: 24, fontWeight: 'bold' }}>
						{i18n.t('updating')}
					</Text>
				</View>
			</View>
		);
	}
}

CustomerEdit.propTypes = {
	isEdit: PropTypes.bool.isRequired,
	toolbarActions: PropTypes.object.isRequired,
	customerActions: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
	return {
		selectedCustomer: state.customerReducer.selectedCustomer,
		settings: state.settingsReducer.settings
	};
}
function mapDispatchToProps(dispatch) {
	return {
		toolbarActions: bindActionCreators(ToolbarActions, dispatch),
		customerActions: bindActionCreators(CustomerActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CustomerEdit);

const styles = StyleSheet.create({
	headerText: {
		fontSize: 24,
		color: 'black',
		marginLeft: 100
	},
	submit: {
		backgroundColor: '#2858a7',
		borderRadius: 20,
		marginTop: '1%'
	},
	inputContainer: {
		borderWidth: 2,
		borderRadius: 10,
		borderColor: '#2858a7',
		backgroundColor: 'white'
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: 28,
		color: 'white',
		textAlign: 'center',
		width: 300
	},
	inputText: {
		fontSize: 24,
		alignSelf: 'center',
		backgroundColor: 'white',
		width: 400,
		margin: 5
	},
	dropdownText: {
		fontSize: 24
	},

	updating: {
		height: 100,
		width: 500,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ABC1DE',
		borderColor: '#2858a7',
		borderWidth: 5,
		borderRadius: 10
	}
});
