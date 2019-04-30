import { RECEIVE_HEALTHCHECK } from 'actions';
import { axiosService } from 'services';

const receiveHealthCheck = data => {
	console.log("receiveHealthCheck - ", data.toString())
	return {type: RECEIVE_HEALTHCHECK, healthCheck: data};
}

const fetchHealthCheck = () => {
	return (dispatch) => {
		axiosService
			.get('/sema/health-check')
			.then(response => {
				if (response.status === 200){
					dispatch(receiveHealthCheck(response.data))
				} else{
					var data = {server: "failed", database: "n/a"};
					dispatch(receiveHealthCheck(data))
				}
			})
			.catch(function(error){
				// This means the service isn't running.
				var data = {server: "failed", database: "n/a"};
				dispatch(receiveHealthCheck(data))
			});
		;
	};
}

export const healthCheckActions = {
	fetchHealthCheck
};
