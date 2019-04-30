const express = require('express');
const router = express.Router();

const semaLog = require('../seama_services/sema_logger');
const HealthCheck = require('../model_layer/HealthCheck');

router.get('/', (req, res) => {
	semaLog.log('info', 'health-check - Enter');

	__pool.getConnection((err, connection) => {
		connection.release();
		let healthCheck = new HealthCheck( req, connection.config.database);
		if (err) {
			semaLog.log('error', 'health-check - Failed; database failure');
			semaLog.log('error', err.toString());
			healthCheck.database = "Failed";
		}else{
			semaLog.log('info', 'health-check - succeeded');
		}
		res.json(healthCheck.classToPlain());
	});
});

module.exports = router;
