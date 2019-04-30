const express = require('express');
const router = express.Router();
const sprintf = require('sprintf-js').sprintf;
// Note: inporting datejs will extend the native Date class
require('datejs');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const { PeriodData } = require(`${__basedir}/seama_services/datetime_services`);
const { getMostRecentReceipt, getSalesChannels, getCustomerTypes} = require('../seama_services/sql_services');
const {SalesSummary, CustomerSale} = require('../model_layer/SalesSummary');

/* GET data for sales view. */
const sqlTotalCustomers =
	'SELECT COUNT(*) \
    FROM customer_account \
    WHERE customer_account.kiosk_id = ?';

/* Note this returns the number of distinct customers for the period */
const sqlCustomerCount =
	'SELECT COUNT(DISTINCT name) FROM receipt_details where kiosk_id = ? \ ' +
	'AND created_at BETWEEN ? AND ?';

const sqlTotalRevenue =
	'SELECT SUM(total), SUM(cogs) \
	FROM receipt \
	WHERE receipt.kiosk_id = ?';

const sqlRevenueByPeriod =
	'SELECT   SUM(total), SUM(cogs), YEAR(created_at), %s(created_at) \
	FROM      receipt \
	WHERE     kiosk_id=? AND receipt.created_at BETWEEN ? AND ?\
	GROUP BY  YEAR(created_at), %s(created_at) \
	ORDER BY  YEAR(created_at) DESC, %s(created_at) DESC';

// const sqlRevenueAll =
// 	'SELECT   SUM(total), SUM(cogs) \
// 	FROM      receipt \
// 	WHERE     kiosk_id=? AND receipt.created_at BETWEEN ? AND ?';


const sqlCustomersByPeriod =
	'SELECT   COUNT(id), YEAR(created_at), %s(created_at) \
	FROM      customer_account \
	WHERE     kiosk_id=? AND created_at BETWEEN ? AND ?\
	GROUP BY  YEAR(created_at), %s(created_at) \
	ORDER BY  YEAR(created_at) DESC, %s(created_at) DESC';


// const sqlCustomersAll =
// 	'SELECT   SUM(total), SUM(cogs) \
// 	FROM      receipt \
// 	WHERE     kiosk_id=? AND receipt.created_at BETWEEN ? AND ?';

const sqlGallonsPerCustomer =
	'SELECT    SUM(total_gallons), YEAR(created_date), %s(created_date) \
	FROM      receipt \
	WHERE     kiosk_id=?\
	GROUP BY  YEAR(created_date), %s(created_date)\
	ORDER BY  YEAR(created_date) DESC, %s(created_date) DESC';


const sqlRetailerRevenue =
	'SELECT SUM(receipt.total), YEAR(receipt.created_at), %s(receipt.created_at), \ \
	 receipt.customer_account_id, customer_account.name, customer_account.gps_coordinates \
	FROM receipt \
	INNER JOIN customer_account \
	ON customer_account_id = customer_account.id \
	WHERE receipt.kiosk_id = ? AND receipt.created_at BETWEEN ? AND ? \
	GROUP BY YEAR(receipt.created_at), %s(receipt.created_at), receipt.customer_account_id \
	ORDER BY YEAR(receipt.created_at) DESC, %s(receipt.created_at)  DESC, SUM(receipt.total) DESC';

const sqlRetailerRevenueTotal =
	'SELECT SUM(receipt.total), receipt.customer_account_id, customer_account.name, customer_account.gps_coordinates \
	FROM receipt \
	INNER JOIN customer_account \
	ON customer_account_id = customer_account.id \
	WHERE receipt.kiosk_id = ? AND receipt.created_at BETWEEN ? AND ? \
	GROUP BY receipt.customer_account_id \
	ORDER BY SUM(receipt.total) DESC';

const sqlLMostRecentReceipt =
	'SELECT created_date FROM receipt \
	WHERE kiosk_id = ? \
	ORDER BY created_date DESC \
	LIMIT 2';

const sqlLMostRecentCustomer =
	'SELECT created_date FROM customer_amount \
	WHERE kiosk_id = ? \
	ORDER BY created_date DESC \
	LIMIT 2';

