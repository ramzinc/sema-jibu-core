
import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('Test inventory storage - purge older items', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			let inventory1 = {name1:"value1", name2:"value2" };
			expect(posStorage.getInventoryKeys().length).toBe(0);
			posStorage.addOrUpdateInventoryItem(inventory1, new Date("June 6, 2017"))	// Older that 32 days
			expect(posStorage.getInventoryKeys().length).toBe(1);
			return posStorage.initialize( false )
				.then( isInitialized =>{
					expect(posStorage.getInventoryKeys().length).toBe(1);
					// New date. Should purge the oldest
					console.log("111 " + JSON.stringify(storageCache));
					posStorage.addOrUpdateInventoryItem(inventory1, new Date("September 6, 2018"));
					console.log("222 " + JSON.stringify(storageCache));
					expect(posStorage.getInventoryKeys().length).toBe(1);
					return posStorage.initialize( false )
						.then( isInitialized => {
							expect(posStorage.getInventoryKeys().length).toBe(1);

							console.log(JSON.stringify(storageCache));
						});
				});

		});
});

