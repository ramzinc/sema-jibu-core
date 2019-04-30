
const sqlLMostRecentReceipt =
	'SELECT created_at FROM receipt \
	WHERE kiosk_id = ? \
	ORDER BY created_at DESC \
	LIMIT 2';

// Return the most recent receipt for a site
const getMostRecentReceipt = ( connection, siteId ) => {
	return new Promise((resolve ) => {
		connection.query(sqlLMostRecentReceipt, [siteId], (err, sqlResult )=> {
			if (err) {
				resolve(new Date(Date.now()));
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					endDate = new Date(sqlResult[0]["created_at"]);
					resolve(endDate);
				}
				resolve(new Date(Date.now()));
			}
		})
	});
};

const sqlSalesChannels= 'SELECT sales_channel.id,  sales_channel.name FROM sales_channel';

const getSalesChannels = (connection ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlSalesChannels, (err, sqlResult ) => {
			if( err ){
				reject(err);
			}else {
				try {
					if (Array.isArray(sqlResult) && sqlResult.length > 0) {
						let salesChannels = sqlResult.map(row => {
							return { name: row.name, id: row.id };
						});
						resolve(salesChannels);

					} else {
						resolve([]);
					}
				}catch( err ){
					reject(err);
				}
			}
		});
	})
};

const sqlCustomerTypes= 'SELECT customer_type.id,  customer_type.name FROM customer_type';

const getCustomerTypes = (connection ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlCustomerTypes, (err, sqlResult ) => {
			if( err ){
				reject(err);
			}else {
				try {
					if (Array.isArray(sqlResult) && sqlResult.length > 0) {
						let customerTypes = sqlResult.map(row => {
							return { name: row.name, id: row.id };
						});
						resolve(customerTypes);

					} else {
						resolve([]);
					}
				}catch( err ){
					reject(err);
				}
			}
		});
	})
};

module.exports = {
	getMostRecentReceipt,
	getSalesChannels,
	getCustomerTypes
};
