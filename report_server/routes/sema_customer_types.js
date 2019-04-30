const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const CustomerType = require('../model_layer/CustomerType');

router.get('/', function(req, res) {
	semaLog.info('GET customer types - Enter');
	__pool.getConnection((err, connection) => {
		if (err) {
			console.log("WTF: "+ err);
			return ;
		}
		connection.query('SELECT * FROM customer_type', (err, result ) => {
			connection.release();

			if (err) {
				semaLog.error( 'GET customer types  - failed', {err});
				res.status(500).send(err.message);
			} else {
				semaLog.info( 'GET customer types  - succeeded');
				res.json({ customerTypes: result.map( (customerType) => { return (new CustomerType(customerType)).classToPlain()}) });
			}
		});
	});
});

module.exports = router;
