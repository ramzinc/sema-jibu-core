const express = require('express');
const router = express.Router();
require('datejs');
const semaLog = require('../seama_services/sema_logger');
const CustomerSummary = require('../model_layer/CustomerSummary');

// Not that the consumer base per kiosk is simply the sum of consumer_base divided by the count of customers
const sqlCustomerSummary = "SELECT COUNT(customer_name), SUM(kiosk_consumer_base)/COUNT(customer_name),  SUM(customer_consumer_base) \
 					FROM customer_details \
					WHERE  kiosk_id = ? \
					AND active = b'1' \
					AND created_at BETWEEN ? AND ?";




router.get('/', async( request, response ) => {
	semaLog.info( 'sema_customer_summary Entry - SiteId: - ', request.query["site-id"]);

	request.check("site-id", "Parameter site-id is missing").exists();

	const result = await request.getValidationResult();
	if (!result.isEmpty()) {
		const errors = result.array().map((elem) => {
			return elem.msg;
		});
		semaLog.error("sema_customer_summary VALIDATION ERROR: ", errors );
		response.status(400).send(errors.toString());
	} else {

		let endDate =null;
		let beginDate = null;
		if( request.query.hasOwnProperty("end-date") || request.query.hasOwnProperty("begin-date")) {
			// If either begin/end date are specified, both must be specified
			if( ! request.query.hasOwnProperty("end-date") || ! request.query.hasOwnProperty("begin-date")) {
				const msg = "sema_customer_summary - Both begin-date AND end-date are required"
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
			try {
				if (endDate == null) {
					endDate = new Date(Date.now());
					beginDate = new Date(endDate.getFullYear(), 0);	// 	Default to start of the year
				}
				const customerSummary = new CustomerSummary( beginDate, endDate);
				let params = [request.query["site-id"], beginDate, endDate];
				let sqlQualifier = "";

				// Check for income qualifiers
				if( request.query.hasOwnProperty("income-lt") && request.query.hasOwnProperty("income-gt") ){
					sqlQualifier = " AND income_level BETWEEN ? AND ? ";
					params.push( request.query["income-gt"]);
					params.push( request.query["income-lt"]);
					customerSummary.addIncomeGT( request.query["income-gt"]);
					customerSummary.addIncomeLT( request.query["income-lt"]);
				}else if( request.query.hasOwnProperty("income-lt") ){
					sqlQualifier = " AND income_level < ? ";
					params.push( request.query["income-lt"]);
					customerSummary.addIncomeLT( request.query["income-lt"]);
				}else if( request.query.hasOwnProperty("income-gt") ){
					sqlQualifier = " AND income_level > ? ";
					params.push( request.query["income-gt"]);
					customerSummary.addIncomeGT( request.query["income-gt"]);
				}
				if( request.query.hasOwnProperty("gender") ){
					sqlQualifier = sqlQualifier + " AND gender = ? ";
					params.push( request.query["gender"]);
					customerSummary.addGender( request.query["gender"]);
				}

				// Check for distance qualifiers
				if( request.query.hasOwnProperty("distance-lt") && request.query.hasOwnProperty("distance-gt") ){
					sqlQualifier = " AND distance BETWEEN ? AND ? ";
					params.push( request.query["distance-gt"]);
					params.push( request.query["distance-lt"]);
					customerSummary.addDistanceGT( request.query["distance-gt"]);
					customerSummary.addDistanceLT( request.query["distance-lt"]);
				}else if( request.query.hasOwnProperty("distance-lt") ){
					sqlQualifier = " AND distance < ? ";
					params.push( request.query["distance-lt"]);
					customerSummary.addDistanceLT( request.query["distance-lt"]);
				}else if( request.query.hasOwnProperty("distance-gt") ){
					sqlQualifier = " AND distance > ? ";
					params.push( request.query["distance-gt"]);
					customerSummary.addDistanceGT( request.query["distance-gt"]);
				}
				if( request.query.hasOwnProperty("gender") ){
					sqlQualifier = sqlQualifier + " AND gender = ? ";
					params.push( request.query["gender"]);
					customerSummary.addGender( request.query["gender"]);
				}

				await getCustomerSummary(connection, sqlQualifier, params, customerSummary);

				semaLog.info("sema_customer_summary exit");
				response.json(customerSummary.classToPlain());
				connection.release();
			} catch (err) {
				connection.release();
				__te(err, response, 500, {});
			}
		});

	}
});


const getCustomerSummary = ( connection, sqlQualifier, params, customerSummary) =>{
	return new Promise((resolve, reject ) => {
		let sqlQuery = sqlCustomerSummary + sqlQualifier;
		connection.query(sqlQuery, params, (err, sqlResult) => {
			if (!err) {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					if(  sqlResult[0]["COUNT(customer_name)"] != null ) {
						customerSummary.addCustomerCount( sqlResult[0]["COUNT(customer_name)"] );
					}
					// Note site_consumer_base is the potential number of consumers this kiosk/site may service
					if(  sqlResult[0]["SUM(kiosk_consumer_base)/COUNT(customer_name)"] != null ) {
						customerSummary.addSiteConsumerBase( sqlResult[0]["SUM(kiosk_consumer_base)/COUNT(customer_name)"] );
					}
					if(  sqlResult[0]["SUM(customer_consumer_base)"] != null ) {
						customerSummary.addCustomerConsumerBase( sqlResult[0]["SUM(customer_consumer_base)"] );
					}
					resolve();
				}
			}else{
				semaLog.error( "getCustomerSummary - error: " + err.message);
				reject( err );
			}
		});
	});
};


module.exports = router;
