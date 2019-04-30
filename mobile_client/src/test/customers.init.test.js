import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('Tests that the PosStorage internals are accessible', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			expect(Array.isArray(posStorage.getCustomers())).toBe(true);
			expect(Array.isArray(posStorage.getPendingCustomers())).toBe(true);
			expect(posStorage.getCustomers().length).toBe(0);
			expect(posStorage.getPendingCustomers().length).toBe(0);

			console.log( JSON.stringify(storageCache));
		});



});

