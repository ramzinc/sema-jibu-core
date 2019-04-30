const express = require('express');
const router = express.Router();
require('datejs');
const semaLog = require('../seama_services/sema_logger');

let parameter_id_map = {};
let sampling_site_id_map = {};

const sqlLMostRecentReading =
	'SELECT created_date FROM reading \
	WHERE kiosk_id = ? \
	ORDER BY created_date DESC \
	LIMIT 2';

const sqlTotalProduction =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND \
    (reading.sampling_site_id = ? OR reading.sampling_site_id = ?)\
    ORDER BY reading.created_date DESC \
    LIMIT 30';

const sqlSitePressure =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? \
    ORDER BY reading.created_date DESC \
    LIMIT 10';

const sqlFlowRate =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? \
    ORDER BY reading.created_date DESC \
    LIMIT 10';

const sqlProduction =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND \
    (reading.sampling_site_id = ? OR reading.sampling_site_id = ?)\
    AND reading.created_date BETWEEN ? AND ? \
    ORDER BY reading.created_date';

const sqlTotalChlorine =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_date BETWEEN ? AND ? \
    ORDER BY reading.created_date';

const sqlTDS =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_date BETWEEN ? AND ? \
    ORDER BY reading.created_date';

const sqlParameter=
	'SELECT id, name FROM parameter LIMIT 100';

const sqlSamplingSite=
	'SELECT id, name FROM sampling_site LIMIT 100';

/* GET water operations. */

router.get('/', function(request, response) {
	semaLog.info( 'water-operations Entry - kiosk: - ', request.query.kioskID );

	let results = initResults();

	request.check("kioskID", "Parameter kioskID is missing").exists();
	request.check("groupby", "Parameter groupby is missing").exists();

	request.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("water-operations VALIDATION ERROR: ", errors );
			response.status(400).send(errors.toString());
		} else {
			let endDate = null;
			let beginDate = null;
			if (request.query.hasOwnProperty("enddate")) {
				endDate = new Date(Date.parse(request.query.enddate));
			}

			__pool.getConnection((err, connection) => {
				getParametersAndSiteIds(connection ).then( () => {
					getMostRecentReading(connection, request.query, endDate).then((newEndDate) => {
						endDate = newEndDate;
						results.latestDate = endDate;
						beginDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), 1);	// 	Default to start of previous month
						beginDate.addMonths(-1);

						getTotalOrFillProduction(connection, request.query, results.totalProduction, "AM: Product Line", "PM: Product Line", results).then(() => {
							getTotalOrFillProduction(connection, request.query, results.fillStation, "Fill Station", "PM: Fill Station", results).then(() => {
							getSitePressure(connection, request.query, "PRE-FILTER PRESSURE IN", results.sitePressureIn,  results).then(() => {
								getSitePressure(connection, request.query, "PRE-FILTER PRESSURE OUT", results.sitePressureOut,  results).then(() => {
									getSitePressure(connection, request.query, "MEMBRANE FEED PRESSURE", results.sitePressureMembrane,  results).then(() => {
										getFlowRate(connection, request.query, "Feed Flow Rate", results.flowRateFeed, results).then(() => {
										getFlowRate(connection, request.query, "Product Flow Rate", results.flowRateProduct, results).then(() => {
										getProduction(connection, request.query, beginDate, endDate, results).then(() => {
										getTotalChlorine(connection, request.query, beginDate, endDate, results).then(() => {
										getTDS(connection, request.query, beginDate, endDate, results).then(() => {
											yieldResults(response, results);
										}).catch(err => {
											yieldError(err, response, 500, results);
										});
										}).catch(err => {
											yieldError(err, response, 500, results);
										});
										}).catch(err => {
											yieldError(err, response, 500, results);
										});
										}).catch(err => {
											yieldError(err, response, 500, results);
										});
										}).catch(err => {
											yieldError(err, response, 500, results);
										});
									}).catch(err => {
										yieldError(err, response, 500, results);
									});
								}).catch(err => {
									yieldError(err, response, 500, results);
								});
							}).catch(err => {
								yieldError(err, response, 500, results);
							});
							}).catch(err => {
								yieldError(err, response, 500, results);
							});
						}).catch(err => {
							yieldError(err, response, 500, results);
						});
					});
				}).then(() => {
					connection.release();
				});
			});
		}
	});
});

