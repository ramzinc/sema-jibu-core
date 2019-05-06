const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const Customer = require('../model_layer/Customer');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

/* GET customers in the database. */

const sqlSiteIdOnly =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'";
const sqlBeginDateOnly =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'" +
	'AND created_at >= ?';
const sqlEndDateOnly =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'" +
	'AND created_at <= ?';
const sqlBeginEndDate =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'" +
	'AND created_at BETWEEN ? AND ?';
const sqlUpdatedDate =
	'SELECT * ' +
	'FROM customer_account ' +
	'WHERE kiosk_id = ? ' +
	'AND updated_at > ?';

const sqlDeleteCustomers = 'DELETE FROM customer_account WHERE id = ?';
const sqlGetCustomerById = 'SELECT * FROM customer_account WHERE id = ?';

const sqlInsertCustomer =
	'INSERT INTO customer_account ' +
	'(id, created_at, name, customer_type_id, sales_channel_id, kiosk_id, ' +
	'due_amount, address_line1, gps_coordinates, phone_number, active ) ' +
	'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

// const sqlUpdateCustomers = 	"UPDATE customer_account " +
// 	"SET name = ?, sales_channel_id = ?, customer_type_id = ?," +
// 		"due_amount = ?, address_line1 = ?, gps_coordinates = ?, " +
// 		"phone_number = ?, active = ? " +
// 	"WHERE id = ?";
const sqlUpdateCustomers =
	'UPDATE customer_account ' +
	'SET name = ?, sales_channel_id = ?, customer_type_id = ?,' +
	'due_amount = ?, address_line1 = ?, gps_coordinates = ?, ' +
	'phone_number = ?,frequency = ?, reminder_date=?,active = ? ' +
	'WHERE id = ?';

router.put('/:id', async (req, res) => {
	semaLog.info('PUT sema_customer - Enter');
	req.check('id', 'Parameter id is missing').exists();

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('PUT customer, Validation error' + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('CustomerId: ' + req.params.id);
			findCustomers(sqlGetCustomerById, req.params.id).then(
				function(result) {
					let customer = new Customer();
					customer.databaseToClass(result[0]);
					customer.updateClass(req.body);

					// Note - Don't set the updated date... JIRA XXXX
					// let customerParams = [ customer.name, customer.salesChannelId, customer.customerTypeId,
					// customer.dueAmount, customer.address, customer.gpsCoordinates, customer.phoneNumber ];
					let customerParams = [
						customer.name,
						customer.salesChannelId,
						customer.customerTypeId,
						customer.dueAmount,
						customer.address,
						customer.gpsCoordinates,
						customer.phoneNumber,
						customer.frequency,
						customer.reminder_date
					];

					// Active is set via a 'bit;
					if (!customer.active) {
						customerParams.push(0);
					} else {
						customerParams.push(1);
					}
					customerParams.push(customer.customerId);
					updateCustomers(
						sqlUpdateCustomers,
						customerParams,
						res,
						customer
					);
				},
				function(reason) {
					res.status(404).send(
						'PUT customer: Could not find customer with id ' +
							req.params.id
					);
				}
			);
		}
	});
});

const updateCustomers = (query, params, res, customer) => {
	__pool.getConnection((err, connection) => {
		connection.query(query, params, function(err, result) {
			connection.release();
			if (err) {
				semaLog.error('updateCustomers customers - failed', { err });
				res.status(500).send(err.message);
			} else {
				semaLog.info('updateCustomers customers - succeeded');

				try {
					res.json(customer.classToPlain());
				} catch (err) {
					semaLog.error('updateCustomers customers - failed', {
						err
					});
					res.status(500).send(err.message);
				}
			}
		});
	});
};

router.delete('/:id', async (req, res) => {
	semaLog.info('DELETE sema_customer - Enter');

	semaLog.info(req.params.id);

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('Delete customer. Validation error');
			res.status(400).send(errors.toString());
		} else {
			findCustomers(sqlGetCustomerById, req.params.id).then(
				function(result) {
					deleteCustomers(sqlDeleteCustomers, req.params.id, res);
				},
				function(reason) {
					res.status(404).send(
						'Delete customer. Could not find customer with that id'
					);
				}
			);
		}
	});
});

const findCustomers = (query, params) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				} else {
					semaLog.info('customers - succeeded');

					try {
						if (Array.isArray(result) && result.length > 0) {
							resolve(result);
						} else {
							reject(null);
						}
					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});
		});
	});
};

const deleteCustomers = (query, params, res) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				} else {
					semaLog.info(' deleteCustomers customers - succeeded');

					try {
						let msg =
							'Deleted customer with Id ' + params.toString();
						resolve(res.status(200).send(msg));
					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});
		});
	});
};

