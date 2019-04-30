const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sprintf = require('sprintf-js').sprintf;
let findKioskId = require('./Utilities/findKioskId');
let authenticate = require('./Utilities/authenticate');
let findCustomerId = require('./Utilities/findCustomerId');
let findSalesChannel= require('./Utilities/findSalesChannelId');
let findCustomerType= require('./Utilities/findCustomerTypeId');

describe('Testing Customers API', function () {
	let server;
	this.timeout(6000);
	beforeEach( (done) => {
		var iAmDone = done;
		server = require('../bin/www' );
		setTimeout( function(){iAmDone()}, 1500);
	});
	afterEach( (done) => {
		var iAmDone = done;
		server.close();
		setTimeout( function(){iAmDone()}, 2000);
	});



	describe('PUT /sema/site/customers - customerId', function() {
		it('Should succeed', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					findCustomerId.findCustomerId(server, token, 'TestCustomer 1', kiosk.id).then(function(customer) {
						customer.should.have.property('name').eql('TestCustomer 1');
						let oldPhone = customer.phoneNumber;
						let oldAddress = customer.address;
						let oldUpdatedDate = customer.updatedDate;
						let url = sprintf('/sema/site/customers/%s', customer.customerId);
						let now = new Date();
						chai.request(server)
							.put(url)
							.set('Content-Type', 'application/json; charset=UTF-8')
							.send({ 'phoneNumber': '999-999-9999', 'address': 'somwhere else' })
							.set('Authorization', token)
							.end(function(err, res) {
								let updateDate = new Date( res.body.updatedDate);
								expect(updateDate ).to.be.above( now );
								findCustomerId.findCustomerId(server, token, 'TestCustomer 1', kiosk.id).then(function(customer) {
									customer.should.have.property("phoneNumber").eql("999-999-9999");
									customer.should.have.property("address").eql("somwhere else");

									chai.request(server)
										.put(url)
										.set('Content-Type', 'application/json; charset=UTF-8')
										.send({ 'phoneNumber': oldPhone, 'address': oldAddress, 'updatedDate':oldUpdatedDate })
										.set('Authorization', token)
										.end(function(err, res) {
											done(err);
									});
								});
							});
					});
				});
			});
		});
	});

	describe('PUT /sema/site/customers - customer does not exist', function() {
		it('Should fail with 404 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.put('/sema/site/customers/99999')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(404);
						done(err);
					});
			});
		});
	});

	describe('DELETE /sema/site/customers - customer does not exist', function() {
		it('Should fail with 404 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.delete('/sema/site/customers/99999')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(404);
						done(err);
					});
			});
		});
	});

	describe('POST /sema/site/customers - missing siteId, customerName, customerType', function() {
		it('Should fail with 400 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.post('/sema/site/customers')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(400);
						done(err);
					});
			});
		});
	});

	describe('POST /sema/site/customer - unknown site-id', function() {
		it('Should fail with foreign key constraint error 500', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.post('/sema/site/customers')
					.send({
						'customerId': '999999',
						'customerTypeId': 1,
						'salesChannelId':1,
						'name': 'A contact',
						'siteId': 666666,
						'address': 'Some address',
						'phoneNumber': '555-1212'
					})

					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(500);
						done(err);
					});
			});
		});
	});

	describe('GET /sema/site/customers - missing site-id', function() {
		it('Should fail with 400 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get('/sema/site/customers')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(400);
						done(err);
					});
			});
		});
	});

	describe('GET /sema/site/customer - unknown site-id', function() {
		it('Should succeed with customer info becuase the site-id does not exist', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get('/sema/site/customers?site-id=9999')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(200);
						expect(res.body.customers).to.be.an('array');
						expect(res.body.customers).to.be.empty;
						done(err);
					});
			});
		});
	});

	describe('GET /sema/site/customers - UnitTestCustomer site-id', function() {
		it('Should get all customers for the site', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = sprintf("/sema/site/customers?site-id=%d", kiosk.id);
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(6);
							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Begin Date 2018-2-1', function() {
		it('Should return 5 customers beginning in 2018-2-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					let testDate = new Date( Date.UTC(2018, 1, 1));	// Note: Month is 0 based
					let testDateStr = testDate.toISOString();
					url = sprintf(url, kiosk.id, testDateStr );
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(5);
							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Begin Date 2018-6-1', function() {
		it('Should return info on 0 customers beginning in 2018-6-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-6-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);

							done(err);
						});
				});
			});
		});
	});


	describe('GET /sema/site/customers - End Date 2018-2-1', function() {
		it('Should return 2 customers ending in 2018-2-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-2-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(2);

							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Ending Date in 2017-1-1', function() {
		it('Should return info on 0 customers ending in 2017-1-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2017-1-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);

							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Updated after 2018-3-1', function() {
		it('Should return 4 customers updated after 2018-3-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&updated-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-3-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(4);
							res.body.customers[0].should.have.property("customerId");
							res.body.customers[0].should.have.property("name").eql("TestCustomer 1");
							res.body.customers[0].should.have.property("dueAmount").eql(0);
							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Updated Date: 2018-4-28', function() {
		it('Should return info on 2 customers updated after 2018-4-28', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&updated-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-4-28"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(2);
							expect(res.body.customers[1].active).to.be.equal(true);
							expect(res.body.customers[1].name).to.be.equal("TestCustomer 6");
							expect(res.body.customers[1].createdDate).to.be.equal("2018-05-01T07:00:00.000Z");
							expect(res.body.customers[1].dueAmount).to.be.equal(0);
							expect(res.body.customers[1].address).to.be.equal("test_address");
							expect(res.body.customers[1].gpsCoordinates).to.be.equal("gps");


							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Begin/End Date: 2018-2-1 - 2018-4-1', function() {
		it('Should return 4 customers between 2018-2-1 and 2018-4-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					let beginDate = (new Date( Date.UTC(2018, 1, 1))).toISOString();	// Note: Month is 0 based
					let endDate = (new Date( Date.UTC(2018, 3, 1))).toISOString();	// Note: Month is 0 based

					url = sprintf(url, kiosk.id, beginDate, endDate);
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(4);

							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - between 2018-6-1 and 2018-8-1', function() {
		it('Should return info on 0 customers between 2018-6-1 and 2018-8-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-6-1"), new Date("2018-8-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);
							done(err);
						});
				});
			});
		});
	});

	describe('POST /sema/site/customers - UnitTestCustomer site-id', function() {
		it('Should create a customer for the site', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					findSalesChannel.findSalesChannelId(server, token, "sales channel 1"). then(function(salesChannel){
						findCustomerType.findCustomerTypeId(server, token, "TestCustomer"). then(function(customerType) {
							let url = '/sema/site/customers/';
							chai.request(server)
								.post(url)
								.set('Content-Type', 'application/json; charset=UTF-8')
								.send({
									'customerId': '999999',
									'customerTypeId': customerType.id,
									'salesChannelId': salesChannel.id,
									'name': 'A contact',
									'siteId': kiosk.id,
									'address': 'Some address',
									'phoneNumber': '555-1212'
								})
								.set('Authorization', token)
								.end(function(err, res) {
									res.should.have.status(200);
									expect(res.body.address).to.be.equal('Some address');
									expect(res.body.name).to.be.equal("A contact");
									expect(res.body.customerId).to.be.equal('999999');
									expect(res.body.customerTypeId).to.be.equal(customerType.id);
									expect(res.body.siteId).to.be.equal(kiosk.id);
									expect(res.body.dueAmount).to.be.equal(0);
									expect(res.body.phoneNumber).to.be.equal("555-1212");
									expect(res.body.salesChannelId).to.be.equal(salesChannel.id);
									expect(res.body.active).to.be.equal(true);

									let url = sprintf('/sema/site/customers/%s', '999999');
									chai.request(server)
										.delete(url)
										.set('Authorization', token)
										.end(function(err, res) {
											res.should.have.status(200);
											done(err);
										});
								});
						});
					});
				});
			});
		});
	});

	describe('Deactivate/activate /sema/site/customers - customerId', function() {
		it('Should succeed when a customer is activated/deactivated', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					findCustomerId.findCustomerId(server, token, 'TestCustomer 1', kiosk.id).then(function(customer) {
						customer.should.have.property('name').eql('TestCustomer 1');
						let oldUpdatedDate = customer.updatedDate;
						let url = sprintf('/sema/site/customers/%s', customer.customerId);
						let now = new Date();

						// Deactivate customer
						chai.request(server)
							.put(url)
							.set('Content-Type', 'application/json; charset=UTF-8')
							.send({ 'active': false, updatedDate:oldUpdatedDate })
							.set('Authorization', token)
							.end(function(err, res) {
								res.should.have.status(200);

								let url2 = sprintf("/sema/site/customers?site-id=%d", kiosk.id);
								// check result
								chai.request(server)
									.get(url2)
									.set('Authorization', token)
									.end(function(err, res) {
										res.should.have.status(200);
										expect(res.body.customers).to.be.an('array');
										expect(res.body.customers.length).to.be.equal(5);

										// re-activate
										chai.request(server)
											.put(url)
											.set('Content-Type', 'application/json; charset=UTF-8')
											.send({ 'active': true, updatedDate:oldUpdatedDate })
											.set('Authorization', token)
											.end(function(err, res) {
												res.should.have.status(200);
												// check result
												chai.request(server)
													.get(url2)
													.set('Authorization', token)
													.end(function(err, res) {
														res.should.have.status(200);
														expect(res.body.customers).to.be.an('array');
														expect(res.body.customers.length).to.be.equal(6);

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
