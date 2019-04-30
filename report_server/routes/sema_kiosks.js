const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const Kiosk = require('../model_layer/Kiosk');

/* GET kiosks in the database. */
router.get('/', function(req, res) {
	semaLog.info('kiosks - Enter');
	__pool.getConnection((err, connection) => {
		if (err) {
			console.log("WTF: "+ err);
			return ;
		}
		connection.query('SELECT * FROM kiosk', (err, result ) => {
			connection.release();

			if (err) {
				semaLog.error( 'kiosks - failed', {err});
				res.status(500).send(err.message);
			} else {
				semaLog.info( 'kiosks - succeeded');
				res.json({ kiosks: result.map( (kiosk) => { return (new Kiosk(kiosk)).classToPlain()}) });
			}
		});
	});
});

module.exports = router;
