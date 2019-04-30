const express = require('express');
const router = express.Router();
require('datejs');
const semaLog = require('../seama_services/sema_logger');

/* GET data for sales_by_channel  */


const sqlSalesChannels=
	'SELECT sales_channel.id,  sales_channel.name\
	FROM sales_channel';

const sqlSalesByChannel = 'SELECT * \
		FROM receipt \
		WHERE receipt.kiosk_id = ? AND receipt.sales_channel_id = ? \
		AND receipt.created_date BETWEEN ? AND ? \
		ORDER BY receipt.created_date';

const sqlLMostRecentReceipt =
	'SELECT created_date FROM receipt \
	WHERE kiosk_id = ? \
	ORDER BY created_date DESC \
	LIMIT 2';


router.get('/', function( request, response ) {
	semaLog.info( 'sales-by-channel Entry - kiosk: - ', request.query.kioskID );
	let results = initResults();

	request.check("kioskID", "Parameter kioskID is missing").exists();
	request.check("groupby", "Parameter groupby is missing").exists();

	request.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("sales-by-channel VALIDATION ERROR: ", errors );
			response.status(400).send(errors.toString());
		} else {

			let endDate =null;
			let beginDate = null;
			if( request.query.hasOwnProperty("enddate")) {
				endDate = new Date(Date.parse(request.query.enddate));
			}

			__pool.getConnection((err, connection) => {
				getMostRecentReceipt(connection, request.query, endDate).then((newEndDate) => {
					endDate = newEndDate;
					beginDate = new Date(newEndDate.getFullYear(), 0);	// 	Default to start of the year

					results.salesByChannel.beginDate = beginDate;
					results.salesByChannel.endDate = endDate;
					getSalesChannels(connection).then((salesChannel) => {
						execSalesByChannel(salesChannel, 0, connection, request.query.kioskID, beginDate, endDate, response, results);
					}).catch((err) => {
						yieldError(err, response, 500, results);
					});
				}).then(() => {
					connection.release();
				});
			});
		}
	});
});

const getSalesChannels = (connection ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlSalesChannels, function(err, sqlResult ) {
			if( err ){
				reject(err);
			}else {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					let salesChannel = sqlResult.map(row => {
						return {name: row.name, id: row.id};
					});
					resolve(salesChannel);

				}else{
					resolve([]);
				}
			}
		});
	})
};


const execSalesByChannel = ( salesChannelArray, index, connection, kiosk, beginDate, endDate, response, results ) =>{
	connection.query(sqlSalesByChannel, [kiosk, salesChannelArray[index].id, beginDate, endDate], function(err, sqlResult ) {
		if( err ){
			yieldError( err, response, 500,results );
		}else{
			if (Array.isArray(sqlResult) && sqlResult.length > 0) {
				let salesData = sqlResult.map(row =>{ return {x:row.created_date, y:row.customer_amount}} );

				results.salesByChannel.datasets.push({label:salesChannelArray[index].name, data:salesData});
			}
			index++;
			if( index === salesChannelArray.length ){
				// All done
				yieldResults( response, results );
			}else{
				execSalesByChannel( salesChannelArray, index, connection, kiosk, beginDate, endDate, response, results);
			}
		}
	});
};

const getMostRecentReceipt = ( connection, requestParams, endDate ) => {
	return new Promise((resolve ) => {
		if( endDate != null ){
			resolve( endDate);
		}else{
			connection.query(sqlLMostRecentReceipt, [requestParams.kioskID], (err, sqlResult )=>{
				if (err) {
					resolve(new Date(Date.now()));
				}else{
					if (Array.isArray(sqlResult) && sqlResult.length > 0) {
						endDate = new Date(sqlResult[0]["created_date"]);
						resolve( endDate );
					}
					resolve(new Date(Date.now()));
				}
			})
		}
	});
};

const yieldResults =(response, results ) =>{
	semaLog.info("sales-by-channel exit");
	response.json(results);
};

const yieldError = (err, response, httpErrorCode, results ) =>{
	semaLog.error("sales-by-channel: ERROR: ", err.message, "HTTP Error code: ", httpErrorCode);
	response.status(httpErrorCode);
	response.json(results);
};
const initResults = () =>{
	return {
		// salesByChannel: { labels: [], datasets: []}
		salesByChannel: { beginDate:"N/A", endDate: "N/A", datasets: []}

	}
};



module.exports = router;
