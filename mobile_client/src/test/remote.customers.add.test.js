
import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('Adding a remote customer', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			let customer = {customerId:"111-222", name:"fred", phoneNumber:"555-1212"};
			let customers = [];
			expect(posStorage.getPendingCustomers().length).toBe(0);
			expect(posStorage.getCustomers().length).toBe(0);
			customers.push(customer);
			posStorage.addRemoteCustomers(customers);
			expect(posStorage.getPendingCustomers().length).toBe(0);
			expect(posStorage.getCustomers().length).toBe(1);
			return posStorage.initialize( false )
				.then( isInitialized =>{
					expect(posStorage.getPendingCustomers().length).toBe(0);
					expect(posStorage.getCustomers().length).toBe(1);
					expect(posStorage.getCustomers()[0].customerId).toBe("111-222");
					posStorage.deleteCustomer(posStorage.getCustomers()[0]);
					expect(posStorage.getPendingCustomers().length).toBe(1);
					expect(posStorage.getCustomers().length).toBe(0);
					console.log( JSON.stringify(storageCache));
				});
		});
});

