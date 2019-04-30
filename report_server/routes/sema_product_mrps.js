const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const ProductMrp = require('../model_layer/ProductMrp');

var sqlQueryDate = "SELECT * FROM product_mrp WHERE kiosk_id = ? AND updated_at > ? ";
var sqlQuery = "SELECT * FROM product_mrp WHERE kiosk_id = ?";
var sqlQuerySimple = "SELECT * FROM product_mrp";

router.get('/', function(req, res) {
	semaLog.info('GET product mrps - Enter');
	req.check("site-id", "Parameter site-id is missing").exists();
	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("GET product mrps: validation error: ", errors);
			res.status(400).send(errors.toString());
		}else{
			let params = [req.query["site-id"]];
			let query = sqlQuery;
			if (req.query.hasOwnProperty("updated-date")) {
				params = [req.query["site-id"], getUTCDate(new Date( req.query["updated-date"]))];
				query = sqlQueryDate;
			} else if (req.query['site-id'] === '-1') {
				params = null;
				query = sqlQuerySimple;
			}

			__pool.getConnection((err, connection) => {

				connection.query(query, params, (err, result) => {
					connection.release();
					if (err) {
						semaLog.error('GET product mrps  - failed', { err });
						res.status(500).send(err.message);
					} else {
						semaLog.info('GET product mrps  - succeeded');
						res.json({
							productMRPs: result.map((productMrp) => {
								return (new ProductMrp(productMrp)).classToPlain()
							})
						});
					}
				});
			});
		}
	});
});

const getUTCDate = (date) => {
	return  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
		date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

};

module.exports = router;
