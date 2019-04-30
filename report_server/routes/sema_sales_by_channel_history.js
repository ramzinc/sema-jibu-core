const express = require('express');
const router = express.Router();
require('datejs');
const semaLog = require('../seama_services/sema_logger');
const { getMostRecentReceipt, getSalesChannels} = require('../seama_services/sql_services');



// const sqlSalesByChannel = 'SELECT * \
// 		FROM receipt \
// 		WHERE receipt.kiosk_id = ? AND receipt.sales_channel_id = ? \
// 		AND receipt.created_at BETWEEN ? AND ? \
// 		ORDER BY receipt.created_at';

const sqlSalesByChannelDay = 'SELECT YEAR(receipt.created_at), MONTH(receipt.created_at), DAY(receipt.created_at), SUM(receipt.total), SUM(receipt.cogs) \
	FROM receipt \
	WHERE receipt.kiosk_id = ? AND receipt.sales_channel_id = ? AND receipt.created_at BETWEEN ? AND ? \
	GROUP BY YEAR(receipt.created_at), MONTH(receipt.created_at), DAY(receipt.created_at) \
	ORDER BY  YEAR(receipt.created_at) ASC, MONTH(receipt.created_at) ASC, DAY(receipt.created_at) ASC';

const sqlSalesByChannelMonth = 'SELECT YEAR(receipt.created_at), MONTH(receipt.created_at), SUM(receipt.total), SUM(receipt.cogs) \
	FROM receipt \
	WHERE receipt.kiosk_id = ? AND receipt.sales_channel_id = ? AND receipt.created_at BETWEEN ? AND ? \
	GROUP BY YEAR(receipt.created_at), MONTH(receipt.created_at) \
	ORDER BY  YEAR(receipt.created_at) ASC, MONTH(receipt.created_at) ASC';

router.get('/', async( request, response ) => {
	semaLog.info( 'sales_by_channel_history Entry - kiosk: - ', request.query["site-id"]);
	let results = initResults();

	request.check("site-id", "Parameter site-id is missing").exists();

	const result = await request.getValidationResult();
	if (!result.isEmpty()) {
		const errors = result.array().map((elem) => {
			return elem.msg;
		});
		semaLog.error("sales_by_channel_history VALIDATION ERROR: ", errors );
		response.status(400).send(errors.toString());
	} else {

		let endDate =null;
		let beginDate = null;
		if( request.query.hasOwnProperty("end-date") || request.query.hasOwnProperty("begin-date")) {
			// If either begin/end date are specified, both must be specified
			if( ! request.query.hasOwnProperty("end-date") || ! request.query.hasOwnProperty("begin-date")) {
				const msg = "sales_by_channel_history - Both begin-date AND end-date are required";
				semaLog.error(msg );
				response.status(400).send(msg);
				return;
			}else{
				endDate = new Date(Date.parse(request.query["end-date"]));
				beginDate = new Date(Date.parse(request.query["begin-date"]));
			}
		}
		__pool.getConnection(async (err, connection) => {
			try {
				if (endDate == null) {
					endDate = new Date(Date.now());
					beginDate = new Date(endDate.getFullYear(), 0);	// 	Default to start of the year
				}
				results.salesByChannel.beginDate = beginDate;
				results.salesByChannel.endDate = endDate;
				const salesChannels = await getSalesChannels(connection);
				let groupBy = "day";
				if( request.query.hasOwnProperty("group-by")){
					groupBy = request.query["group-by"];
					results.salesByChannel.groupBy = groupBy;
				}

				for( let index = 0; index < salesChannels.length; index++  ){
					await getSalesByChannel( connection, salesChannels[index], request.query["site-id"], beginDate, endDate, groupBy, results );
				}
				semaLog.info("sales-by-channel exit");
				response.json(results);
				connection.release();
			} catch (err) {
				connection.release();
				__te(err, response, 500, results);
			}
		});

	}
});


const getSalesByChannel = ( connection, salesChannel, kioskId, beginDate, endDate, groupBy, results) =>{
	return new Promise((resolve, reject ) => {
		let sqlQuery = sqlSalesByChannelDay;
		if( groupBy === "month" ){
			sqlQuery = sqlSalesByChannelMonth
		}
		connection.query(sqlQuery, [kioskId, salesChannel.id, beginDate, endDate], (err, sqlResult) => {
			if (!err) {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					let salesTotal = [];
					let salesCogs = []
					sqlResult.forEach(item => {
						let readingDate= null;
						if( groupBy === "month"){
							readingDate=  new Date(item["YEAR(receipt.created_at)"], item["MONTH(receipt.created_at)"] - 1 );

						}else{
							readingDate=  new Date(item["YEAR(receipt.created_at)"], item["MONTH(receipt.created_at)"] - 1, item["DAY(receipt.created_at)"]);
						}

						salesTotal.push ( { x: readingDate, y: parseFloat( item["SUM(receipt.total)"]) });
						salesCogs.push ( { x: readingDate, y: parseFloat( item["SUM(receipt.cogs)"]) });

					});
					results.salesByChannel.datasets.push({ salesChannel: salesChannel.name, type:"total", data: salesTotal });
					results.salesByChannel.datasets.push({ salesChannel: salesChannel.name, type:"cogs", data: salesCogs });

					semaLog.info("getSalesByChannel - processed salesChannel ", salesChannel.name );
					resolve();
				}else{
					results.salesByChannel.datasets.push({ salesChannel: salesChannel.name, type:"total", data: [] });
					results.salesByChannel.datasets.push({ salesChannel: salesChannel.name, type:"cogs", data: [] });
					resolve();
				}
			}else{
				semaLog.error( "getSalesByChannel - error: " + err.message);
				reject( err );
			}
		});
	});
};


const initResults = () =>{
	return {
		// salesByChannel: { labels: [], datasets: []}
		salesByChannel: { beginDate:"N/A", endDate: "N/A", groupBy:"day", datasets: []}

	}
};



module.exports = router;
