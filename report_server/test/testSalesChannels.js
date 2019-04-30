const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
var findSalesChannel= require('./Utilities/findSalesChannelId');
process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Sales Channels', function () {
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
	describe('GET /sema/sales-channels', function() {
		it('should get all sales channels', function testSalesChannels(done) {
			chai.request(server)
				.post('/sema/login')
				.send({ usernameOrEmail:'unittest' , password:'testpassword' })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property('token');
					let token = "Bearer " + res.body.token;
					chai.request(server)
						.get('/sema/sales-channels')
						.set('Authorization', token)
						.end(function(err, res) {
							// console.log(JSON.stringify(res))
							res.should.have.status(200);
							let sc_index = findSalesChannel.findSalesChannelIndex(res.body.salesChannels, 'sales channel 1');
							expect( sc_index).to.not.equal(-1);
							res.body.should.have.property('salesChannels');
							expect(res.body.salesChannels).to.be.an('array');
							res.body.salesChannels[sc_index].should.have.property('name').eql('sales channel 1');
							done(err);
						});
				});
		});
	});

});

