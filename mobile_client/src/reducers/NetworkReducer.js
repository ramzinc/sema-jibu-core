
import { NETWORK_CONNECTION_CHANGE} from "../actions/NetworkActions"

let initialState = {network:{isNWConnected:true}};

const networkReducer = (state = initialState, action) => {
	let newState;
	console.log("networkReducer: " +action.type);
	switch (action.type) {
		case NETWORK_CONNECTION_CHANGE:
			newState = {network:{isNWConnected:action.data}};
			return newState;

		default:
			return state;
	}
};

export default networkReducer;

