const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

const findKioskId = (server, token, siteName) => {
	return new Promise((resolve, reject) => {
		chai.request(server)
			.get('/sema/kiosks')
			.set('Authorization', token)
			.end(function(err, res) {
				let site_index = findKioskIndex(res.body.kiosks, siteName);
				resolve(res.body.kiosks[site_index]);
			});
	});
};

function findKioskIndex(kiosks, kioskName) {
	for (let i=0; i<kiosks.length; i++) {
		if (kiosks[i].name === kioskName) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}



module.exports = {findKioskId, findKioskIndex};





