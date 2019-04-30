import {
	RECEIVE_VOLUME,
	volumeActions
} from 'actions'

export default function volume(state =init(), action) {
	let newState;
	switch (action.type) {
		case RECEIVE_VOLUME:
			newState = action.data;
			console.log('RECEIVE_VOLUME Action');
			return newState;
		default:
			return state;
	}
}


function init() {
	return volumeActions.initializeVolume()
}
