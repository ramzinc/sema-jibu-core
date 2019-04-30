const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);

const findSalesChannelId = (server, token, salesChannelName) => {
	return new Promise((resolve, reject) => {
		let url = "/sema/sales-channels";
		chai.request(server)
			.get(url)
			.set('Authorization', token)
			.end(function(err, res) {
				let sales_by_channel_index = findSalesChannelIndex(res.body.salesChannels, salesChannelName);
				resolve(res.body.salesChannels[sales_by_channel_index]);
			});
	});
};

function findSalesChannelIndex(salesChannels, salesChannelName) {
	for (let i=0; i<salesChannels.length; i++) {
		if (salesChannels[i].name === salesChannelName) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}



module.exports = {findSalesChannelId, findSalesChannelIndex};
