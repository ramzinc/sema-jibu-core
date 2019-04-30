class ReceiptSummary {

	constructor(type, beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.type = type;
		this.volume = {data:[]}
		this.total = {data:[]}
	}

	addIncomeGT( value ){
		this.incomeGreaterThan = value;
	}
	addIncomeLT( value ){
		this.incomeLessThan = value;
	}

	addCustomerType( value ){
		this.customerType = value;

	}
	addPaymentType( value ){
		this.paymentType = value;

	}

	addVolumeData( data ){
		this.volume.data.push( data );
	}
	addTotalData( data ){
		this.total.data.push( data );
	}

	classToPlain() {
		return this;
	}

}

module.exports = ReceiptSummary;
