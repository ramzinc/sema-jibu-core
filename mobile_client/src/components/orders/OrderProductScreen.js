import {createBottomTabNavigator} from "react-navigation";
import ProductListScreen from './ProductListScreen';

export default OrderProductScreen = createBottomTabNavigator({
	ProductList: {
		screen: ProductListScreen,
		navigationOptions: {
			tabBarVisible: false
		}
	}
});

