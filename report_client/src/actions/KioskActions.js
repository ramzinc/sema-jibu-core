import * as allActions from './ActionTypes';
import { axiosService } from 'services';

function receiveKiosks(data) {
	console.log("receiveSeamaKiosks - ", data.toString())
	return {type: allActions.RECEIVE_KIOSKS, kiosks: data};
}

function selectKiosk(kiosk) {
	console.log("selectKiosk - ", kiosk)
	return {type: allActions.SELECT_KIOSK, selectedKiosk: kiosk};
}

function fetchKiosks() {
	return (dispatch) => {
		axiosService('/sema/kiosks')
			.then(response => {
				if(response.status === 200){
					dispatch(receiveKiosks(response.data))
				}else{
					dispatch(receiveKiosks({kiosks: []}))

				}
			})
			.catch(function(error){
				// This means the service isn't running.
				dispatch(receiveKiosks({kiosks: []}))
			});
	};
}

export const kioskActions = {
	receiveKiosks,
	selectKiosk,
	fetchKiosks
}
