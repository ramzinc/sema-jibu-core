import {
	RECEIVE_SALES,
	salesActions
} from 'actions'

export default function sales(state =init(), action) {
	let newState;
	switch (action.type) {
		case RECEIVE_SALES:
			newState = action.data;
			console.log('RECEIVE_SALES Action');
			return newState;
		default:
			return state;
	}
}


function init() {
	return salesActions.initializeSales()
}
