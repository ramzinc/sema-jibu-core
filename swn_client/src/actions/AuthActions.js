import {
	RECEIVE_LOGIN,
	FETCH_LOGIN,
	LOGOUT
} from './';
import { authService } from 'services';

const receiveLogin = data => {
	console.log(`receiveLogin - ${JSON.stringify(data)}`);
	return {type: RECEIVE_LOGIN, data};
}

const fetchLogin = data => {
	console.log(`fetchLogin - ${JSON.stringify(data)}`);
	return {type: FETCH_LOGIN, data};
};

const login = (usernameOrEmail, password) =>
	dispatch => {
		dispatch(fetchLogin({
			logState: 'loading',
			currentUser: null
		}));

		authService.login(usernameOrEmail, password)
			.then(response => {
				if (response.status === 200) {
					const data = {...response.data, logState: 'success' };
					dispatch(receiveLogin(data))
				} else if (response.status === 401) {
					const data = { logState: "badCredentials" };
					dispatch(receiveLogin(data))
				} else {
					const data = { logState: "noService" };
					dispatch(receiveLogin(data))
				}
			})
			.catch(function(error){
				console.log(`ERROR: ${JSON.stringify(error)}`);
				const data = { logState: "noService" };
				dispatch(receiveLogin(data))
			});
	};

const logout = () => {
	authService.logout();
	const data = { currentUser: null, logState: 'idle'};
	return { type: LOGOUT, data };
};

export const authActions = {
	login,
	logout
};
