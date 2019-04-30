class Receipt {

	constructor(jsonBody){
		this.id = jsonBody["id"];
		this.createdDate = new Date( jsonBody["createdDate"]);
		this.updatedDate = this.createdDate;
		this.currencyCode = jsonBody["currencyCode"];
		this.customerId = jsonBody["customerId"];
		if( jsonBody.hasOwnProperty("amountCash")) {
			this.amountCash = jsonBody["amountCash"];
		}else{
			this.amountCash = 0;
		}
		if( jsonBody.hasOwnProperty("amountMobile")) {
			this.amountMobile = jsonBody["amountMobile"];
		}else{
			this.amountMobile = 0;
		}
		if( jsonBody.hasOwnProperty("amountLoan")) {
			this.amountLoan = jsonBody["amountLoan"];
		}else{
			this.amountLoan = 0;
		}
		if( jsonBody.hasOwnProperty("amountCard")) {
			this.amountCard = jsonBody["amountCard"];
		}else{
			this.amountCard = 0;
		}
		this.siteId = jsonBody["siteId"];
		this.paymentType = jsonBody["paymentType"];	//
		this.salesChannelId = jsonBody["salesChannelId"];
		this.customerTypeId = jsonBody["customerTypeId"];
		this.total = jsonBody["total"];
		this.cogs = jsonBody["cogs"];
		this.receiptId = jsonBody["receiptId"];
		this.products = jsonBody["products"].map( product =>{
			return {
				createdDate: this.createdDate,
				updatedDate: this.updatedDate,
				currencyCode: this.currencyCode,
				priceTotal:product.priceTotal,
				quantity:product.quantity,
				receiptId:this.id,
				productId: product.productId,
				cogsTotal: product.cogsTotal,
				active: product.active === 0 ? 0 : 1
			}
		});
	}


	classToPlain() {
		return this;
	}

	// classToPlain() {
	// 	return {
	// 		id:this._id,
	// 		createdDate:this._createdDate,
	// 		currencyCode: this._currencyCode,
	// 		customerId: this._customerId,
	// 		amountCash: this._amountCash,
	// 		amountMobile: this._amountMobile,
	// 		amountLoan: this._amountLoan,
	// 		receiptId: this._receiptId,
	// 		siteId: this._siteId,
	// 		createdDate: this._createdDate,
	// 		total: this._totalSales,
	// 		receiptId: this._cogs,
	// 		products: this._products,
	// 		salesChannelId: this._salesChannelId
	// 	}
	// }

}

module.exports = Receipt;
