
import { SHOW_HIDE_CUSTOMERS} from "../actions/CustomerBarActions"

let initialState = { showView :{showCustomers:true, showNewOrder:false}};

const customerBarReducer = (state = initialState, action) => {
	let newState;
	console.log("customerBarReducer: " +action.type);
	switch (action.type) {
		case SHOW_HIDE_CUSTOMERS:
			if (action.data === 0){
				newState = { showView :{showCustomers:false, showNewOrder:true}};
			}else{
				newState = { showView :{showCustomers:true, showNewOrder:false}};
			}
			return newState;

		default:
			return state;
	}
};

export default customerBarReducer;