router.get('/', async (request, response) => {
	semaLog.info('sema_sales - Enter, kiosk_id:', request.query["site-id"]);

	request.check("site-id", "Parameter site-id is missing").exists();
	request.check("group-by", "Parameter group-by is missing").exists();

	const result = await request.getValidationResult();
	if (!result.isEmpty()) {
		const errors = result.array().map(elem => elem.msg);
		semaLog.error("sema_sales VALIDATION ERROR: ", errors );
		response.status(400).send(errors.toString());
	}else {

		let endDate =null;
		let beginDate = null;
		if( request.query.hasOwnProperty("end-date") || request.query.hasOwnProperty("begin-date")) {
			// If either begin/end date are specified, both must be specified
			if( ! request.query.hasOwnProperty("end-date") || ! request.query.hasOwnProperty("begin-date")) {
				const msg = "sema_sales - Both begin-date AND end-date are required"
				semaLog.error(msg );
				response.status(400).send(msg);
				return;
			}else{
				endDate = new Date(Date.parse(request.query["end-date"]));
				beginDate = new Date(Date.parse(request.query["begin-date"]));
			}
		}

		// Use the most recent receipt as the end date if now is specified (Because there may
		// be many receipts, we don't want the SQL query to span too much tine}
		__pool.getConnection(async (err, connection) => {
			try {
				let mostRecentReceiptDate = await getMostRecentReceipt(connection, request.query["site-id"]);
				if (endDate == null) {
					endDate = new Date(Date.now());
					beginDate = new Date(endDate.getFullYear(), 0);	// 	Default to start of the year
				}
				var salesSummary = new SalesSummary( beginDate, endDate );
				await getTotalCustomers(connection, request.query, salesSummary);
				await getCustomerCount(connection, request.query, salesSummary, beginDate, endDate);
				await getTotalRevenue(connection, request.query, salesSummary);
				await getRevenueByPeriod(connection, request.query, beginDate, endDate, salesSummary);
				// await getGallonsPerCustomer(connection, request.query, results);
				await getCustomersByPeriod(connection, request.query, beginDate, endDate, salesSummary);
				await getCustomerRevenue(connection, request.query, beginDate, endDate, salesSummary);

				connection.release();
				semaLog.info("Sales exit");
				response.json(salesSummary);
			} catch (err) {
				connection.release();
				return __te(err, response, 500, salesSummary);
			}
		});
	}
});

const getTotalCustomers = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlTotalCustomers, [requestParams["site-id"]], (err, sqlResult ) => {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					results.setTotalCustomers(sqlResult[0]["COUNT(*)"]);
				}
				resolve();
			}
		});
	});
};
const getCustomerCount = (connection, requestParams, results, beginDate, endDate ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlCustomerCount, [requestParams["site-id"], beginDate, endDate ], (err, sqlResult ) => {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					results.setCustomerCount(sqlResult[0]["COUNT(DISTINCT name)"]);
				}
				resolve();
			}
		});
	});
};



const getTotalRevenue = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlTotalRevenue, [requestParams["site-id"]], (err, sqlResult ) => {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					results.setTotalRevenue(sqlResult[0]["SUM(total)"]);
					results.setTotalCogs(sqlResult[0]["SUM(cogs)"]);
				}
				resolve();
			}
		});
	});
};

const getRevenueByPeriod = (connection, requestParams, beginDate, endDate, salesSummary ) => {
	return new Promise((resolve, reject) => {
		let groupBy = requestParams["group-by"];
		salesSummary.setTotalRevenuePeriod(groupBy);
		salesSummary.setTotalCogsPeriod(groupBy);
		if( groupBy === "none"){
			resolve();
			return
		}
		let periodsRevenue = salesSummary.getTotalRevenuePeriods();
		let periodsCogs = salesSummary.getTotalCogsPeriods();
		PeriodData.UpdatePeriodDates( periodsRevenue, endDate, groupBy );
		PeriodData.UpdatePeriodDates( periodsCogs, endDate, groupBy );
		let queryBeginDate = (periodsRevenue[periodsRevenue.length-1].beginDate < beginDate) ? periodsRevenue[periodsRevenue.length-1].beginDate : beginDate;
		let sql = sprintf(sqlRevenueByPeriod, groupBy.toUpperCase(), groupBy.toUpperCase(), groupBy.toUpperCase());
		let queryParams = [requestParams["site-id"], queryBeginDate, endDate];

		connection.query(sql, queryParams, (err, sqlResult) => {
			if (err) {
				reject(err);
			} else {
				try{
					getPeriodData(sqlResult, periodsRevenue, "SUM(total)", groupBy );
					getPeriodData(sqlResult, periodsCogs, "SUM(cogs)", groupBy );
					resolve();
				}catch( ex){
					reject( {message:ex.message, stack:ex.stack});
				}
			}
		});
	});
};

