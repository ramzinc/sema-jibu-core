
import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('Merging a product', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			let product = {productId:"111-222", base64encodedImage:"image", description:"description", priceAmount:"5", sku:"sku-1234"};
			let products = [];
			expect(posStorage.getProducts().length).toBe(0);
			products.push(product);
			posStorage.mergeProducts(products);
			expect(posStorage.getProducts().length).toBe(1);
			return posStorage.initialize( false )
				.then( isInitialized =>{
					expect(posStorage.getProducts().length).toBe(1);
					expect(posStorage.getProducts()[0].productId).toBe("111-222");
					expect(posStorage.getProducts()[0].base64encodedImage).toBe("image");
					expect(posStorage.getProducts()[0].description).toBe("description");
					expect(posStorage.getProducts()[0].priceAmount).toBe("5");
					expect(posStorage.getProducts()[0].sku).toBe("sku-1234");
					product.priceAmount = "10";
					products = [];
					products.push(product);
					posStorage.mergeProducts(products);
					return posStorage.initialize( false )
						.then(isInitialized =>{
							console.log("foo " + posStorage.getProducts()[0].priceAmount);
							expect(posStorage.getProducts().length).toBe(1);
							expect(posStorage.getProducts()[0].productId).toBe("111-222");
							expect(posStorage.getProducts()[0].priceAmount).toBe("10");
						});
				});
		});
});


