import {
	FETCH_LOGIN,
	RECEIVE_LOGIN,
	LOGOUT
} from 'actions';
import jwt from 'jsonwebtoken';

/*
 * logState can be any of the following:
 * - idle
 * - loading
 * - success
 * - noService
 * - badCredentials
 *
 *   currentUser is either null or an object containing
 *   data about the current logged in user
 */

const initialState = {
	logState: 'idle',
	currentUser: null
};

export default (state = initialState, action) => {
	let newState;

	switch (action.type) {
		case FETCH_LOGIN:
			console.log('FETCH_LOGIN Action');
			newState = {
				logState: action.data.logState,
				currentUser: action.data.currentUser
			};
			return newState;
		case RECEIVE_LOGIN:
			console.log('RECEIVE_LOGIN Action');
			const currentUser = jwt.decode(action.data.token);
			newState = {
				logState: action.data.logState,
				currentUser
			};
			return newState;
		case LOGOUT:
			console.log('LOGOUT Action');
			newState = {
				logState: action.data.logState,
				currentUser: action.data.currentUser
			};
			return newState;
		default:
			return state;
	}
}