const getCustomersByPeriod = (connection, requestParams, beginDate, endDate, salesSummary ) => {
	return new Promise((resolve, reject) => {
		let groupBy = requestParams["group-by"];
		salesSummary.setTotalCustomersPeriod(groupBy);
		if( groupBy === "none"){
			resolve();
			return
		}

		let periods = salesSummary.getTotalCustomersPeriods();
		PeriodData.UpdatePeriodDates( periods, endDate, groupBy );
		let queryBeginDate = (periods[periods.length-1].beginDate < beginDate) ? periods[periods.length-1].beginDate : beginDate;
		let sql = sprintf(sqlCustomersByPeriod, groupBy.toUpperCase(), groupBy.toUpperCase(), groupBy.toUpperCase());

		let queryParams = [requestParams["site-id"], queryBeginDate, endDate]
		connection.query(sql, queryParams, (err, sqlResult) => {
			if (err) {
				reject(err);
			} else {
				try{
					getPeriodData(sqlResult, periods, "COUNT(id)", groupBy );
					resolve();
				}catch( ex){
					reject( {message:ex.message, stack:ex.stack});
				}
			}
		});
	});
};




const getCustomerRevenue = (connection, requestParams, beginDate, endDate, salesSummary ) => {
	if( requestParams["group-by"] === "none"){
		return getCustomerRevenueTotal( connection, requestParams, beginDate, endDate, salesSummary );
	}else {
		return new Promise((resolve, reject) => {
			let groupBy = requestParams["group-by"];
			let periods = salesSummary.getTotalCustomersPeriods();
			let queryBeginDate = (periods[periods.length - 1].beginDate < beginDate) ? periods[periods.length - 1].beginDate : beginDate;
			let queryParams = [requestParams["site-id"], queryBeginDate, endDate]
			const sql = sprintf(sqlRetailerRevenue, groupBy.toUpperCase(), groupBy.toUpperCase(), groupBy.toUpperCase());
			connection.query(sql, queryParams, (err, sqlResult) => {
				if (err) {
					reject(err);
				} else {
					try {
						let index = 0;
						if (Array.isArray(sqlResult) && sqlResult.length > 0) {
							let year = endDate.getFullYear();
							let month = endDate.getMonth() + 1;	// range 1-12
							while (index < sqlResult.length && matchOnGroupBy(sqlResult, index, groupBy, year, month)) {
								updateSalesPeriods(salesSummary, sqlResult, index, month, groupBy, endDate);
								index += 1;
							}
						}
						semaLog.info(index, " Resellers found");
						resolve();
					} catch (ex) {
						reject({ message: ex.message, stack: ex.stack });
					}
				}
			});
		});
	}
};

const getCustomerRevenueTotal = (connection, requestParams, beginDate, endDate, salesSummary ) => {
	return new Promise((resolve, reject) => {
		let groupBy = requestParams["group-by"];
		let periods = salesSummary.getTotalCustomersPeriods();
		let queryBeginDate = beginDate;
		let queryParams = [requestParams["site-id"], queryBeginDate, endDate]
		connection.query(sqlRetailerRevenueTotal, queryParams, (err, sqlResult) => {
			if (err) {
				reject(err);
			} else {
				try{
					let index = 0;
					if (Array.isArray(sqlResult) && sqlResult.length > 0) {
						while( index <  sqlResult.length ){
							updateSales(salesSummary, sqlResult, index, groupBy );
							index +=1;
						}
					}
					semaLog.info(index, " Resellers found");
					resolve();
				}catch( ex){
					reject( {message:ex.message, stack:ex.stack});
				}
			}
		});
	});
};

const getGallonsPerCustomer = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		results.gallonsPerCustomer.period = requestParams["group-by"];
		const sql = sprintf(sqlGallonsPerCustomer, requestParams["group-by"].toUpperCase(), requestParams["group-by"].toUpperCase(), requestParams["group-by"].toUpperCase());
		connection.query(sql, [requestParams.kioskID], (err, sqlResult ) => {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					try {
						results.gallonsPerCustomer.value = sqlResult[0]["SUM(total_gallons)"]/ results.totalCustomers;
					}catch( ex ){
						semaLog.error("getGallonsPerCustomer: ", ex);
					}
				}
				resolve();
			}
		});
	});
};

const matchOnGroupBy = (sqlResult, index, groupBy, year, month ) =>{
	switch( groupBy ){
		case "month":
			return (sqlResult[index]["MONTH(receipt.created_at)"] === month && sqlResult[index]["YEAR(receipt.created_at)"] === year);
		case "year":
			return (sqlResult[index]["YEAR(receipt.created_at)"] === year);
		case "none":
		default:
			return true;
	}
}

