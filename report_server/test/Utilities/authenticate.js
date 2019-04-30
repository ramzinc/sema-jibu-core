const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();


const authenticate = (server) => {
	return new Promise((resolve, reject) => {
		chai.request(server)
			.post('/sema/login')
			.send({ usernameOrEmail: 'unittest', password: 'testpassword' })
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('token');
				let token = "Bearer " + res.body.token;
				resolve(token);
			});

	});
};


module.exports = authenticate;
