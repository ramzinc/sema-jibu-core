
import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('ProductMrps', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			let productMrp1 = {id:"111", siteId:"222", productId:666, salesChannelId:"777", priceAmount:100, currencyCode:"USD", cogsAmount:50};
			let productMrp2 = {id:"222", siteId:"222", productId:666, salesChannelId:"888", priceAmount:200, currencyCode:"USD", cogsAmount:100};
			let productMrps = [];
			expect(Object.keys(posStorage.getProductMrps()).length).toBe(0);
			productMrps.push(productMrp1);
			productMrps.push(productMrp2);

			posStorage.saveProductMrps(productMrps);
			expect(Object.keys(posStorage.getProductMrps()).length).toBe(2);
			return posStorage.initialize( false )
				.then( isInitialized =>{
					expect(Object.keys(posStorage.getProductMrps()).length).toBe(2);
					let productMrp1Exp = posStorage.getProductMrps()[posStorage.getProductMrpKey(productMrp1)];
					expect(productMrp1Exp.priceAmount).toBe(100);
					expect(productMrp1Exp.cogsAmount).toBe(50);


					console.log( JSON.stringify(storageCache));
				});
		});
});


