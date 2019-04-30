import { authActions } from '../actions';

// To be used by all services fetching data from the server.
// Not to be used by the auth service
export default response =>
	response.json().then(data => {
		if (response.status === 401) {
			// A 401 status code can only mean that the token and the refresh
			// token (not implemented yet) have expired
			// So we logout from the client
			authActions.logout();
			location.reload(true);
		}

		return {
			data: data,
			status: response.status
		}
	});
