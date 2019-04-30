import * as allActions from './ActionTypes';
// import moment from "moment/moment";
import { axiosService } from 'services';
import { utilService } from 'services';

function receiveWaterOperations(data) {
	console.log("receiveWaterOperations ");
	updateWaterOperations(data);
	return {type: allActions.RECEIVE_WATER_OPERATIONS, data};
}

function initializeWaterOperations() {
	return {
		loaded:false,
		waterOperationsInfo :{
			beginDate:null,
			endDate:null,
			waterMeasureUnits: 'liters',
			waterFlowrateUnits: 'lpm',
			waterPressureUnits: 'PSI',
			totalProduction: null,
			fillStation: null,
			pressurePreMembrane: null,
			pressurePostMembrane: null,
			flowRateProduct: null,
			flowRateSource: null,
			flowRateDistribution: null,
			production: {},
			fill:{},
			chlorine: {},
			tds: {}
		}
	}
}

function fetchWaterOperations(params) {
	return (dispatch) => {
		return fetchWaterOperationsData(params)
			.then(waterInfo => {
				dispatch(receiveWaterOperations(waterInfo));
			});
	};
}

const fetchWaterOperationsData = ( params) => {
	return new Promise(async (resolve, reject) => {
		let waterInfo = initializeWaterOperations();
		waterInfo.waterOperationsInfo.beginDate = params.startDate;
		waterInfo.waterOperationsInfo.endDate = params.endDate;
		try {
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:0}} ));
			let summary = await fetchSummary(params );
			waterInfo.waterOperationsInfo.waterMeasureUnits = summary.productionUnit;
			waterInfo.waterOperationsInfo.waterFlowrateUnits = summary.flowrateUnit;
			waterInfo.waterOperationsInfo.totalProduction = summary.totalProduction;
			waterInfo.waterOperationsInfo.fillStation = summary.fillStation;
			waterInfo.waterOperationsInfo.pressurePostMembrane = summary.pressurePostMembrane;
			waterInfo.waterOperationsInfo.pressurePreMembrane = summary.pressurePreMembrane;
			waterInfo.waterOperationsInfo.flowRateSource = summary.sourceFlowRate;
			waterInfo.waterOperationsInfo.flowRateDistribution = summary.distributionFlowRate;
			waterInfo.waterOperationsInfo.flowRateProduct = summary.productFlowRate;

			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:20}} ));


			let production = Object.assign({}, params);
			production.type = "production";
			// For water production, decimate the results by 'month' for periods a year or longer
			let groupBy = null;
			if( params.hasOwnProperty("groupBy") &&
				(params.groupBy === "none" || params.groupBy === "year")){
				groupBy = "month";
			}
			waterInfo.waterOperationsInfo.production = await fetchChart(production, groupBy );
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:40}} ));

			let fill = Object.assign({}, params);
			fill.type = "fill";
			waterInfo.waterOperationsInfo.fill = await fetchChart(fill, groupBy );
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:60}} ));

			let chlorine = Object.assign({}, params);
			chlorine.type = "totalchlorine";
			waterInfo.waterOperationsInfo.chlorine = await fetchChart(chlorine, null );
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:80}} ));

			let tds = Object.assign({}, params);
			tds.type = "tds";
			waterInfo.waterOperationsInfo.tds = await fetchChart(tds, null );
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:100}} ));

			resolve(waterInfo);
		} catch (error) {
			console.log("fetchWaterOperationsData - Failed ");
			resolve(waterInfo);

		}
	});
}

function fetchChart( params, groupBy ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/water-chart?site-id=' + params.kioskID ;
		if( params.hasOwnProperty("startDate") ){
			url = url + "&begin-date=" + utilService.formatDateForUrl(params.startDate);
		}
		if( params.hasOwnProperty("endDate") ){
			url = url + "&end-date=" + utilService.formatDateForUrl(params.endDate);
		}
		if( params.hasOwnProperty("type") ){
			url = url + "&type=" + params.type;
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
					reject(initializeWaterOperations())
				}
			})
			.catch(function(error){
				reject( error)
			});
	});
}

function fetchSummary( params ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/water-summary?site-id=' + params.kioskID ;
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
					reject(initializeWaterOperations())
				}
			})
			.catch(function(error){
				reject( error)
			});
	});
}
const updateWaterOperations = waterData => {
	waterData.loaded = true;
};


export const waterOperationsActions = {
	receiveWaterOperations,
	initializeWaterOperations,
	fetchWaterOperations
};
