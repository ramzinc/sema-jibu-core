const express = require('express');
const router = express.Router();
require('datejs');
const semaLog = require('../seama_services/sema_logger');
const WaterSummary = require('../model_layer/WaterSummary');


let parameter_id_map = {};
let sampling_site_id_map = {};

const sqlParameter=
	'SELECT id, name, unit FROM parameter';

const sqlSamplingSite=
	'SELECT id, name FROM sampling_site';

const sqlVolumeFirst =
	'SELECT  created_at, value FROM reading  \
	WHERE kiosk_id = ? AND parameter_id = ? AND sampling_site_id = ? AND reading.created_at BETWEEN ? AND ? \
	ORDER BY  created_at ASC \
	LIMIT 1 ';

const sqlVolumeLast =
	'SELECT  created_at, value FROM reading  \
	WHERE kiosk_id = ? AND parameter_id = ? AND sampling_site_id = ? AND reading.created_at BETWEEN ? AND ? \
	ORDER BY  created_at DESC \
	LIMIT 1 ';

const sqlAverage =
	'SELECT  AVG(value) FROM reading  \
	WHERE kiosk_id = ? AND parameter_id = ? AND sampling_site_id = ? AND reading.created_at BETWEEN ? AND ?';


router.get('/', async( request, response ) => {
	semaLog.info( 'sema_water_summary - SiteId: - ', request.query["site-id"]);

	request.check("site-id", "Parameter site-id is missing").exists();

	const result = await request.getValidationResult();
	if (!result.isEmpty()) {
		const errors = result.array().map((elem) => {
			return elem.msg;
		});
		semaLog.error("sema_water_summary VALIDATION ERROR: ", errors );
		response.status(400).send(errors.toString());
	} else {

		let endDate =null;
		let beginDate = null;
		if( request.query.hasOwnProperty("end-date") || request.query.hasOwnProperty("begin-date")) {
			// If either begin/end date are specified, both must be specified
			if( ! request.query.hasOwnProperty("end-date") || ! request.query.hasOwnProperty("begin-date")) {
				const msg = "sema_water_summary - Both begin-date AND end-date are required"
				semaLog.error(msg );
				response.status(400).send(msg);
				return;
			}else{
				endDate = new Date(Date.parse(request.query["end-date"]));
				beginDate = new Date(Date.parse(request.query["begin-date"]));
			}
		}

		__pool.getConnection(async (err, connection) => {
			try {
				if (endDate == null) {
					endDate = new Date(Date.now());
					beginDate = new Date(endDate.getFullYear(), 0);	// 	Default to start of the year
				}
				const waterSummary = new WaterSummary( beginDate, endDate);

				await getParametersAndSamplingSiteIds(connection);
				let parameterId = getParameterIdFromMap("Volume");
				if( parameterId != -1 ){
					waterSummary.setProductionUnit(getParameterUnitFromMap("Volume"));
				}
				let samplingSiteId = getSamplingSiteIdFromMap("B:Product");
				let productFirst =	await getVolume(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId, true );
				let productLast =	await getVolume(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId, false );
				if( productFirst != null && productLast != null ){
					waterSummary.setTotalProduction( productLast - productFirst );
				}

				samplingSiteId = getSamplingSiteIdFromMap("D:Fill");
				let fillFirst =	await getVolume(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId, true );
				let fillLast =	await getVolume(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId, false );
				if( fillFirst != null  && fillLast != null  ){
					waterSummary.setFillStation( fillLast - fillFirst );
				}

				parameterId = getParameterIdFromMap("PRE-FILTER PRESSURE IN");
				if( parameterId != -1 ){
					waterSummary.setPressureUnit(getParameterUnitFromMap("PRE-FILTER PRESSURE IN"));
				}

				samplingSiteId = getSamplingSiteIdFromMap("Water Treatment Unit");
				const pressureIn = await getAverage(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId);
				waterSummary.setPressurePreMembrane( pressureIn );
				parameterId = getParameterIdFromMap("PRE-FILTER PRESSURE OUT");
				const pressureOut = await getAverage(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId);
				waterSummary.setPressurePostMembrane( pressureOut );

				parameterId = getParameterIdFromMap("Flow Rate");
				if( parameterId != -1 ){
					waterSummary.setFlowrateUnit(getParameterUnitFromMap("Flow Rate"));
				}

				samplingSiteId = getSamplingSiteIdFromMap("A:Feed");
				let flowRate = await getAverage(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId);
				waterSummary.setSourceFlowRate( flowRate );

				samplingSiteId = getSamplingSiteIdFromMap("B:Product");
				flowRate = await getAverage(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId);
				waterSummary.setProductFlowRate( flowRate );

				samplingSiteId = getSamplingSiteIdFromMap("D:Fill");
				flowRate = await getAverage(connection, request.query["site-id"], beginDate, endDate, parameterId, samplingSiteId);
				waterSummary.setDistributionFlowRate( flowRate );

				semaLog.info("sema_water_summary exit");
				response.json(waterSummary.classToPlain());
				connection.release();
			} catch (err) {
				connection.release();
				__te(err, response, 500, {});
			}
		});

	}
});


const getVolume = (connection, siteId, beginDate, endDate, parameterId, samplingSiteId, first) =>{

	return new Promise((resolve, reject) => {
		connection.query((first) ? sqlVolumeFirst : sqlVolumeLast, [siteId, parameterId, samplingSiteId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						resolve( result[0].value);
					}else {
						resolve(null);
					}
				}catch( ex){
					reject( ex.message);
				}
			}
		});
	});
}

const getAverage = (connection, siteId, beginDate, endDate, parameterId, samplingSiteId) =>{

	return new Promise((resolve, reject) => {
		connection.query(sqlAverage, [siteId, parameterId, samplingSiteId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						resolve( result[0]["AVG(value)"]);
					}else {
						resolve(null);
					}
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
const getParameterUnitFromMap = ( parameter ) =>{
	return (typeof parameter_id_map[parameter] === "undefined" ) ? -1 : parameter_id_map[parameter].unit;
};

const getSamplingSiteIdFromMap = ( parameter ) =>{
	return (typeof sampling_site_id_map[parameter] === "undefined" ) ? -1 : sampling_site_id_map[parameter];
};

const getParametersAndSamplingSiteIds = (connection) => {
	return new Promise((resolve ) => {
		if ( Object.keys( parameter_id_map).length === 0 || Object.keys(sampling_site_id_map).length === 0){
			parameter_id_map = {};
			sampling_site_id_map= {};
			connection.query(sqlParameter, (err, sqlResult) => {
				if (err) {
					semaLog.error("Error resolving parameter ids ", err );
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
							semaLog.error("Error resolving sampling site ids ", err );
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
