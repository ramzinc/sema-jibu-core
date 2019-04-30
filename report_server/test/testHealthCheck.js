const request = require('supertest');
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing health-check', function () {
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
	describe('GET /sema/health-check', function() {
		it('should get /sema/health-check', function testHealthCheck(done) {
			chai.request(server)
				.get('/sema/health-check')
				.end(function(err, res) {
					// console.log(JSON.stringify(res))
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('server').eql('Ok');
					res.body.should.have.property('database').eql('Ok');
					done(err);
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

