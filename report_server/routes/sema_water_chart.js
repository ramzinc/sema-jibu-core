const express = require('express');
const router = express.Router();
require('datejs');
const semaLog = require('../seama_services/sema_logger');
const WaterChart = require('../model_layer/WaterChart');


let parameter_id_map = {};
let sampling_site_id_map = {};

const sqlParameter=
	'SELECT id, name, unit FROM parameter';

const sqlSamplingSite=
	'SELECT id, name FROM sampling_site';

const sqlReadingChart =
	'SELECT reading.created_at, reading.sampling_site_id, reading.parameter_id, reading.value \
    FROM reading \
    WHERE reading.kiosk_id = ? AND reading.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_at BETWEEN ? AND ? \
    ORDER BY reading.created_at';

const sqlVolumeReadingChartDay =
	'SELECT  YEAR(reading.created_at), MONTH(reading.created_at),  DAY(reading.created_at), MAX(value), MIN(value) \
	FROM reading \
	WHERE reading.kiosk_id = ? AND reading.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_at BETWEEN ? AND ? \
	GROUP BY YEAR(reading.created_at), MONTH(reading.created_at), DAY(reading.created_at) \
	ORDER BY  YEAR(reading.created_at) ASC, MONTH(reading.created_at) ASC, DAY(reading.created_at) ASC';

const sqlVolumeReadingChartMonth =
	'SELECT  YEAR(reading.created_at), MONTH(reading.created_at), MAX(value), MIN(value) \
	FROM reading \
	WHERE reading.kiosk_id = ? AND reading.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_at BETWEEN ? AND ? \
	GROUP BY YEAR(reading.created_at), MONTH(reading.created_at)  \
	ORDER BY  YEAR(reading.created_at) ASC, MONTH(reading.created_at) ASC ';

router.get('/', async( request, response ) => {
	semaLog.info( 'sema_water_chart Entry - SiteId: - ', request.query["site-id"]);

	request.check("site-id", "Parameter site-id is missing").exists();
	request.check("type", "Summary type is missing").exists();

	const result = await request.getValidationResult();
	if (!result.isEmpty()) {
		const errors = result.array().map((elem) => {
			return elem.msg;
		});
		semaLog.error("sema_water_chart VALIDATION ERROR: ", errors );
		response.status(400).send(errors.toString());
	} else {

		let endDate =null;
		let beginDate = null;
		if( request.query.hasOwnProperty("end-date") || request.query.hasOwnProperty("begin-date")) {
			// If either begin/end date are specified, both must be specified
			if( ! request.query.hasOwnProperty("end-date") || ! request.query.hasOwnProperty("begin-date")) {
				const msg = "sema_water_chart - Both begin-date AND end-date are required"
				semaLog.error(msg );
				response.status(400).send(msg);
				return;
			}else{
				endDate = new Date(Date.parse(request.query["end-date"]));
				beginDate = new Date(Date.parse(request.query["begin-date"]));
			}
		}

		// Check for income and customerType qualifiers
		__pool.getConnection(async (err, connection) => {
			try {
				if (endDate == null) {
					endDate = new Date(Date.now());
					beginDate = new Date(endDate.getFullYear(), 0);	// 	Default to start of the year
				}
				const waterChart = new WaterChart( request.query.type, beginDate, endDate);

				let samplingSite = "Water Treatment Unit";
				let parameter = "";
				switch( request.query.type ){
					case "totalchlorine":
						parameter = "Total Chlorine";
						break;
					case "tds":
						parameter = "Total Dissolved Solids";
						break;
					case "production":
						parameter = "Volume";
						samplingSite = "B:Product";
						break;
					case "fill":
						parameter = "Volume";
						samplingSite = "D:Fill";
						break;
					default:
						connection.release();
						const msg = "sema_water_chart: Unknown chart type: " +request.query.type;
						semaLog.error(msg );
						response.status(400).send(msg);

				}
				await getParametersAndSamplingSiteIds(connection);
				const parameterId = getParameterIdFromMap(parameter);
				if( parameterId != -1 ){
					waterChart.setUnit(getParameterUnitFromMap(parameter));
				}
				const samplingSiteId = getSamplingSiteIdFromMap(samplingSite);
				if( request.query.type === 'production' || request.query.type === 'fill'){
					let groupBy = "day";
					if( request.query.hasOwnProperty("group-by")){
						groupBy = request.query["group-by"];
					}
					await getProductionReading(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId, groupBy, waterChart);

				}else {
					await getReading(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId, waterChart);
				}
				semaLog.info("sema_water_chart exit");
				response.json(waterChart.classToPlain());
				connection.release();
			} catch (err) {
				connection.release();
				__te(err, response, 500, {});
			}
		});

	}
});


const getReading = (connection, siteId, beginDate, endDate, parameterId, samplingSiteId, waterChart) =>{

	return new Promise((resolve, reject) => {
		connection.query(sqlReadingChart, [siteId, parameterId, samplingSiteId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						const timeTicks = result.map(item =>{return item.created_at});
						const values = result.map(item =>{return parseFloat(item.value)});
						waterChart.setData({time: timeTicks, values: values});
					}
					resolve();
				}catch( ex){
					reject( ex.message);
				}
			}
		});
	});
}


const getProductionReading = (connection, siteId, beginDate, endDate, parameterId, samplingSiteId, groupBy, waterChart) =>{

	return new Promise((resolve, reject) => {
		let sqlQuery = sqlVolumeReadingChartDay;
		if( groupBy === "month"){
			sqlQuery = sqlVolumeReadingChartMonth;
		}
		connection.query(sqlQuery, [siteId, parameterId, samplingSiteId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						const timeTicks = result.map(item =>{
							if( groupBy === "month"){
								return new Date(item["YEAR(reading.created_at)"], item["MONTH(reading.created_at)"] - 1 );
							}else {
								return new Date(item["YEAR(reading.created_at)"], item["MONTH(reading.created_at)"] - 1, item["DAY(reading.created_at)"]);
							}
						});
						const values = result.map(item =>{return item["MAX(value)"] - item["MIN(value)"]});
						waterChart.setData({time: timeTicks, values: values});
					}
					resolve();
				}catch( ex){
					reject( ex.message);
				}
			}
		});
	});
}

const getParameterIdFromMap = ( parameter ) =>{
	return (typeof parameter_id_map[parameter] === "undefined" ) ? -1 : parameter_id_map[parameter].id;
};

const getSamplingSiteIdFromMap = ( parameter ) =>{
	return (typeof sampling_site_id_map[parameter] === "undefined" ) ? -1 : sampling_site_id_map[parameter];
};

const getParameterUnitFromMap = ( parameter ) =>{
	return (typeof parameter_id_map[parameter] === "undefined" ) ? -1 : parameter_id_map[parameter].unit;
};

const getParametersAndSamplingSiteIds = (connection) => {
	return new Promise((resolve ) => {
		if ( Object.keys( parameter_id_map).length === 0 || Object.keys(sampling_site_id_map).length === 0){
			parameter_id_map = {};
			sampling_site_id_map= {};
			connection.query(sqlParameter, (err, sqlResult) => {
				if (err) {
					semaLog.error("water-chart. Error resolving parameter ids ", err );
					resolve();
				} else {
					if (Array.isArray(sqlResult)){
						parameter_id_map = sqlResult.reduce( (map, item) => {
							map[item.name] = {id:item.id, unit:item.unit};
							return map;
						}, {});
					}
					connection.query(sqlSamplingSite, (err, sqlResult) => {
						if (err) {
							semaLog.error("water-chart. Error resolving sampling site ids ", err );
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



module.exports = router;
