const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
let authenticate = require('./Utilities/authenticate');
let findKioskId = require('./Utilities/findKioskId');
let findCustomerId = require('./Utilities/findCustomerId');
let findProductId = require('./Utilities/findProductId');


describe('Testing Products API', function () {
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

	describe('GET /sema/products - updated-date 2016-1-1', function() {
		it('Should return info on 2 products after 2016-1-1', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get("/sema/products?updated-date=2016-1-1")
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(200);
						expect(res.body.products).to.be.an('array');
						expect(res.body.products.length).to.be.equal(2);
						expect(res.body.products[0].description).to.be.equal("Description Product-1");
						expect(res.body.products[0].updatedDate).to.be.equal("2018-01-01T08:00:00.000Z");
						expect(res.body.products[0].priceCurrency).to.be.equal("USD");
						expect(res.body.products[0].priceAmount).to.be.equal(5.00);
						expect(res.body.products[0].unitPerProduct).to.be.equal(1);
						expect(res.body.products[0].unitMeasure).to.be.equal("tons");
						expect(res.body.products[0].cogsAmount).to.be.equal(4.00);


						done(err);
					});


			});
		});
	});

	describe('GET /sema/site/products - no update-date', function() {
		it('Should return info on all 5 products', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get("/sema/products")
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(200);
						expect(res.body.products).to.be.an('array');
						expect(res.body.products.length).to.be.equal(5);
						done(err);
					});
			});
		});
	});

	describe('GET Should return product mrp info on product/kiosk/salesChannel', function() {
		it('Should pass, returning all 5 product mrps', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					findProductId.findProductId(server, token, 'sku1').then(function(product) {
						let url = sprintf("/sema/site/product-mrps?site-id=%d", kiosk.id);
						chai.request(server)
							.get(url)
							.set('Authorization', token)
							.end(function(err, res) {
								expect(res.body.productMRPs).to.be.an('array');
								expect(res.body.productMRPs.length).to.be.equal(5);
								res.should.have.status(200);
								for( let index = 0; index < res.body.productMRPs.length; index++ ){
									if( res.body.productMRPs[index].productId == product.id ){
										expect(res.body.productMRPs[index].priceAmount).to.be.equal(10);
										expect(res.body.productMRPs[index].cogsAmount).to.be.equal(4);
									}
								}
								done(err);
						});
					});
				});
			});
		});
	});

	describe('GET Should return product mrp info on product/kiosk/salesChannel AFTER 1/1/2017', function() {
		it('Should pass, returning all 1 product mrps', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					findProductId.findProductId(server, token, 'sku1').then(function(product) {
						let url = sprintf("/sema/site/product-mrps?site-id=%d&updated-date=%s", kiosk.id, new Date("2017-1-1"));
						chai.request(server)
							.get(url)
							.set('Authorization', token)
							.end(function(err, res) {
								expect(res.body.productMRPs).to.be.an('array');
								expect(res.body.productMRPs.length).to.be.equal(1);
								res.should.have.status(200);
								for( let index = 0; index < res.body.productMRPs.length; index++ ){
									if( res.body.productMRPs[index].productId == product.id ){
										expect(res.body.productMRPs[index].priceAmount).to.be.equal(10);
										expect(res.body.productMRPs[index].cogsAmount).to.be.equal(4);
									}
								}
								done(err);
							});
					});
				});
			});
		});
	});

});
