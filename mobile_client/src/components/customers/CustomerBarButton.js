import React from "react";
import { View, Button, StyleSheet, TouchableHighlight, Image} from 'react-native';
// import { withNavigation } from 'react-navigation';

class CustomerBarButton extends React.Component {
	render() {
		return (
			<View style={styles.Button}>
				<TouchableHighlight onPress={this.props.handler} disabled ={!this.props.enabled} underlayColor = '#c0c0c0'>
					<Image source={this.props.image}  resizeMode ='stretch'
						   style={[styles.iconSize, {marginLeft:15}, this.getOpacity(this.props.enabled)]}/>
				</TouchableHighlight>
			</View>
		);
	}
	getOpacity(enabled){
		return (enabled) ? {opacity:1} : {opacity:.3};
	}
}
// export default CustomerBarButton
export default CustomerBarButton;
const styles = StyleSheet.create({

	Button: {
		flex: .15,
		// alignSelf:'center',
		// height:70,
		marginLeft:15
	},
	iconSize: {
		width: 40,
		height: 40,
	},

});

