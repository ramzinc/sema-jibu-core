import {
	RECEIVE_CUSTOMER,
	customerActions
} from 'actions'

export default function volume(state =init(), action) {
	let newState;
	switch (action.type) {
		case RECEIVE_CUSTOMER:
			newState = action.data;
			console.log('RECEIVE_CUSTOMER Action');
			return newState;
		default:
			return state;
	}
}


function init() {
	return customerActions.initializeCustomer()
}
