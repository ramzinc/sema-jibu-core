class Product {

	constructor(vals) {
		this._productId = vals["id"];
		this._version = vals["version"];
		this._active = vals["active"][0] === 1 ? true : false;
		this._base64encodedImage = vals["base64encoded_image"];
		this._categoryId = vals["category_id"];
		this._description = vals["description"];
		this._maximumQuantity = vals["maximum_quantity"];
		this._minimumQuantity = vals["minimum_quantity"];
		this._priceAmount = vals["price_amount"];
		this._priceCurrency = vals["price_currency"];
		this._sku = vals["sku"];
		this._updatedDate = vals["updated_at"];
		this._unitPerProduct = vals["unit_per_product"];
		this._unitMeasure =vals["unit_measure"];
		this._cogsAmount =vals["cogs_amount"];
	}

	classToPlain() {
		return {
			productId: this._productId,
			active: this._active,
			base64encodedImage: this._base64encodedImage,
			categoryId: this._categoryId,
			description: this._description,
			maximumQuantity: this._maximumQuantity,
			minimumQuantity: this._minimumQuantity,
			priceAmount: this._priceAmount,
			priceCurrency: this._priceCurrency,
			sku: this._sku,
			updatedDate: this._updatedDate,
			unitPerProduct:this._unitPerProduct,
			unitMeasure:this._unitMeasure,
			cogsAmount:this._cogsAmount
		}
	}



	get active() {
		return this._active;
	}


	get base64encodedImage() {
		return this._base64encodedImage;
	}


	get categoryId() {
		return this._categoryId;
	}

	get description() {
		return this._description;
	}

	get maximumQuantity() {
		return this._maximumQuantity;
	}

	get minimumQuantity() {
		return this._minimumQuantity;
	}

	set minimumQuantity(value) {
		this._minimumQuantity = value;
	}

	get priceAmount() {
		return this._priceAmount;
	}

	get priceCurrency() {
		return this._priceCurrency;
	}

	get sku() {
		return this._sku;
	}

	get updatedDate() {
		return this._updatedDate;
	}

	get productId() {
		return this._productId;
	}

}

module.exports = Product;