const getPeriodData = (sqlResult, periods, column, groupBy) =>{
	if (Array.isArray(sqlResult) ){
		for (let sqlRow of sqlResult) {
			for (let period of periods) {
				switch( groupBy) {
					case "month":
						if (PeriodData.IsExpectedYearMonth(period, new Date(sqlRow["YEAR(created_at)"], sqlRow["MONTH(created_at)"] - 1))) {
							period.setValue(sqlRow[column]);
						}
						break;
					case "year":
						if (PeriodData.IsExpectedYear(period, new Date(sqlRow["YEAR(created_at)"], 0, 1))) {
							period.setValue(sqlRow[column]);
						}
						break;

				}
			}
		}
	}

}
// const getMostRecentCustomer = ( connection, requestParams, endDate ) => {
// 	return new Promise((resolve ) => {
// 		// We already know the customer_account table doesn't have the
// 		// created_date field yet
// 		// TODO: Remove those logical statements once it does
// 		if (false) {
// 			if (endDate != null) {
// 				resolve(endDate);
// 			} else {
// 				connection.query(sqlLMostRecentCustomer, [requestParams.kioskID], (err, sqlResult) => {
// 					if (err) {
// 						resolve(new Date(Date.now()));
// 					} else {
// 						if (Array.isArray(sqlResult) && sqlResult.length > 0) {
// 							endDate = new Date(sqlResult[0]["created_date"]);
// 							resolve(endDate);
// 						}
// 						resolve(new Date(Date.now()));
// 					}
// 				})
// 			}
// 		}else{
// 			resolve(endDate);
// 		}
// 	});
// };

// Calculate the date for the three periods that include endDate, endDate -1 and endDate -2.
// Example for the monthly period; if the current date is June 6 2018, then the
// previous three periods are April, May and June and the beginDate is April 1, 2018
// const calcBeginDate = ( endDate, period ) =>{
// 	switch( period ){
// 		case 'month':
// 		default:
// 			let beginDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1 );
// 			beginDate.addMonths(-2);
// 			return beginDate;
//
// 	}
// };

const updateSales = ( salesSummary, sqlResult, index, groupBy ) => {

	let customer = new CustomerSale(sqlResult[index]["name"], sqlResult[index]["customer_account_id"], groupBy, sqlResult[index]["gps_coordinates"]);

	customer.setTotal( parseFloat(sqlResult[index]["SUM(receipt.total)"]));
	salesSummary.addCustomerSales( customer);
};

const updateSalesPeriods = ( salesSummary, sqlResult, index, month, groupBy, endDate ) => {

	let customer = new CustomerSale(sqlResult[index]["name"], sqlResult[index]["customer_account_id"], groupBy, sqlResult[index]["gps_coordinates"]);

	PeriodData.UpdatePeriodDates( customer.periods, endDate, groupBy );

	customer.periods[0].setValue( parseFloat(sqlResult[index]["SUM(receipt.total)"]));

	index = getPrevPeriodSales( customer, sqlResult, index+1, customer.periods[1], groupBy );
	if( index !== -1 ){
		index = getPrevPeriodSales( customer, sqlResult, index+1, customer.periods[2], groupBy );
	}
	salesSummary.addCustomerSales( customer);
};

const getPrevPeriodSales = ( customer, sqlResult, index, nextPeriod,  groupBy ) => {
	while( index < sqlResult.length ){
		if( sqlResult[index]["customer_account_id"] === customer.id &&
			matchOnGroupBy(sqlResult, index, groupBy, nextPeriod.beginDate.getFullYear(), (nextPeriod.beginDate.getMonth() +1))){
			nextPeriod.setValue( parseFloat(sqlResult[index]["SUM(receipt.total)"]) );
			return index;
		}
		index +=1;
	}
	return -1;
};

// const matchOnGroupBy = (sqlResult, index, groupBy, year, month ) =>{
// const initResults = () => {
// 	return {
// 		newCustomers: {period: "N/A", periods:PeriodData.init3Periods()},
// 		totalRevenue: {total: "N/A", period: "N/A", periods:PeriodData.init3Periods()},
// 		netIncome: {total: "N/A",   period: "N/A",periods:PeriodData.init3Periods()},
// 		retailSales: [],
// 		totalCustomers: "N/A",
// 		gallonsPerCustomer: {period: "N/A", value: "N/A"},
// 		salesByChannel: { labels: [], datasets: []}
//
// 	}
// }


// const periodData = () => {
// 	this.beginDate = "N/A";
// 	this.endDate = "N/A;";
// 	this.periodValue = "N/A";
// 	this.setValue = periodValue =>{ this.periodValue = periodValue} ;
// 	this.setDates = (beginDate, endDate ) => {
// 		this.endDate = endDate;
// 		this.beginDate = beginDate;
// 	};
//
// }

// Return the end of the month
// const calcEndOfMonth = (someDate) => {
// 	return new Date( someDate.getFullYear(), someDate.getMonth(), someDate.getDaysInMonth( someDate.getFullYear(), someDate.getMonth()) );
//
// };

module.exports = router;
