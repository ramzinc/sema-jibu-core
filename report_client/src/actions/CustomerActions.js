import * as allActions from './ActionTypes';
import { axiosService } from 'services';
import { utilService } from 'services';

function receiveCustomer(data) {
	console.log("receiveCustomer - ", data.toString());
	data = updateCustomer(data);
	return {type: allActions.RECEIVE_CUSTOMER, data};
}

function initializeCustomer() {
	return {
		loaded:false,
		customerInfo: {
			allCustomers:{},
			customersByIncome:[],
			customersByDistance:[],
			customersByGender:[]
		}
	}
}


function fetchCustomer(params) {
	return (dispatch) => {
		return fetchCustomerData(params)
			.then(customerInfo => {
				dispatch(receiveCustomer(customerInfo));
			});
	};
}



const fetchCustomerData = ( params) => {
	return new Promise (async(resolve, reject ) => {
		let result = initializeCustomer();
		try {
			let tick = 10;	// Approximate no of API calls - determined empirically
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:0}} ));

			let tickPct = 100/tick;		// Percentage increase per api call

			// All customers for the time period
			result.customerInfo.allCustomers = await fetchCustomerItem(params,  {});
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:tickPct+10}} ));

			// Customers by income
			result.customerInfo.customersByIncome.push(await fetchCustomerItem(params, {incomeGT: 8}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*2)+10}} ));

			result.customerInfo.customersByIncome.push(await fetchCustomerItem(params, {
				incomeLT: 8,
				incomeGT: 5
			}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*3)+10}} ));

			result.customerInfo.customersByIncome.push(await fetchCustomerItem(params, {
				incomeLT: 5,
				incomeGT: 2
			}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*4)+10}} ));

			result.customerInfo.customersByIncome.push(await fetchCustomerItem(params, {incomeLT: 2}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*5)+10}} ));

			// Customers by gender
			result.customerInfo.customersByGender.push(await fetchCustomerItem(params, {gender: 'M'}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*6)+10}} ));

			result.customerInfo.customersByGender.push(await fetchCustomerItem(params, {gender: 'F'}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*7)+10}} ));

			// Customers by distance
			result.customerInfo.customersByDistance.push(await fetchCustomerItem(params, {distanceGT: 500}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*8)+10}} ));

			result.customerInfo.customersByDistance.push(await fetchCustomerItem(params, {
				distanceLT: 500,
				distanceGT: 100
			}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:(tickPct*9)+10}} ));

			result.customerInfo.customersByDistance.push(await fetchCustomerItem(params, {distanceLT: 100}));
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:100}} ));
			resolve(result);
		}catch( error ){
			console.log("fetchCustomerData - Failed ");
			resolve(result);

		}
	});
}


function fetchCustomerItem( params, options ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/customer-summary?site-id=' + params.kioskID;
		if(options.hasOwnProperty("incomeLT") ){
			url = url + "&income-lt=" + options.incomeLT;
		}
		if(options.hasOwnProperty("incomeGT") ){
			url = url + "&income-gt=" + options.incomeGT;
		}

		if(options.hasOwnProperty("gender") ){
			url = url + "&gender=" + options.gender;
		}

		if(options.hasOwnProperty("distanceLT") ){
			url = url + "&distance-lt=" + options.distanceLT;
		}
		if(options.hasOwnProperty("distanceGT") ){
			url = url + "&distance-gt=" + options.distanceGT;
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
					reject(initializeCustomer())
				}
			})
			.catch(function(error){
				reject( error)
			});
	});
}


const updateCustomer = customerData => {
	return {
		loaded:true,
		customerInfo: customerData.customerInfo
	}
};



export const customerActions = {
	receiveCustomer,
	initializeCustomer,
	fetchCustomer
};
