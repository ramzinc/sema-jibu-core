const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);

const findProductId = (server, token, productSku) => {
	return new Promise((resolve, reject) => {
		let url = "/sema/products";
		chai.request(server)
			.get(url)
			.set('Authorization', token)
			.end(function(err, res) {
				let index = findProductIndex(res.body.products, productSku);
				resolve(res.body.products[index]);
			});
	});
};

function findProductIndex(products, productSku) {
	for (let i=0; i<products.length; i++) {
		if (products[i].sku === productSku) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}



module.exports = {findProductId, findProductIndex};