router.post('/', async (req, res) => {
	semaLog.info('CREATE sema_customer - Enter');

	//var postSqlParams = [];

	semaLog.info(req.body);
	req.check('customerTypeId', 'Parameter customerTypeId is missing').exists();
	req.check('salesChannelId', 'Parameter salesChannelId is missing').exists();
	req.check('name', 'Parameter name is missing').exists();
	req.check('siteId', 'Parameter siteId is missing').exists();
	req.check('address', 'Parameter address is missing').exists();
	req.check('phoneNumber', 'Parameter phoneNumber is missing').exists();

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error(
				'CREATE sema_customer: Validation error: ' + errors.toString()
			);
			res.status(400).send(errors.toString());
		} else {
			let customer = new Customer();
			customer.requestToClass(req);

			let postSqlParams = [
				customer.customerId,
				getUTCDate(customer.createdDate),
				customer.name,
				customer.customerTypeId,
				customer.salesChannelId,
				customer.siteId,
				customer.dueAmount,
				customer.address,
				customer.gpsCoordinates,
				customer.phoneNumber,
				1
			];

			insertCustomers(customer, sqlInsertCustomer, postSqlParams, res);
		}
	});
});

const insertCustomers = (customer, query, params, res) => {
	__pool.getConnection((err, connection) => {
		connection.query(query, params, function(err, result) {
			connection.release();
			if (err) {
				semaLog.error('customers - failed', { err });
				res.status(500).send(err.message);
			} else {
				semaLog.info('CREATE customer - succeeded');

				try {
					res.json(customer.classToPlain());
				} catch (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
				}
			}
		});
	});
};

router.get('/', function(req, res) {
	semaLog.info('GET Customers - Enter');

	req.check('site-id', 'Parameter site-id is missing').exists();

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('GET Customers validation error: ', errors);
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('Site-id: ' + req.query['site-id']);
			if (req.query.hasOwnProperty('updated-date')) {
				let updatedDate = getUTCDate(
					new Date(req.query['updated-date'])
				);

				if (!isNaN(updatedDate)) {
					getCustomers(
						sqlUpdatedDate,
						[req.query['site-id'], updatedDate],
						res
					);
				} else {
					semaLog.error('GET Customers - Invalid updatedDate');
					res.status(400).send('Invalid Date');
				}
			} else if (
				req.query.hasOwnProperty('begin-date') &&
				req.query.hasOwnProperty('end-date')
			) {
				let beginDate = getUTCDate(new Date(req.query['begin-date']));
				let endDate = getUTCDate(new Date(req.query['end-date']));
				if (!isNaN(beginDate) && !isNaN(endDate)) {
					getCustomers(
						sqlBeginEndDate,
						[req.query['site-id'], beginDate, endDate],
						res
					);
				} else {
					semaLog.error(
						'GET Customers - Invalid begin-date/end-date'
					);
					res.status(400).send('Invalid Date');
				}
			} else if (req.query.hasOwnProperty('begin-date')) {
				let beginDate = getUTCDate(new Date(req.query['begin-date']));
				semaLog.info(
					'GET Customers - beginDate: ' + beginDate.toISOString()
				);
				if (!isNaN(beginDate)) {
					getCustomers(
						sqlBeginDateOnly,
						[req.query['site-id'], beginDate],
						res
					);
				} else {
					semaLog.error('GET Customers - Invalid begin-date');
					res.status(400).send('Invalid Date');
				}
			} else if (req.query.hasOwnProperty('end-date')) {
				let endDate = getUTCDate(new Date(req.query['end-date']));
				if (!isNaN(endDate)) {
					getCustomers(
						sqlEndDateOnly,
						[req.query['site-id'], endDate],
						res
					);
				} else {
					semaLog.error('GET Customers - Invalid end-date');
					res.status(400).send('Invalid Date');
				}
			} else {
				getCustomers(sqlSiteIdOnly, [req.query['site-id']], res);
			}
		}
	});
});

const getCustomers = (query, params, res) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function(err, result) {
				connection.release();

				if (err) {
					semaLog.error('GET Customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				} else {
					semaLog.info('GET Customers - succeeded');
					try {
						if (Array.isArray(result) && result.length >= 1) {
							var values = result.map(item => {
								customer = new Customer();
								customer.databaseToClass(item);
								return customer.classToPlain(item);
							});

							resolve(res.json({ customers: values }));
						} else {
							resolve(res.json({ customers: [] }));
						}
					} catch (err) {
						semaLog.error('GET Customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});
		});
	});
};

const getUTCDate = date => {
	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds()
	);
};
module.exports = router;
