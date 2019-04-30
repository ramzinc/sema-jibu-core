// Returns information on a Product mrp.

class ProductMrp {
	constructor(productMrp) {
		this.id = productMrp.id;
		this.siteId = productMrp.kiosk_id;
		this.productId = productMrp.product_id;
		this.salesChannelId = productMrp.sales_channel_id;
		this.priceAmount = productMrp.price_amount;
		this.currencyCode = productMrp.price_currency;
		this.cogsAmount = productMrp.cogs_amount;
	}
	classToPlain(){
		return this;
	}
}

module.exports = ProductMrp;
