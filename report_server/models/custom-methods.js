const bcrypt = require('bcrypt');

module.exports = models => {
	// Will execute everytime a user gets created or modified and the password has been changed
	models.user.beforeSave(async (user, options) => {
		if (!user.changed('password')) return;

		try {
			// TODO: bcrypt not playing nice with env variable
			let hash = await bcrypt.hash(user.password, 10);
			user.password = hash;
		} catch (err) {
			console.error(err);
		}
	});

	// Instance level method: to use when comparing passwords on user login
	models.user.prototype.comparePassword = function(pw) {
		return bcrypt.compareSync(pw, this.password);
	};

	// We override the default toJSON so we NEVER send the password
	// to the client
	models.user.prototype.toJSON = async function() {
		var values = Object.assign({}, this.get());
		delete values.password;
		let role = await this.getRoles();

		return {
			id: values.id,
			email: values.email,
			username: values.username,
			firstName: values.first_name,
			lastName: values.last_name,
			active: values.active,
			role: role.map(r => ({ code: r.code, authority: r.authority }))
		};
	};

	models.product.prototype.toJSON = async function() {
		const values = Object.assign({}, this.get());
		const category = await this.getProduct_category();
		const productMrp = await models.product_mrp.findAll({
			where: { product_id: values.id }
		});

		return {
			id: values.id,
			active: !!values.active,
			name: values.name,
			sku: values.sku,
			description: values.description,
			category: {
				id: category.id,
				name: category.name
			},
			priceAmount: values.price_amount,
			priceCurrency: values.price_currency,
			minQuantity: values.minimum_quantity,
			maxQuantity: values.maximum_quantity,
			unitsPerProduct: values.unit_per_product,
			unitMeasurement: values.unit_measure,
			costOfGoods: values.cogs_amount,
			base64Image: values.base64encoded_image,
			productMrp: productMrp.map(p => ({
				id: p.id,
				active: p.active,
				kioskId: p.kiosk_id,
				priceAmount: p.price_amount,
				priceCurrency: p.price_currency,
				productId: p.product_id,
				salesChannelId: p.sales_channel_id,
				costOfGoods: p.cogs_amount
			}))
		};
	};

	models.product_mrp.toJSON = async function() {
		const values = Object.assign({}, this.get());
		return {
			id: values.id,
			kioskId: values.kiosk_id,
			priceAmount: values.price_amount,
			priceCurrency: values.price_currency,
			productId: values.product_id,
			salesChannelId: values.sales_channel_id,
			costOfGoods: values.cogs_amount
		};
	};
};
