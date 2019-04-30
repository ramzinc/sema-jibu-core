const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const db = require('../../models');

router.get('/', async (req, res) => {
	semaLog.info('/GET product_category - Enter');

	try {
		let categories = await db.product_category.findAll();
		let categoryData = await Promise.all(
			categories.map(async category => await category.toJSON())
		);
		res.json({ productCategories: categoryData });
	} catch (err) {
		semaLog.error(`/GET product_category failed - ${err}`);
		res.status(400).json({
			message: `Failed to /GET product_category ${err}`,
			err: `${err}`
		});
	}
});

module.exports = router;
