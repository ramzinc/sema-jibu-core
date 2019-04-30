import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import CustomerList from "./CustomerList";
import PosStorage from "../../database/PosStorage";
import { capitalizeWord } from '../../services/Utilities';

import i18n from '../../app/i18n';

// Create a generic class for all sales channels
class SalesChannelScreen extends React.Component {
	constructor(props) {
		super(props);
		this.isFocused = false;
	}

	componentWillUpdate(){
		console.log(`${capitalizeWord(this.props.filter)}Screen -componentWillUpdate: Focused : ${this.props.navigation.isFocused()}`);
		if(this.props.navigation.isFocused() === true && this.isFocused === false){
			this.isFocused = true;
			console.log(`${capitalizeWord(this.props.filter)}Screen focus received`);
			this.props.screenProps.parent.props.customerActions.SearchCustomers("");
		} else if(this.props.navigation.isFocused() === false){
			this.isFocused = false;
		}
	}

	render() {
		return (
			<CustomerList filter={this.props.filter} customerInfo={this.props.screenProps}/>
		);
	}
}

// Turn CustomerViews into a class for finer controls
class CustomerViews {
	constructor() {
		this.views = {};
		this.navigator;
		this.buildNavigator();
	}

	buildNavigator() {
		return new Promise(resolve => {
			console.log("buildNavigator");
			this.views = {}
			PosStorage.loadSalesChannels()
				.then(savedSalesChannels => {
					this.createScreens(savedSalesChannels);
					this.navigator = createBottomTabNavigator(this.views, {
						tabBarOptions: {
						activeTintColor: '#F0F0F0',
						activeBackgroundColor: "#18376A",
						inactiveTintColor: '#000000',
						inactiveBackgroundColor: 'white',
						style: { borderTopColor: 'black', borderTopWidth: 3 },
						// style: {padding:0, margin:0, borderColor:'red', borderWidth:5, justifyContent: 'center', alignItems: 'center' },
						labelStyle: {
							fontSize: 18,
							padding: 12
						},
						tabStyle: { justifyContent: 'center', alignItems: 'center' },
						// tabStyle: {
						//     borderBottomColor: '#ebcccc',
						//     width: 100,
						//     height:600,
						//     // backgroundColor:"yellow"
						// }
						}
					});
					resolve();
	
				});
		});
	}

	// Create screens from sales channels
	createScreens(salesChannels = []) {
		let channelScreen;

		// Add the defaults
		salesChannels.unshift({name: i18n.t('all')});
		salesChannels.push({name: i18n.t('credit')});
		
		salesChannels.forEach(salesChannel => {
			channelScreen = props => (<SalesChannelScreen
												screenProps={props.screenProps}
												navigation={props.navigation}
												filter={salesChannel.name} />);

			this.views[`${capitalizeWord(salesChannel.name)}`] = {
				screen: channelScreen,
				navigationOptions: {
					tabBarLabel: capitalizeWord(salesChannel.name),
					tabBarOnPress: scene => {
						let output = `${capitalizeWord(salesChannel.name)}-Tab ${scene.navigation.state.routeName}`;
						console.log(output);
					}
				}
			}
		});
	}
}

export default new CustomerViews();