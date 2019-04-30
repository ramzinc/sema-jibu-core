
import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('merging three remote customer', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			posStorage.createCustomerFull("555-1211", "Local1", "here", 1234, 456, 789, new Date("jan 1, 2005"), new Date("jan 1, 2005"));
			posStorage.createCustomerFull("555-1212", "Local2", "here", 1234, 456, 789, new Date("jan 1, 2009"), new Date("jan 1, 2009"));
			posStorage.createCustomerFull("555-1213", "Local3", "here", 1234, 456, 789, new Date("jan 1, 2015"), new Date("jan 1, 2015"));
			expect(posStorage.getPendingCustomers().length).toBe(3);
			expect(posStorage.getCustomers().length).toBe(3);
			return posStorage.initialize( false )
				.then( isInitialized =>{
					expect(posStorage.getPendingCustomers().length).toBe(3);
					expect(posStorage.getCustomers().length).toBe(3);

					// Now add three remote customers such that:
					// Remote customer 1 has the same id as local 1 but is newer... That way it will replace #1
					// Remote customer 2 has the same id as local 2 but is older... That way it will be ignored
					// Remote customer 3 is new so it will be added. We will expect a total of 4 customers with
					// no pending customers...
					let customers = [];
					let localCustomer = findCustomerByName( posStorage.getCustomers(), "Local1" );
					let remoteCustomer = {customerId:localCustomer.customerId, name:"Tom",
						phoneNumber:"555-1212", createdDate:new Date("jan 1, 2005"), updatedDate:new Date("jan 1, 2007")};
					customers.push(remoteCustomer);
					posStorage.mergeCustomers(customers);

					expect(posStorage.getPendingCustomers().length).toBe(2);	// Local 1 got replaced
					expect(posStorage.getCustomers().length).toBe(3);
					localCustomer = findCustomerByName( posStorage.getCustomers(), "Tom" );
					expect( localCustomer.name).toBe("Tom");

					localCustomer = findCustomerByName( posStorage.getCustomers(), "Local2" );
					remoteCustomer = {customerId:localCustomer.customerId, name:"Dick",
						phoneNumber:"555-1212", createdDate:new Date("jan 1, 2005"), updatedDate:new Date("jan 1, 2007")};
					customers.push(remoteCustomer);
					posStorage.mergeCustomers(customers);

					expect(posStorage.getPendingCustomers().length).toBe(2);
					expect(posStorage.getCustomers().length).toBe(3);
					localCustomer = findCustomerByName( posStorage.getCustomers(), "Local2" );
					expect( localCustomer.name).toBe("Local2");

					remoteCustomer = {customerId:"newRemoteCustomer", name:"New Remote",
						phoneNumber:"555-1212", createdDate:new Date("jan 1, 2005"), updatedDate:new Date("jan 1, 2007")};
					customers.push(remoteCustomer);
					posStorage.mergeCustomers(customers);

					expect(posStorage.getPendingCustomers().length).toBe(2);
					expect(posStorage.getCustomers().length).toBe(4);

					/// Reload and validate
					return posStorage.initialize( false )
						.then( isInitialized => {
							expect(posStorage.getPendingCustomers().length).toBe(2);
							expect(posStorage.getCustomers().length).toBe(4);

							console.log( JSON.stringify(posStorage.getCustomers()));
							// Validate all customers
							localCustomer = findCustomerByName( posStorage.getCustomers(), "Local2" );
							expect( localCustomer.name).toBe("Local2");
							localCustomer = findCustomerByName( posStorage.getCustomers(), "Tom" );
							expect( localCustomer.name).toBe("Tom");
							localCustomer = findCustomerByName( posStorage.getCustomers(), "Local3" );
							expect( localCustomer.name).toBe("Local3");
							localCustomer = findCustomerByName( posStorage.getCustomers(), "New Remote" );
							expect( localCustomer.name).toBe("New Remote");

							console.log( JSON.stringify(storageCache));
						});
				});
		});
});

const findCustomerByName = ( customers, name ) =>{
	for( let index =0; index < customers.length; index++ ){
		if( customers[index].name == name ){
			return  customers[index];
		}
	}
}
