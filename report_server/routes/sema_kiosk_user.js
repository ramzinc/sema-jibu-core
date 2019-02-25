const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const kiosk_user=require('../models').kiosk_user;

/* GET kiosks in the database. */
router.get('/', function(req, res) {
	semaLog.info('kiosks - Enter');
	kiosk_user.findAll().then(kioskUsers=>{
		res.send(kioskUsers)
	});
});

module.exports = router;
