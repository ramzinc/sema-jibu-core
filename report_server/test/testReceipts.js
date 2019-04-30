const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
let findKioskId = require('./Utilities/findKioskId');
let authenticate = require('./Utilities/authenticate');
let findSalesChannel= require('./Utilities/findSalesChannelId');
let findCustomerType= require('./Utilities/findCustomerTypeId');
let removeReceipts = require('./Utilities/removeReceipts');
let getReceipts = require('./Utilities/getReceipts');
let findCustomerId = require('./Utilities/findCustomerId');
let findProductId = require('./Utilities/findProductId');


describe('Testing Receipts API', function () {
	let server;
	this.timeout(6000);
	beforeEach((done) => {
		var iAmDone = done;
		server = require('../bin/www');
		setTimeout(function() {
			iAmDone()
		}, 1500);
	});
	afterEach((done) => {
		var iAmDone = done;
		server.close();
		setTimeout(function() {
			iAmDone()
		}, 2000);
	});

	describe('POST /sema/site/receipts. Empty products array', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				removeReceipts.removeReceiptLineItems().then(function() {
					removeReceipts.removeReceipts().then(function() {
						findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
							findSalesChannel.findSalesChannelId(server, token, "sales channel 1"). then(function(salesChannel) {
								findCustomerType.findCustomerTypeId(server, token, "TestCustomer"). then(function(customerType) {
									findCustomerId.findCustomerId(server, token, 'TestCustomer 1', kiosk.id).then(function(customer) {
										let url = '/sema/site/receipts/';
										chai.request(server)
											.post(url)
											.set('Content-Type', 'application/json; charset=UTF-8')
											.send({
												"id": "2018072700001",
												"createdDate": "7/27/18",
												"currencyCode": "USD",
												"customerId": customer.customerId,
												"amountCash": 5,
												"amountLoan": 4,
												"siteId": kiosk.id,
												"paymentType": "What is this for",
												"salesChannelId": salesChannel.id,
												"customerTypeId": customerType.id,
												"total": "10",
												"cogs": "9",
												"receiptId": "someUUID",
												"products": []
											})
											.set('Authorization', token)
											.end(function(err, res) {
												res.should.have.status(200);
												getReceipts.getReceipts().then(function(receipts) {
													receipts[0].should.have.property("uuid").eql("someUUID");
													getReceipts.getReceiptLineItems().then(function(receiptLineItems) {
														receiptLineItems.length.should.eql(0)
														removeReceipts.removeReceiptLineItems().then(function() {
															removeReceipts.removeReceipts().then(function() {
																done(err);
															});
														});
													});
												});

											});
									});
								});
							});
						});
					});
				});
			});
		});
	});




	describe('POST /sema/site/receipts. Everything Valid - 2 products', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				removeReceipts.removeReceiptLineItems().then(function() {
					removeReceipts.removeReceipts().then(function() {
						findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
							findCustomerId.findCustomerId(server, token, 'TestCustomer 1', kiosk.id).then(function(customer) {
								findProductId.findProductId(server, token, 'sku1').then(function(product) {
									let url = '/sema/site/receipts/';
									chai.request(server)
										.post(url)
										.set('Content-Type', 'application/json; charset=UTF-8')
										.send({
											"id": "2018072700001",
											"createdDate": "7/27/18",
											"currencyCode": "USD",
											"customerId": customer.customerId,
											"amountCash": 5,
											"amountLoan": 4,
											"siteId": kiosk.id,
											"paymentType": "What is this for",
											"salesChannelId": customer.salesChannelId,
											"customerTypeId": customer.customerTypeId,
											"total": "10",
											"cogs": "9",
											"receiptId": "someUUID",
											"products": [
												{
													"priceTotal": 7,
													"quantity": 1,
													"productId": product.productId,
													"cogsTotal": 6,
												},
												{
													"priceTotal": 6,
													"quantity": 3,
													"productId": product.productId,
													"cogsTotal": 4,
												}
											],
										})
										.set('Authorization', token)
										.end(function(err, res) {
											res.should.have.status(200);
											getReceipts.getReceipts().then(function(receipts) {
												receipts[0].should.have.property("uuid").eql("someUUID");
												getReceipts.getReceiptLineItems().then(function(receiptLineItems) {
													receiptLineItems.length.should.eql(2);
													removeReceipts.removeReceiptLineItems().then(function() {
														removeReceipts.removeReceipts().then(function() {
															done(err);
														});
													});
												});
											});
										});
								});
							});
						});
					});
				});
			});
		});
	});

	describe('POST /sema/site/receipts. Some parameters missing', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				removeReceipts.removeReceiptLineItems().then(function() {
					removeReceipts.removeReceipts().then(function() {
						findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
							let url = '/sema/site/receipts/';
							chai.request(server)
								.post(url)
								.set('Content-Type', 'application/json; charset=UTF-8')
								.send({
									"receiptId": "2",
									"customerId": "Brian",
									"siteId": kiosk.id,
									"createdDate": "9/9/18",
									"totalSales": "10",
									"cogs": "9",
									"salesChannelId": "122"
								})
								.set('Authorization', token)
								.end(function(err, res) {
									res.should.have.status(400);
									done(err);
								});
						});
					});
				});
			});
		});
	});

	describe('POST /sema/site/receipts. Missing product attributes.', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				removeReceipts.removeReceiptLineItems().then(function() {
					removeReceipts.removeReceipts().then(function() {
						findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
							let url = '/sema/site/receipts/';
							chai.request(server)
								.post(url)
								.set('Content-Type', 'application/json; charset=UTF-8')
								.send({
									"receiptId": "2",
									"customerId": "Brian",
									"siteId": kiosk.id,
									"createdDate": "9/9/18",
									"totalSales": "10",
									"cogs": "9",
									"products": [
										{
											"productId": "558",
											"quantity": "1",
											"receiptId": "2"
										},
										{
											"productId": "559",
											"quantity": "1",
											"salesPrice": "2",
											"receiptId": "2"
										}
									],
									"salesChannelId": "122"
								})
								.set('Authorization', token)
								.end(function(err, res) {
									res.should.have.status(400);
									done(err);
								});
						});
					});
				});
			});
		});
	});
});
