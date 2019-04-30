const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const db = require('../../models');

router.get('/', async (req, res) => {
	semaLog.info('/GET sales_channel - Enter');

	try {
		let channels = await db.sales_channel.findAll();
		let channelsData = await Promise.all(
			channels.map(async channel => await channel.toJSON())
		);
		res.json({ salesChannels: channelsData });
	} catch (err) {
		semaLog.error(`/GET sales_channel failed - ${err}`);
		res.status(400).json({
			message: `Failed to /GET sales_channel ${err}`,
			err: `${err}`
		});
	}
});

module.exports = router;
