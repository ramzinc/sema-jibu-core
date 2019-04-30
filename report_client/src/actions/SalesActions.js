import * as allActions from './ActionTypes';
import { axiosService } from 'services';
import { utilService } from 'services';

function receiveSales(data) {
	data = updateSales(data);
	return {type: allActions.RECEIVE_SALES, data};
}

function receiveSalesByChannel(data) {
	console.log("receiveSales - ", data.toString());
	return {type: allActions.RECEIVE_SALES_BY_CHANNEL, data};
}

function initializeSales() {
	return {
		loaded:false,
		salesInfo: {
			beginDate:null,
			endDate:null,
			totalRevenue : {total: null, period: null, periods: PeriodData.init3Periods()},
			totalCustomers: {total: null, period: null, periods: PeriodData.init3Periods()},
			customerCount:null,
			currencyUnits:'USD',
			customerSales:[],
			salesByChannel: {beginDate: null, endDate: null, datasets: []},
			salesByChannelHistory: {beginDate: null, endDate: null, datasets: []}
		}
	}
}

function fetchSales(params) {
	return (dispatch) => {
		return fetchSalesData(params)
			.then(salesInfo => {
				console.log( JSON.stringify(salesInfo));
				dispatch(receiveSales(salesInfo));
			});
	};
}

const fetchSalesData = ( params) => {
	return new Promise(async (resolve, reject) => {
		let salesInfo = initializeSales();
		try {
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:0}} ));
			salesInfo = await fetchSalesSummary(params);
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:25}} ));

			let units = await fetchMeasureUnits();
			salesInfo.currencyUnits = units.currencyUnits;
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:50}} ));

			salesInfo.salesByChannel = await fetchSalesByChannel(params);
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:75}} ));

			// Decimate the results by 'month' for periods a year or longer
			let groupBy = null;
			if( params.hasOwnProperty("groupBy") &&
				(params.groupBy === "none" || params.groupBy === "year")){
				groupBy = "month";
			}

			salesInfo.salesByChannelHistory = await fetchSalesByChannelHistory(params, groupBy);
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:100}} ));

			resolve(salesInfo);
		} catch (error) {
			console.log("fetchVolumeData - Failed ");
			resolve(salesInfo);

		}
	});
}

function fetchSalesSummary( params ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/sales-summary?site-id=' + params.kioskID ;
		if( params.hasOwnProperty("startDate") ){
			url = url + "&begin-date=" + utilService.formatDateForUrl(params.startDate);
		}
		if( params.hasOwnProperty("endDate") ){
			url = url + "&end-date=" + utilService.formatDateForUrl(params.endDate);
		}
		if( params.hasOwnProperty("groupBy") ){
			url = url + "&group-by=" + params.groupBy;
		}

		axiosService
		.get(url)
		.then(response => {
			if(response.status === 200){
				resolve(response.data)
			}else{
				reject(initializeSales())
			}
		})
		.catch(function(error){
			reject( error)
		});
	});
}


function fetchSalesByChannel( params ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/receipt-summary?site-id=' + params.kioskID + "&type=sales-channel";

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
					reject({})
				}
			})
			.catch(function(error){
				reject( error)
			});
	});
}

function fetchSalesByChannelHistory( params, groupBy ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/sales-by-channel-history?site-id=' + params.kioskID;

		if( params.hasOwnProperty("startDate") ){
			url = url + "&begin-date=" + utilService.formatDateForUrl(params.startDate);
		}
		if( params.hasOwnProperty("endDate") ){
			url = url + "&end-date=" + utilService.formatDateForUrl(params.endDate);
		}
		if( groupBy ){
			url = url + "&group-by=" + groupBy;

		}
		axiosService
			.get(url)
			.then(response => {
				if(response.status === 200){
					resolve(response.data)
				}else{
					reject({})
				}
			})
			.catch(function(error){
				reject( error)
			});
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
					reject({})
				}
			})
			.catch(function (error) {
				reject(error)
			});
	});

}

function forceUpdate() {
	console.log("forceUpdate - ");
	return {type: allActions.FORCE_SALES_UPDATE};
}


class PeriodData {
	constructor() {
		this.beginDate = null;
		this.endDate = null;
		this.value = null;
	}

	setValue(value) {
		this.value = value;
	}

	setDates(beginDate, endDate) {
		this.endDate = endDate;
		this.beginDate = beginDate;

	}

	static init3Periods() {
		return [new PeriodData(), new PeriodData(), new PeriodData()];
	}
};

const updateSales = salesData => {
	return {
		loaded:true,
		salesInfo: salesData
	}
};

export const salesActions = {
	receiveSales,
	receiveSalesByChannel,
	initializeSales,
	fetchSales,
	forceUpdate
};
