const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
var findKioskIndex = require('./Utilities/findKioskId');

process.env.NODE_ENV = 'test';  // Set environment to test

describe.skip('Testing Sales ByChannel API', function () {
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
	describe('GET /untapped/sales-by-channel - missing kioskID', function() {
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.get('/untapped/sales-by-channel')
				.end(function(err, res) {
					res.should.have.status(400);
					done(err);
				});
		});
	});
	describe('GET /untapped/sales-by-channel - unknown kioskID', function() {
		it('Should succed with sales by channel info becuase the kioskID does not exist', (done) => {
			chai.request(server)
				.get('/untapped/sales-by-channel?kioskID=9999&groupby=month')
				.end(function(err, res) {
					res.should.have.status(200);
					expect(res.body.salesByChannel.datasets).to.be.an('array');
					expect(res.body.salesByChannel.datasets).to.be.empty;

					done(err);
				});
		});
	});

	describe('GET /untapped/sales-by-channel- UnitTest KioskID', function() {
		it('Should get info for one customer with one sale', (done) => {
			chai.request(server)
				.get('/sema/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
					let url = "/untapped/sales-by-channel?kioskID=%d&groupby=month";
					url = sprintf( url, res.body.kiosks[site_index].id)
					chai.request(server)
						.get(url)
						.end(function (err, res) {
							res.should.have.status(200);
							expect(res.body.salesByChannel.datasets).to.be.an('array');
							expect(res.body.salesByChannel.datasets.length).to.be.equal(1);
							expect(res.body.salesByChannel.datasets[0].data.length).to.be.equal(4);
							done(err);
						});
				});
		});
	});
});

