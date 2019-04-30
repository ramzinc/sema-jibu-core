const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
var findKioskIndex = require('./Utilities/findKioskId');

process.env.NODE_ENV = 'test';  // Set environment to test

describe.skip('Testing Sales API', function () {
	let server;
	this.timeout(6000);
	beforeEach( () => {
		server = require('../bin/www' );
	});
	afterEach( (done) => {
		var iAmDone = done;
		server.close();
		setTimeout( function(){iAmDone()}, 2000);
	});
	describe('GET /untapped/Sales - missing kioskID', ()=>{
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.get('/untapped/sales')
				.end(function(err, res) {
					res.should.have.status(400);
					done(err);
				});
		});
	});
	describe('GET /untapped/Sales - unknown kioskID', () => {
		it('Should succed with empty sales info becuase the kioskID does not exist', (done) =>{
			chai.request(server)
				.get('/untapped/sales?kioskID=9999&groupby=month')
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.gallonsPerCustomer.should.have.property('value').eql('N/A');
					res.body.netIncome.should.have.property('total').eql('N/A');
					expect(res.body.netIncome.periods).to.be.an('array');
					expect(res.body.retailSales).to.be.an('array');
					expect(res.body.retailSales).to.be.empty;
					res.body.totalRevenue.periods[0].should.have.property('periodValue').eql('N/A');
					res.body.should.have.property('totalCustomers').eql(0);
					done(err);
				});
		});
	});

	// Refer to the python script - populate_receipt for the expected results
	describe('GET /sema/Sales - UnitTest KioskID', () => {
		it('Should get info for one customer with one sale', (done) => {
			chai.request(server)
				.get('/sema/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
					let url = "/untapped/sales?kioskID=%d&groupby=month";
					url = sprintf( url, res.body.kiosks[site_index].id)
					chai.request(server)
						.get(url)
						.end(function (err, res) {
							res.should.have.status(200);
							res.body.gallonsPerCustomer.should.have.property('value').eql(4/6);	// Assumes 6 customer, 4 gallons sold in the last month
							res.body.netIncome.should.have.property('total').eql('N/A');
							expect(res.body.retailSales).to.be.an('array');
							expect(res.body.retailSales.length).to.equal(1);
							// res.body.newCustomers.periods[0].should.have.property('periodValue').eql(1);
							// res.body.newCustomers.periods[1].should.have.property('periodValue').eql(2);
							res.body.should.have.property('totalCustomers').eql(6);
							// let testDate = new Date(res.body.newCustomers.periods[0].beginDate);
							// expect( testDate.getFullYear()).to.deep.equal(2018);
							// expect( testDate.getMonth()+1).to.deep.equal(5);

							// testDate = new Date(res.body.newCustomers.periods[1].beginDate);
							// expect( testDate.getFullYear()).to.deep.equal(2018);
							// expect( testDate.getMonth()+1).to.deep.equal(4);

							res.body.totalRevenue.should.have.property('total').eql(75);
							testDate = new Date(res.body.totalRevenue.periods[0].beginDate);
							expect( testDate.getFullYear()).to.deep.equal(2018);
							expect( testDate.getMonth()+1).to.deep.equal(4);
							res.body.totalRevenue.periods[0].should.have.property('periodValue').eql(10);
							res.body.totalRevenue.periods[1].should.have.property('periodValue').eql(30);
							res.body.totalRevenue.periods[2].should.have.property('periodValue').eql(0);

							res.body.totalRevenue.periods[0].should.have.property('beginDate').eql("2018-04-01T07:00:00.000Z");
							res.body.totalRevenue.periods[1].should.have.property('beginDate').eql("2018-03-01T08:00:00.000Z");
							res.body.totalRevenue.periods[2].should.have.property('beginDate').eql("2018-02-01T08:00:00.000Z");
							done(err);
						});
				});
		});
	});

	describe('GET /untapped/Sales - UnitTest KioskID', () =>{
		it('Should get sales by retailer', (done) => {
			chai.request(server)
				.get('/sema/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
					let url = "/untapped/sales?kioskID=%d&groupby=month&enddate=%s";
					let endDate = new Date( 2018, 0,31);	// Sales data to Jan 31, 2018

					url = sprintf( url, res.body.kiosks[site_index].id, endDate)
					chai.request(server)
						.get(url)
						.end(function (err, res) {
							res.should.have.status(200);
							res.body.should.have.property('retailSales');
							expect(res.body.retailSales).to.be.an('array');
							expect(res.body.retailSales.length).to.equal(1);
							expect(res.body.retailSales[0].name).to.equal("TestCustomer 6");
							expect(res.body.retailSales[0].periods[0].periodValue).to.equal(35);

							testDate = new Date(res.body.retailSales[0].periods[0].beginDate);
							expect( testDate.getFullYear()).to.deep.equal(2018);
							expect( testDate.getMonth()+1).to.deep.equal(1);

							done(err);
						});
				});
		});
	});

});

