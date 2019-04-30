const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const SalesChannel = require('../model_layer/SalesChannel');

router.get('/', function(req, res) {
	semaLog.info('GET sales channels - Enter');
	__pool.getConnection((err, connection) => {
		if (err) {
			console.log("WTF: "+ err);
			return ;
		}
		connection.query('SELECT * FROM sales_channel', (err, result ) => {
			connection.release();

			if (err) {
				semaLog.error( 'GET sales channels - failed', {err});
				res.status(500).send(err.message);
			} else {
				semaLog.info( 'GET sales channels - succeeded');
				res.json({ salesChannels: result.map( (salesChannel) => { return (new SalesChannel(salesChannel)).classToPlain()}) });
			}
		});
	});
});

module.exports = router;
