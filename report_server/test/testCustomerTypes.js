const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
let findCustomerType= require('./Utilities/findCustomerTypeId');
process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Customer Types', function () {
	let server;
	this.timeout(6000);
	beforeEach( (done) => {
		let iAmDone = done;
		server = require('../bin/www' );
		setTimeout( function(){iAmDone()}, 1500);
	});
	afterEach( (done) => {
		let iAmDone = done;
		server.close();
		setTimeout( function(){iAmDone()}, 2000);
	});
	describe('GET /sema/customer-types', function() {
		it('should get all customer types', function testCustomerTypes(done) {
			chai.request(server)
				.post('/sema/login')
				.send({ usernameOrEmail:'unittest' , password:'testpassword' })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property('token');
					let token = "Bearer " + res.body.token;
					chai.request(server)
						.get('/sema/customer-types')
						.set('Authorization', token)
						.end(function(err, res) {
							// console.log(JSON.stringify(res))
							res.should.have.status(200);
							let sc_index = findCustomerType.findCustomerTypeIndex(res.body.customerTypes, 'TestCustomer');
							expect( sc_index).to.not.equal(-1);
							res.body.should.have.property('customerTypes');
							expect(res.body.customerTypes).to.be.an('array');
							res.body.customerTypes[sc_index].should.have.property('name').eql('TestCustomer');
							done(err);
						});
				});
		});
	});

});

