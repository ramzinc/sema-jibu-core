const express = require('express');
const router = express.Router();
require('datejs');
const semaLog = require('../seama_services/sema_logger');
const { getMostRecentReceipt, getSalesChannels, getCustomerTypes} = require('../seama_services/sql_services');
const ReceiptSummary = require('../model_layer/ReceiptSummary');


const sqlSalesChannelSummary = 'SELECT SUM(volume), SUM(total), COUNT(receipt_id),  COUNT(DISTINCT(customer_account_id)) \
					FROM receipt_details \
					WHERE  sales_channel_id  = ? AND kiosk_id = ? \
					AND created_at BETWEEN ? AND ?';

const sqlCustomerTypeSummary = 'SELECT SUM(volume)\
					FROM receipt_details \
					WHERE customer_type_id = ? AND kiosk_id = ? \
					AND created_at BETWEEN ? AND ?';



router.get('/', async( request, response ) => {
	semaLog.info( 'sema_receipt_summary Entry - SiteId: - ', request.query["site-id"]);

	request.check("site-id", "Parameter site-id is missing").exists();
	request.check("type", "Summary type is missing").exists();

	const result = await request.getValidationResult();
	if (!result.isEmpty()) {
		const errors = result.array().map((elem) => {
			return elem.msg;
		});
		semaLog.error("sema_receipt_summary VALIDATION ERROR: ", errors );
		response.status(400).send(errors.toString());
	} else {

		let endDate =null;
		let beginDate = null;
		if( request.query.hasOwnProperty("end-date") || request.query.hasOwnProperty("begin-date")) {
			// If either begin/end date are specified, both must be specified
			if( ! request.query.hasOwnProperty("end-date") || ! request.query.hasOwnProperty("begin-date")) {
				const msg = "sema_receipt_summary - Both begin-date AND end-date are required"
				semaLog.error(msg );
				response.status(400).send(msg);
				return;
			}else{
				endDate = new Date(Date.parse(request.query["end-date"]));
				beginDate = new Date(Date.parse(request.query["begin-date"]));
			}
		}

		// Check for income and customerType qualifiers
		__pool.getConnection(async (err, connection) => {
			var rSummary = null;
			try {
				if (endDate == null) {
					endDate = await getMostRecentReceipt(connection, request.query["site-id"]);
					beginDate = new Date(endDate.getFullYear(), 0);	// 	Default to start of the year
				}
				const receiptSummary = new ReceiptSummary( request.query.type, beginDate, endDate);
				rSummary = receiptSummary;
				let params = [request.query["site-id"], beginDate, endDate];
				let sqlQualifier = "";
				if( request.query.hasOwnProperty("income-lt") && request.query.hasOwnProperty("income-gt") ){
					sqlQualifier = " AND income_level BETWEEN ? AND ? ";
					params.push( request.query["income-gt"]);
					params.push( request.query["income-lt"]);
					receiptSummary.addIncomeGT( request.query["income-gt"]);
					receiptSummary.addIncomeLT( request.query["income-lt"]);
				}else if( request.query.hasOwnProperty("income-lt") ){
					sqlQualifier = " AND income_level < ? ";
					params.push( request.query["income-lt"]);
					receiptSummary.addIncomeLT( request.query["income-lt"]);
				}else if( request.query.hasOwnProperty("income-gt") ){
					sqlQualifier = " AND income_level > ? ";
					params.push( request.query["income-gt"]);
					receiptSummary.addIncomeGT( request.query["income-gt"]);
				}
				if( request.query.hasOwnProperty("customer-type") ){
					sqlQualifier = sqlQualifier + " AND customer_type_id = ? ";
					params.push( request.query["customer-type"]);
					receiptSummary.addCustomerType( request.query["customer-type"]);
				}
				if( request.query.hasOwnProperty("payment-type") ){
					const paymentType = getPaymentType( request.query["payment-type"] );
					if( paymentType === null ){
						throw new Error("Invalid payment-type");
					}
					sqlQualifier = sqlQualifier + " AND " + paymentType + " > 0 ";
					receiptSummary.addPaymentType( request.query["payment-type"]);
				}

				if (request.query.type == "sales-channel") {
					const salesChannels = await getSalesChannels(connection);
					for (let index = 0; index < salesChannels.length; index++) {
						await getReceiptChannelSummary(connection, salesChannels[index], sqlQualifier, params, receiptSummary);
					}
				}else{
					const customerTypes = await getCustomerTypes(connection);
					for (let index = 0; index < customerTypes.length; index++) {
						await getReceiptTypeSummary(connection, customerTypes[index], sqlQualifier, params, receiptSummary);
					}

				}
				semaLog.info("sema_receipt_summary exit");
				response.json(receiptSummary.classToPlain());
				connection.release();
			} catch (err) {
				connection.release();
				__te(err, response, 500, rSummary);
			}
		});

	}
});