function getTotalOrFillProduction(connection, params, productionName, firstReading, secondReading, results) {
	return new Promise((resolve, reject) => {

		const gallonsId = getParameterIdFromMap("Gallons");
		const firstSiteId = getSamplingSiteIdFromMap( firstReading );
		const secondSiteId = getSamplingSiteIdFromMap( secondReading );

		connection.query(sqlTotalProduction, [params.kioskID, gallonsId, firstSiteId, secondSiteId], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 2) {
						for (let i = 0; i < result.length - 1; i++) {
							let date1 = Date.parse(result[i].created_date);
							let date2 = Date.parse(result[i+1].created_date);

							if (
								result[i].sampling_site_id !== result[i + 1].sampling_site_id &&
								date1.getFullYear() === date2.getFullYear() &&
								date1.getMonth() === date2.getMonth()  &&
								date1.getDate() === date2.getDate()) {
								productionName.value = Math.abs( result[i+1].value - result[i].value );
								productionName.date = new Date(result[i].created_date);
								break;
							}
						}
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
}


const getSitePressure = (connection, params, pressureName, pressureResult,  results) =>{
	return new Promise((resolve, reject) => {
		const filterPressure = getParameterIdFromMap(pressureName);
		connection.query(sqlSitePressure, [params.kioskID, filterPressure], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try{
					if (Array.isArray(result) && result.length >= 1) {
						pressureResult.value = parseFloat(result[0].value);
						pressureResult.date = new Date(result[0].created_date);
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
};



const getFlowRate = (connection, params, flowRateName, flowRateResult, results) => {

	const flowRateId = getParameterIdFromMap(flowRateName);
	return new Promise((resolve, reject) => {
		connection.query(sqlFlowRate, [params.kioskID, flowRateId], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try{
					if (Array.isArray(result) && result.length >= 1) {
						flowRateResult.value = parseFloat(result[0].value);
						flowRateResult.date = new Date(result[0].created_date);
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
};

function getProduction(connection, params, beginDate, endDate, results) {
	// Notes on constants TBD....
	// 127 gallons ??
	return new Promise((resolve, reject) => {
		const gallonsId = getParameterIdFromMap("Gallons");
		const amProductLine = getSamplingSiteIdFromMap("AM: Product Line");
		const pmProductLine = getSamplingSiteIdFromMap("PM: Product Line");
		connection.query(sqlProduction, [params.kioskID, gallonsId, pmProductLine, amProductLine, beginDate, endDate], function (err, result ) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 2) {
						const prodValues =[];
						const timeTicks =[];
						for (let i = 0; i < result.length - 1; i++) {
							let date1 = Date.parse(result[i].created_date);
							let date2 = Date.parse(result[i+1].created_date);

							if( result[i].sampling_site_id !== result[i + 1].sampling_site_id &&
								date1.getFullYear() === date2.getFullYear() &&
								date1.getMonth() === date2.getMonth()  &&
								date1.getDate() === date2.getDate()) {

								prodValues.push(Math.abs( result[i+1].value - result[i].value ));
								timeTicks.push(result[i].created_date);

								i++;
							}
						}
						results.production = {
							x_axis: timeTicks,
							datasets: [{label: 'Total Production', data: prodValues}]
						};
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
}

function getTotalChlorine(connection, params, beginDate, endDate, results) {
	// Notes on constants TBD....
	// 120 total chlorine ??
	// Site ID = 75 - Water treatment unit
	const totalChlorineId = getParameterIdFromMap("Total Chlorine");
	const waterTreatmentUnitId = getSamplingSiteIdFromMap("Water Treatment Unit");

	return new Promise((resolve, reject) => {
		connection.query(sqlTotalChlorine, [params.kioskID, totalChlorineId, waterTreatmentUnitId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						const timeTicks = result.map(item =>{return item.created_date});
						const values = result.map(item =>{return parseFloat(item.value)});
						results.chlorine = {
							x_axis: timeTicks,
							datasets: [{label: 'Total Chlorine', data: values}]
						};
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
}

function getTDS(connection, params, beginDate, endDate, results) {
	// Notes on constants TBD....
	// 121 Total disolved solids
	// Site ID = 75 - Water treatment unit
	const totalDissolvedSolidsId = getParameterIdFromMap("Total Dissolved Solids");
	const waterTreatmentUnitId = getSamplingSiteIdFromMap("Water Treatment Unit");

	return new Promise((resolve, reject) => {
		connection.query(sqlTDS, [params.kioskID, totalDissolvedSolidsId, waterTreatmentUnitId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						const timeTicks = result.map(item =>{return item.created_date});
						const values = result.map(item =>{return item.value});
						results.tds = {
							x_axis: timeTicks,
							datasets: [{label: 'TDS', data: values}]
						};
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
}

const getMostRecentReading = ( connection, requestParams, endDate ) => {
	return new Promise(( resolve ) => {
		if( endDate != null ){
			resolve( endDate);
		}else{
			connection.query(sqlLMostRecentReading, [requestParams.kioskID], (err, sqlResult )=>{
				if (err) {
					resolve(new Date(Date.now()));
				}else{
					if (Array.isArray(sqlResult) && sqlResult.length > 0) {
						endDate = new Date(sqlResult[0]["created_date"]);
						resolve( endDate );
					}
					resolve(new Date(Date.now()));
				}
			})
		}
	});
};

const getParameterIdFromMap = ( parameter ) =>{
	return (typeof parameter_id_map[parameter] === "undefined" ) ? -1 : parameter_id_map[parameter];
};

const getSamplingSiteIdFromMap = ( parameter ) =>{
	return (typeof sampling_site_id_map[parameter] === "undefined" ) ? -1 : sampling_site_id_map[parameter];
};

const getParametersAndSiteIds = (connection) => {
	return new Promise((resolve ) => {
		if ( Object.keys( parameter_id_map).length === 0 || Object.keys(sampling_site_id_map).length === 0){
			parameter_id_map = {};
			sampling_site_id_map= {};
			connection.query(sqlParameter, (err, sqlResult) => {
				if (err) {
					semaLog.error("water-operations. Error resolving parameter ids ", err );
					resolve();
				} else {
					if (Array.isArray(sqlResult)){
						parameter_id_map = sqlResult.reduce( (map, item) => {
							map[item.name] = item.id;
							return map;
						}, {});
					}
					connection.query(sqlSamplingSite, (err, sqlResult) => {
						if (err) {
							semaLog.error("water-operations. Error resolving sampling site ids ", err );
							resolve();
						}else{
							sampling_site_id_map = sqlResult.reduce( (map, item) => {
								map[item.name] = item.id;
								return map;
							}, {});
						}
						resolve();
					});
				}
			})
		}else{
			resolve();
		}
	});

};

const yieldResults =(res, results ) =>{
	semaLog.info("water-operations - exit");
	res.json(results);
};

const yieldError = (err, response, httpErrorCode, results ) =>{
	semaLog.error("water-operations: ERROR: ", err.message, "HTTP Error code: ", httpErrorCode);
	response.status(httpErrorCode);
	response.json(results);
};

const initResults = () => {
	return {
		totalProduction: {value:"N/A", date:"N/A"},
		fillStation: {value:"N/A", date:"N/A"},
		sitePressureIn: {value:"N/A", date:"N/A"},
		sitePressureOut: {value:"N/A", date:"N/A"},
		sitePressureMembrane: {value:"N/A", date:"N/A"},
		flowRateFeed:{value:"N/A", date:"N/A"},
		flowRateProduct:{value:"N/A", date:"N/A"},

		production:initEmptyChart(),
		chlorine:initEmptyChart(),
		tds:initEmptyChart()};

};
const initEmptyChart = () => {
	return { x_axis: [], datasets: []};
};
module.exports = router;
