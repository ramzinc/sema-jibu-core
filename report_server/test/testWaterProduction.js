const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
require('datejs');
var findKioskIndex = require('./Utilities/findKioskId');

process.env.NODE_ENV = 'test';  // Set environment to test

describe.skip('Testing Water Production API', function () {
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
	describe('GET /untapped/water-operations - missing kioskID', () => {
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.get('/untapped/water-operations')
				.end(function(err, res) {
					res.should.have.status(400);
					done(err);
				});
		});
	});
	describe('GET /untapped/water-operations - unknown kioskID', () => {
		it('Should succeed with empty info becuase the kioskID does not exist', (done) => {
			chai.request(server)
				.get('/untapped/water-operations?kioskID=9999&groupby=month')
				.end(function(err, res) {
					res.should.have.status(200);
					expect(res.body.totalProduction.value).to.equal('N/A');
					expect(res.body.totalProduction.date).to.equal('N/A');
					res.body.sitePressureIn.should.have.property('value').eql('N/A');
					res.body.sitePressureIn.should.have.property('date').eql('N/A');
					res.body.sitePressureOut.should.have.property('value').eql('N/A');
					res.body.sitePressureOut.should.have.property('date').eql('N/A');
					res.body.sitePressureMembrane.should.have.property('value').eql('N/A');
					res.body.sitePressureMembrane.should.have.property('date').eql('N/A');
					res.body.flowRateFeed.should.have.property('value').eql('N/A');
					res.body.flowRateFeed.should.have.property('date').eql('N/A');
					res.body.flowRateProduct.should.have.property('value').eql('N/A');
					res.body.flowRateProduct.should.have.property('date').eql('N/A');
					done(err);
				});
		});
	});



	// Note the unit test create scripts populates the following;
	//  1) A "Total Chlorine" reading of .5 at 2018-05-01
	//  2) Production should have 1 sample of value 100
	describe('GET /untapped/water-operations - UnitTest KioskID', () => {
		it('Should get info for water production with a valid kiosk', (done) => {
			chai.request(server)
				.get('/sema/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');
					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
					let endDate = new Date(2018,5, 1);	// Need truncate at June 1, 2018 to capture May, 2018 readings
					let url = "/untapped/water-operations?kioskID=%d&groupby=month&enddate=%s";
					url = sprintf( url, res.body.kiosks[site_index].id, endDate.toISOString())
					chai.request(server)
						.get(url)
						.end(function (err, res) {
							res.should.have.status(200);

							// Test total chlorine chart - should be one sample
							expect(res.body.chlorine.x_axis).to.be.an('array');
							expect(res.body.chlorine.x_axis.length).to.equal(1);
							let sampleDate = Date.parse(res.body.chlorine.x_axis[0]);
							expect(sampleDate.getFullYear()).to.equal(2018);
							expect(sampleDate.getMonth()).to.equal(4);
							expect(sampleDate.getDate()).to.equal(1);
							expect(res.body.chlorine.datasets.length).to.equal(1);
							expect(res.body.chlorine.datasets[0].data[0]).to.equal(0.50);

							// Test total TDS - should be empty
							expect(res.body.tds.x_axis).to.be.an('array');
							expect(res.body.tds.x_axis.length).to.equal(0);
							expect(res.body.tds.datasets.length).to.equal(0);

							// Test Production chart - should be one sample
							expect(res.body.production.x_axis).to.be.an('array');
							expect(res.body.production.x_axis.length).to.equal(1);
							sampleDate = Date.parse(res.body.production.x_axis[0]);
							expect(sampleDate.getFullYear()).to.equal(2018);
							expect(sampleDate.getMonth()).to.equal(4);
							expect(sampleDate.getDate()).to.equal(15);
							expect(res.body.production.datasets.length).to.equal(1);
							expect(res.body.production.datasets[0].data[0]).to.equal(40);

							// Flow rate:
							expect(res.body.flowRateProduct.value).to.equal(123);
							// Site Pressure
							expect(res.body.sitePressureMembrane.value).to.equal(456);
							done(err);
						});
				});
		});
	});


	// Note the unit test create scripts populates the following;
	//  1) A "Total Production" May 15, 2018 of 40,
	//  2)  A "Fill Production" May 15, 2018 of 20,
	describe('GET /untapped/water-operations - UnitTest KioskID', () => {
		it('Should get info for total production/fill production with a valid kiosk', (done) => {
			chai.request(server)
				.get('/sema/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');
					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
					let endDate = new Date(2018,5, 15);	//
					let url = "/untapped/water-operations?kioskID=%d&groupby=month&enddate=%s";
					url = sprintf( url, res.body.kiosks[site_index].id, endDate.toISOString())
					chai.request(server)
						.get(url)
						.end(function (err, res) {
							res.should.have.status(200);

							expect(res.body.totalProduction.value).to.equal(40);
							expect(res.body.fillStation.value).to.equal(20);

							expect((Date.parse(res.body.totalProduction.date)).getFullYear()).to.equal(2018);
							expect(((Date.parse(res.body.totalProduction.date))).getMonth()+1).to.equal(5);
							expect((Date.parse(res.body.totalProduction.date)).getDate()).to.equal(15);

							expect((Date.parse(res.body.fillStation.date)).getFullYear()).to.equal(2018);
							expect(((Date.parse(res.body.fillStation.date))).getMonth()+1).to.equal(5);
							expect((Date.parse(res.body.fillStation.date)).getDate()).to.equal(15);
							done(err);
						});
				});
		});
	});
});


