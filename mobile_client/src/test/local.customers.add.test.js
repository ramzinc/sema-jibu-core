
import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('Adding a local customer', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			expect(posStorage.getPendingCustomers().length).toBe(0);
			expect(posStorage.getCustomers().length).toBe(0);
			posStorage.createCustomer("555-1212", "fred", "here", 1234, 5678);
			expect(posStorage.getPendingCustomers().length).toBe(1);
			expect(posStorage.getCustomers().length).toBe(1);
			return posStorage.initialize( false )
				.then( isInitialized =>{
					expect(posStorage.getPendingCustomers().length).toBe(1);
					expect(posStorage.getCustomers().length).toBe(1);
					expect(posStorage.getCustomers()[0].name).toBe("fred");
					posStorage.deleteCustomer(posStorage.getCustomers()[0]);
					expect(posStorage.getPendingCustomers().length).toBe(2);
					expect(posStorage.getCustomers().length).toBe(0);
					console.log( JSON.stringify(storageCache));
				});

		});
});

