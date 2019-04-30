const express = require('express');
const router = express.Router();
const sprintf = require('sprintf-js').sprintf;
// Note: importing datejs will extend the native Date class
require('datejs');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);

const sqlWaterUnits = 'SELECT COUNT(id) FROM  product where unit_measure = "gallons"';
const sqlCurrencyUnits = 'SELECT price_currency FROM  product limit 1';

/*
Note- System default metrics such as water units should probably be added to the county entity.
For now, we will scan the various tables that use the units
 */
router.get('/', async (request, response) => {
	semaLog.info('sema_units - Enter');
	let result={}
	__pool.getConnection( (err, connection) => {
		try {
			connection.query(sqlWaterUnits, (err, sqlResult ) => {
				let gallons = (sqlResult[0]["COUNT(id)"]);
				if(gallons === 0 ){
					result.waterUnits = "liters";
				}else{
					result.waterUnits = "gallons";
				}
				connection.query(sqlCurrencyUnits, (err, sqlResult ) => {
					result.currencyUnits = sqlResult[0].price_currency;
					response.json(result);
				});
				connection.release();
			});
		} catch (err) {
			connection.release();
			return __te(err, response, 500, result);
		}
	});
});


module.exports = router;