const getReceiptChannelSummary = ( connection, salesChannel, sqlQualifier, params, receiptSummary) =>{
	return new Promise((resolve, reject ) => {
		let queryParams = params.slice();
		queryParams.unshift( salesChannel.id );
		let sqlQuery = sqlSalesChannelSummary + sqlQualifier;
		connection.query(sqlQuery, queryParams, (err, sqlResult) => {
			if (!err) {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					let volume = 0;
					if(  sqlResult[0]["SUM(volume)"] != null ) {
						volume = parseFloat( sqlResult[0]["SUM(volume)"].toFixed(2));
					}
					receiptSummary.addVolumeData({ salesChannel: salesChannel.name, volume:volume } );

					let total = 0;
					if(  sqlResult[0]["SUM(total)"] != null ) {
						total = parseFloat( sqlResult[0]["SUM(total)"].toFixed(2));
					}
					let numReceipts = 0;
					if(  sqlResult[0]["COUNT(receipt_id)"] != null ) {
						numReceipts = sqlResult[0]["COUNT(receipt_id)"];
					}

					let numCustomers = 0;
					if(  sqlResult[0]["COUNT(DISTINCT(customer_account_id))"] != null ) {
						numCustomers = sqlResult[0]["COUNT(DISTINCT(customer_account_id))"];
					}

					receiptSummary.addTotalData({ salesChannel: salesChannel.name, total:total, receipts:numReceipts, numberCustomers:numCustomers } );
					semaLog.info("getReceiptChannelSummary - processed salesChannel ", salesChannel.name );
					resolve();
				}
			}else{
				semaLog.error( "getReceiptChannelSummary - error: " + err.message);
				reject( err );
			}
		});
	});
};


const getReceiptTypeSummary = ( connection, customerType,  sqlQualifier, params, receiptSummary) =>{
	return new Promise((resolve, reject ) => {
		let queryParams = params.slice();
		queryParams.unshift( customerType.id );
		let sqlQuery = sqlSalesChannelSummary + sqlQualifier;
		connection.query(sqlQuery, queryParams, (err, sqlResult) => {
			if (!err) {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					let volume = 0;
					if(  sqlResult[0]["SUM(volume)"] != null ) {
						volume = parseFloat(sqlResult[0]["SUM(volume)"].toFixed(2));
					}
					receiptSummary.addData({ customerType: customerType.name, volume:volume } );
					semaLog.info("getReceiptTypeSummary - processed customerType ", customerType.name );
					resolve();
				}
			}else{
				semaLog.error( "getReceiptTypeSummary - error: " + err.message);
				reject( err );
			}
		});
	});
};

const getPaymentType =  param =>{
	switch( param){
		case "cash":
			return "amount_cash";
		case "mobile":
			return "amount_mobile";
		case "loan":
			return "amount_loan";
		case "card":
			return "amount_card";
		default:
			return null;

	}
}

module.exports = router;
