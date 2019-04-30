const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);

const findCustomerTypeId = (server, token, customerTypeName) => {
	return new Promise((resolve, reject) => {
		let url = "/sema/customer-types";
		chai.request(server)
			.get(url)
			.set('Authorization', token)
			.end(function(err, res) {
				let ct_index = findCustomerTypeIndex(res.body.customerTypes, customerTypeName);
				resolve(res.body.customerTypes[ct_index]);
			});
	});
};

function findCustomerTypeIndex(customerTypes, customerTypeName) {
	for (let i=0; i<customerTypes.length; i++) {
		if (customerTypes[i].name === customerTypeName) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}



module.exports = {findCustomerTypeId, findCustomerTypeIndex};
