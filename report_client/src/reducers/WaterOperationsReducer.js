import {
	RECEIVE_WATER_OPERATIONS,
	waterOperationsActions
} from 'actions'

export default function waterOperations(state =init(), action) {
	let newState;
	switch (action.type) {
		case RECEIVE_WATER_OPERATIONS:
			newState = action.data;
			console.log('RECEIVE_WATER_OPERATIONS Action');
			return newState;
		default:
			return state;
	}
}


function init() {
	return waterOperationsActions.initializeWaterOperations()
}
