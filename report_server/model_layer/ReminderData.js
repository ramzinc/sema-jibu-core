const semaLog = require('../seama_services/sema_logger');
class ReminderData{
    constructor(requestBody){
	this._customer_name=requestBody["name"];
	this._frequency= requestBody["frequency"];
	this._reminder_date=requestBody["reminder_date"];
	this._kiosk_id=requestBody["kioskId"];
	this.sales_channel_id =requestBody["salesChannelId"];
	this.customerId=requestBody["customer_id"];
	this.amountDue=requestBody["due_amount"];
	this.receipt=requestBody["receipt"];
	this.customerTypeId = requestBody["customerTypeId"];
	this.createdAt = requestBody["createdAt"];
	this.comment= requestBody["comment"];
	//semaLog.info("Creating reminderData Object" + this._reminder_date);
	//TO DO need to refactor the naming scheme.
	return {
	//    name: this._customer_name,
	 //   kiosk_id: this._kiosk_id,
	    frequency : this._frequency,
	    createdAt: this.createdAt,
	 //   address:  this._address,
	 //  phoneNumber: this._phone_number,
	 // amount_cash:  this._amount_cash,
	 // dueAmount:this.amountDue,
	 //  product_name: this._product_name,
	 //  total: this._total,
	 // salesChannelId:this.sales_channel_id,
	    // customerTypeId:this.customerTypeId,
	    comment: this.comment,
	    customerId:this.customerId,
	    receipt:this.receipt,
	    reminder_date: this._reminder_date
	};

	

    }



    }

module.exports = ReminderData;
