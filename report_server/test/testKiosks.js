const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
var findKioskId = require('./Utilities/findKioskId');
process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Kiosks', function () {
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
	describe('GET /sema/kiosks', function() {
		it('should get /sema/kiosks', function testKiosks(done) {
			chai.request(server)
				.post('/sema/login')
				.send({ usernameOrEmail:'unittest' , password:'testpassword' })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property('token');
					let token = "Bearer " + res.body.token;
					chai.request(server)
						.get('/sema/kiosks')
						.set('Authorization', token)
						.end(function(err, res) {
							// console.log(JSON.stringify(res))
							res.should.have.status(200);
							let site_index = findKioskId.findKioskIndex(res.body.kiosks, 'UnitTestCustomers');
							expect( site_index).to.not.equal(-1);
							res.body.should.be.a('object');
							res.body.should.have.property('kiosks');
							expect(res.body.kiosks).to.be.an('array');
							res.body.kiosks[site_index].should.have.property('name').eql('UnitTestCustomers');
							res.body.kiosks[site_index].should.have.property('active').eql(true);
							done(err);
						});
				});
		});
	});
	describe('404 everything else', function() {
		it('404 everything else', function testPath(done) {
			request(server)
				.get('/untapped/rubbish')
				.end(function (err ) {
					done(err);
				});
		});
	});
});

