const uuidv1 = require('uuid/v1');

class Customer {
	get dueAmount() {
		return this._dueAmount;
	}

	set dueAmount(value) {
		this._dueAmount = value;
	}


	constructor() {
		this._id = "";
		this._address = "";
		this._name = "";
		this._customerTypeId = -1;
		this._gpsCoordinates = "";
		this._siteId = -1;
		this._phoneNumber = "";
		this._createdDate = null;
		this._updatedDate = null;
		this._gender = null;
		this._dueAmount = 0;
	    	this._frequency = "";
		this._reminder_date = null;
	}
    //gets data from the database
	databaseToClass(res) {
		this._customerId = res["id"];
		this._createdDate = new Date(res["created_at"]);
		this._updatedDate = new Date(res["updated_at"]);
		this._active = res["active"][0] === 1 ? true : false;
		this._address = res["address_line1"];
		this._name = res["name"];
		this._customerTypeId = res["customer_type_id"];
		this._salesChannelId = res["sales_channel_id"];
		this._siteId = res["kiosk_id"];
	        this._dueAmount = res["due_amount"];
	    	this._frequency = res["frequency"];
		this._reminder_date = res["reminder_date"];
		if( this._dueAmount === null ){
			this._dueAmount = 0;
		}
		this._gpsCoordinates = res["gps_coordinates"];
		this._phoneNumber = res["phone_number"];
		if (res["address_line2"])
			this.address_line2 = res["address_line2"];
		if (res["address_line3"])
			this.address_line3 = res["address_line3"];

	}

	requestToClass(req) {
		this._address = req.body["address"];
		this._name = req.body["name"];
		this._customerTypeId = req.body["customerTypeId"];
		this._phoneNumber = req.body["phoneNumber"];
		this._salesChannelId = req.body["salesChannelId"];
		this._siteId = req.body["siteId"];
           	this._active = true;
	    	this._frequency = req.body["frequency"];
		this._reminder_date = req.body["reminder_date"];

		if (req.body.hasOwnProperty("customerId")) {
		    this._customerId = req.body["customerId"];
		}else{
			this._customerId =  uuidv1();
		}
		if (req.body.hasOwnProperty("createdDate")) {
			this._createdDate = new Date(req.body["createdDate"]);
		} else {
			this._createdDate = new Date();
		}
		if (req.body.hasOwnProperty("updatedDate")) {
			this._updatedDate = new Date(req.body["updatedDate"]);
		} else {
			this._updatedDate = this._createdDate;
		}
		if (req.body.hasOwnProperty("gpsCoordinates")) {
			this._gpsCoordinates = req.body["gpsCoordinates"];
		}else{
			this._gpsCoordinates = "";
		}

		if (req.body.hasOwnProperty("dueAmount")){
			this._dueAmount = req.body["dueAmount"];
		}else{
			this._dueAmount = 0;
		}
	    	if (req.body.hasOwnProperty("frequency")){
			 this._frequency = req.body["frequency"];
	    	}else{
		         this._frequency ="";
	    	}if(req.body.hasOwnProperty("reminder_date")){
		         this._reminder_date = req.body["reminder_date"];

		}
	}
	updateClass( requestCustomer){
		if (requestCustomer["address"])
			this._address = requestCustomer.address;

		if (requestCustomer.hasOwnProperty("name"))
			this._name = requestCustomer.name;

		if (requestCustomer.hasOwnProperty("gpsCoordinates"))
			this._gpsCoordinates = requestCustomer.gpsCoordinates;

		if (requestCustomer.hasOwnProperty("phoneNumber"))
			this._phoneNumber = requestCustomer.phoneNumber;

		if (requestCustomer.hasOwnProperty("updatedDate")) {
			this._updatedDate = new Date(requestCustomer.updatedDate);
		}else{
			this._updatedDate = new Date();
		}
		if (requestCustomer.hasOwnProperty("salesChannelId")) {
			this._salesChannelId = requestCustomer.salesChannelId;
		}
		if (requestCustomer.hasOwnProperty("customerTypeId")) {
			this._customerTypeId = requestCustomer.customerTypeId;
		}
		if (requestCustomer.hasOwnProperty("dueAmount")) {
			this._dueAmount = requestCustomer.dueAmount;
		}
		if (requestCustomer.hasOwnProperty("active")) {
			this._active = requestCustomer.active;
		}
	    	if (requestCustomer["frequency"]){
		    this._frequency = requestCustomer["frequency"];
		}
		if (requestCustomer["reminder_date"]){
		        this._reminder_date = requestCustomer["reminder_date"];
	  	}
	    }

	
	classToPlain() {
		return {
			customerId: this._customerId,
			createdDate: this._createdDate.toISOString(),
			updatedDate: this._updatedDate.toISOString(),
			active:this._active,
			address: this._address,
			name: this._name,
			customerTypeId: this._customerTypeId,
			salesChannelId:this._salesChannelId,
			gpsCoordinates: this._gpsCoordinates,
			siteId: this._siteId,
			phoneNumber: this._phoneNumber,
		    	dueAmount: this._dueAmount,
			reminder_date : this._reminder_date,
		        frequency: this._frequency
		};
	}


	get customerId() {
		return this._customerId;
	}
	get address() {
		return this._address;
	}
	get name() {
		return this._name;
	}
	get customerTypeId() {
		return this._customerTypeId;
	}
	get gpsCoordinates() {
		return this._gpsCoordinates;
	}
	get siteId() {
		return this._siteId;
	}
	get phoneNumber() {
		return this._phoneNumber;
	}
	get createdDate() {
		return this._createdDate;
	}
	get updatedDate() {
		return this._updatedDate;
	}
	get salesChannelId() {
		return this._salesChannelId;
	}
	get active() {
		return this._active;
	}
	get frequency(){
	        return this._frequency;
    	}
    	get reminder_date(){
	    	return this._reminder_date;
        }

}

module.exports = Customer;
