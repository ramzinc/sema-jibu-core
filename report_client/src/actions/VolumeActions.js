import * as allActions from './ActionTypes';
import { axiosService } from 'services';
import { utilService } from 'services';

function receiveVolume(data) {
	console.log("receiveVolume - ", data.toString());
	data = updateVolume(data);
	return {type: allActions.RECEIVE_VOLUME, data};
}

function initializeVolume() {
	return {
		loaded:false,
		volumeInfo: {
			volumeByChannel:{},
			volumeByChannelAndIncome:[],
			volumeByChannelAndType:[],
			volumeByChannelAndPaymentType:[],
			volumeWaterMeasureUnits: 'liters'
		}
	}
}


function fetchVolume(params) {
	return (dispatch) => {
		return fetchVolumeData(params)
			.then(volumeInfo => {
				dispatch(receiveVolume(volumeInfo));
			});
	};
}



const fetchVolumeData = ( params) => {
	return new Promise (async(resolve, reject ) => {
		let result = initializeVolume();
		try {
			let tick = 9;	// approx number of REST calls
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:0}} ));
			// let types = await fetchCustomerTypes();
			let units = await fetchMeasureUnits();
			result.volumeInfo.volumeWaterMeasureUnits = units.waterUnits;
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:10}} ));
			// if( types ){
			// 	tick = 5 + types.customerTypes.length + 1; // approximate number of api calls
			// }
			let tickPct = 100/tick;		// Percentage increase per api call

			result.volumeInfo.volumeByChannel = await fetchVolumeItem(params, "sales-channel", {});
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:tickPct+10}} ));

			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {incomeGT: 8}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*2)+10}} ));

			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {
				incomeLT: 8,
				incomeGT: 5
			}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*3)+10}} ));

			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {
				incomeLT: 5,
				incomeGT: 2
			}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*4)+10}} ));

			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {incomeLT: 2}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*5)+10}} ));

			// if (types) {
			// 	for (let index = 0; index < types.customerTypes.length; index++) {
			// 		const volumeInfo = await fetchVolumeItem(params, "sales-channel", {customerType: types.customerTypes[index].id});
			// 		volumeInfo.customerTypeName = types.customerTypes[index].name;
			// 		result.volumeInfo.volumeByChannelAndType.push(volumeInfo);
			// 		window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*(5+index+1))+10}} ));
			// 	}
			// }
			result.volumeInfo.volumeByChannelAndPaymentType.push(await fetchVolumeItem(params, "sales-channel", {paymentType: "cash"}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*6)+10}} ));

			result.volumeInfo.volumeByChannelAndPaymentType.push(await fetchVolumeItem(params, "sales-channel", {paymentType: "mobile"}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*7)+10}} ));

			result.volumeInfo.volumeByChannelAndPaymentType.push(await fetchVolumeItem(params, "sales-channel", {paymentType: "card"}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*8)+10}} ));

			result.volumeInfo.volumeByChannelAndPaymentType.push(await fetchVolumeItem(params, "sales-channel", {paymentType: "loan"}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:100}} ));
			resolve(result);
		}catch( error ){
			console.log("fetchVolumeData - Failed ");
			resolve(result);

		}
	});
}
function fetchMeasureUnits(){
	return new Promise((resolve, reject ) => {
		axiosService
			.get('/sema/measure-units')
			.then(response => {
				if (response.status === 200) {
					resolve(response.data)
				} else {
					reject(initializeVolume())
				}
			})
			.catch(function (error) {
				reject(error)
			});
	});

}

function fetchVolumeItem( params, type, options ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/receipt-summary?site-id=' + params.kioskID + "&type=" +type;
		if(options.hasOwnProperty("incomeLT") ){
			url = url + "&income-lt=" + options.incomeLT;
		}
		if(options.hasOwnProperty("incomeGT") ){
			url = url + "&income-gt=" + options.incomeGT;
		}

		if(options.hasOwnProperty("customerType") ){
			url = url + "&customer-type=" + options.customerType;
		}
		if(options.hasOwnProperty("paymentType") ){
			url = url + "&payment-type=" + options.paymentType;
		}
		if( params.hasOwnProperty("startDate") ){
			url = url + "&begin-date=" + utilService.formatDateForUrl(params.startDate);
		}
		if( params.hasOwnProperty("endDate") ){
			url = url + "&end-date=" + utilService.formatDateForUrl(params.endDate);
		}
		axiosService
			.get(url)
			.then(response => {
				if(response.status === 200){
					resolve(response.data)
				}else{
					reject(initializeVolume())
				}
			})
			.catch(function(error){
				reject( error)
			});
	});
}

// function fetchCustomerTypes(  ) {
// 	return new Promise((resolve, reject ) => {
// 		axiosService
// 			.get('/sema/customer-types')
// 			.then(response => {
// 				if(response.status === 200){
// 					resolve(response.data)
// 				}else{
// 					reject(null)
// 				}
// 			})
// 			.catch(function(error){
// 				reject(error)
// 			});
// 	});
// }

const updateVolume = volumeData => {
	return {
		loaded:true,
		volumeInfo: volumeData.volumeInfo
	}
};



export const volumeActions = {
	receiveVolume,
	initializeVolume,
	fetchVolume
};
