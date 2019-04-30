const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;

const findCustomerId = (server, token, name, siteId) => {
	return new Promise((resolve, reject) => {
		let url = sprintf('/sema/site/customers?site-id=%s', siteId);
		chai.request(server)
			.get(url)
			.set('Authorization', token)
			.end(function(err, res) {
				let customer_index = findCustomerIndex(res.body.customers, name);
				resolve(res.body.customers[customer_index]);
			});
	});
};

function findCustomerIndex(customers, name) {
	for (let i=0; i<customers.length; i++) {
		if (customers[i].name === name) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}


module.exports = {findCustomerId, findCustomerIndex};
