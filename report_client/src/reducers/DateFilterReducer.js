import { SET_DATE_RANGE} from 'actions/ActionTypes';

export default function dateFilter(state = {startDate:new Date(), endDate:new Date()}, action) {
	let newState;
	switch (action.type) {
		case SET_DATE_RANGE:
			newState = action.dateRange;
			console.log('SET_DATE_RANGE Action');
			return newState;
		default:
			return state;
	}
}
