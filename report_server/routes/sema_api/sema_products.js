// TODO merge with sema-products.js
const express = require('express');
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const router = express.Router();
const omit = require('lodash').omit;
const isNull = require('lodash').isNull;
const { check, validationResult } = require('express-validator/check');
const Op = Sequelize.Op;
const db = require('../../models');

// TODO add more validations
const createProductValidator = [
	check('sku')
		.exists({ checkFalsy: true })
		.withMessage('SKU is required')
];

const mapProductFromClient = values => ({
	active: values.active ? 1 : 0,
	name: values.name,
	sku: values.sku,
	description: values.description,
	category_id: values.category,
	price_amount: values.priceAmount,
	price_currency: values.priceCurrency,
	minimum_quantity: values.minQuantity ? values.minQuantity : null,
	maximum_quantity: values.maxQuantity ? values.maxQuantity : null,
	unit_per_product: values.unitsPerProduct,
	unit_measure: values.unitMeasurement,
	cogs_amount: values.costOfGoods,
	base64encoded_image: values.image
});

const mapProductMrpFromClient = values => ({
	id: values.id ? values.id : null,
	active: values.active ? 1 : 0,
	kiosk_id: values.kioskId,
	price_amount: values.priceAmount,
	price_currency: values.priceCurrency,
	product_id: values.productId,
	sales_channel_id: values.salesChannelId,
	cogs_amount: values.costOfGoods
});

router.get('/', async (req, res) => {
	semaLog.info('/GET products - Enter');

	try {
		let products = await db.product.findAll();
		let productData = await Promise.all(
			products.map(async product => await product.toJSON())
		);
		res.json({ products: productData });
	} catch (err) {
		semaLog.error(`GET products failed - ${err}`);
		res.status(400).json({
			message: `Failed to GET products ${err}`,
			err: `${err}`
		});
	}
});

router.get('/:id', async (req, res) => {
	semaLog.info('/GET product by id - Enter');
	const productId = req.params.id;
	try {
		let product = await db.product.findOne({ where: { id: productId } });
		res.json({
			product: await product.toJSON()
		});
	} catch (err) {
		semaLog.error(`/GET product by id failed - ${err}`);
		res.status(400).json({
			message: `Failed to /GET product by id ${err}`,
			err: `${err}`
		});
	}
});

router.post('/', async (req, res) => {
	semaLog.info('/POST products - Enter');
	const payload = req.body.data;

	try {
		let product = await db.product.findOne({ where: { sku: payload.sku } });
		if (product) throw new Error('SKU must be unique');

		const productObject = mapProductFromClient(payload);
		let createdProduct = await db.product.create(productObject);

		const productMrps = payload.productMrp.map(values => ({
			active: values.active ? 1 : 0,
			kiosk_id: values.kioskId,
			price_amount: values.priceAmount,
			price_currency: createdProduct.price_currency,
			product_id: createdProduct.id,
			sales_channel_id: values.salesChannelId,
			cogs_amount: createdProduct.cogs_amount
		}));
		let mrps = await db.product_mrp.bulkCreate(productMrps);

		res.json({
			data: {
				product: await createdProduct.toJSON()
			}
		});
	} catch (err) {
		semaLog.error(`/POST product failed - ${err}`);
		res.status(400).json({
			message: `Failed to /POST product  ${err}`,
			err: `${err}`
		});
	}
});

router.put('/:id', async (req, res) => {
	semaLog.info('/PUT products - Enter');
	const payload = req.body.data;

	try {
		let product = await db.product.findOne({
			where: { id: req.params.id }
		});
		if (!product) throw new Error('Product not found');

		const productObject = mapProductFromClient(payload);

		let updatedObject = await product.update(productObject);
		const productMrps = payload.productMrp
			.map(values => ({
				id: values.id ? values.id : null,
				active: values.active ? 1 : 0,
				kiosk_id: values.kioskId,
				price_amount: values.priceAmount,
				price_currency: updatedObject.price_currency,
				product_id: updatedObject.id,
				sales_channel_id: values.salesChannelId,
				cogs_amount: updatedObject.cogs_amount
			}))
			.filter(key => key !== isNull);

		productMrps.map(async mrp => {
			if (mrp.id) {
				let updateMrp = await db.product_mrp.find({
					where: { id: mrp.id }
				});
				omit(mrp, 'id');
				updateMrp.update(mrp);
			} else {
				let createdMrp = await db.product_mrp.create(mrp);
			}
		});

		res.json({
			data: {
				product: await updatedObject.toJSON()
			}
		});
	} catch (err) {
		semaLog.error(`/PUT product failed - ${err}`);
		res.status(400).json({
			message: `/PUT product failed ${err}`,
			err: `${err}`
		});
	}
});

router.delete('/:id', async (req, res) => {
	semaLog.info('/DELETE products - Enter');
	res.send('/DELETE product - not implemented yet');
});

module.exports = router;
