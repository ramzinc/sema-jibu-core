/*
This class contains the persistence implementation of the tablet business objects such as customers, sales, products

 */
const {
	React,
	AsyncStorage
} = require('react-native');
import {
	capitalizeWord
} from '../services/Utilities';
import Events from "react-native-simple-events";
import moment from 'moment-timezone';

const uuidv1 = require('uuid/v1');

const versionKey = '@Sema:VersionKey';
const customersKey = '@Sema:CustomersKey';
const customerItemKey = '@Sema:CustomerItemKey';
const salesKey = '@Sema:SalesKey';
const saleItemKey = '@Sema:SaleItemKey';
const productsKey = '@Sema:ProductsKey';
const productItemKey = '@Sema:ProductItemKey';
const lastCustomerSyncKey = '@Sema:LastCustomerSyncKey';
const lastSalesSyncKey = '@Sema:LastSalesSyncKey';
const lastProductsSyncKey = '@Sema:LastProductsSyncKey';

const pendingCustomersKey = '@Sema:PendingCustomersKey';
const pendingSalesKey = '@Sema:PendingSalesKey';

const settingsKey = '@Sema:SettingsKey';

const tokenExpirationKey = '@Sema:TokenExpirationKey';
const salesChannelsKey = '@Sema:SalesChannelsKey';
const customerTypesKey = '@Sema:CustomerTypesKey';
const productMrpsKey = '@Sema:ProductMrpsKey';
const remoteReceiptsKey = '@Sema:remoteReceiptsKey';
const reminderDataItemKey= '@Sema:remindersKey';
const syncIntervalKey = '@Sema:SyncIntervalKey';

const inventoriesKey = '@Sema:inventoriesKey';
const inventoryItemKey = '@Sema:InventoryItemKey';
import Communications from '../services/Communications';
import {
	NetInfo
} from 'react-native';

class PosStorage {
	constructor() {
		// Version, major versions require the storage to be re-written
		this.version = null;

		// Customers are saved in the form customerItemKey + Customer.id
		// For example "@Sema:CustomerItemKey_ea6c365a-7338-11e8-a3c9-ac87a31a5361"
		this.customersKeys = []; // Array of customer keys
		this.customers = []; // De-referenced customers
	    	this.reminderData = [];
	    	this.reminderDataKeys=[];//will be @Sema:remindersKey_+CustomerName+Product_name
	    
		// Sales are saved in the form {dateTime, salesItemKey} where dateTime is an ISO datetime string
		// and salestItemKey is a key to the sales item
		// For example '{"2018-05-01 00:00:00":"@Sema:SaleItemKey_2018-05-01 00:00:00"}'
		// Sales are stored most recent to oldest.
		this.salesKeys = [];

		// Products are saved in the form productItemKey + Product.sku
		// For example "@Sema:productItemKey_sku-100"
		this.productsKeys = []; // Array of product keys
		this.products = []; // De-referenced products

		// Pending customers is the array of customers, stored locally but not yet sent to the server
		this.pendingCustomers = [];

		// Pending sales is the array of sales, stored locally but not yet sent to the server
		this.pendingSales = [];

		// Last sync DateTime is the last date time that items were synchronized with the server
		let firstSyncDate = new Date('November 7, 1973');
		this.lastCustomerSync = firstSyncDate;
		this.lastSalesSync = firstSyncDate;
		this.lastProductsSync = firstSyncDate;
		this.tokenExpiration = firstSyncDate;

		this.settings = {
			semaUrl: "",
			site: "",
			user: "",
			password: "",
			uiLanguage: {},
			token: "",
			siteId: ""
		};
		this.salesChannels = [];
		this.customerTypes = [];
		this.receipts = [];
		this.productMrpDict = {};

		this.syncInterval = {
			interval: 2 * 60 * 1000
		};
		this.inventoriesKeys = []; // 30 days of inventories
	}

	initialize(forceNew) {
		console.log("PosStorage: initialize - forceNew=" + forceNew);
		return new Promise((resolve, reject) => {
			this.getKey(versionKey)
				.then((version) => {
					if (version == null || forceNew === true) {
						console.log("Pos Storage: Not initialized");
						this.version = '1';
						let keyArray = [
							[versionKey, this.version],
							[customersKey, this.stringify(this.customersKeys)],
							[salesKey, this.stringify(this.salesKeys)],
							[productsKey, this.stringify(this.productsKeys)],
							[lastCustomerSyncKey, this.lastCustomerSync.toISOString()],
							[lastSalesSyncKey, this.lastSalesSync.toISOString()],
							[lastProductsSyncKey, this.lastProductsSync.toISOString()],
							[pendingCustomersKey, this.stringify(this.pendingCustomers)],
							[pendingSalesKey, this.stringify(this.pendingSales)],
							[settingsKey, this.stringify(this.settings)],
							[tokenExpirationKey, this.stringify(this.tokenExpiration)],
							[salesChannelsKey, this.stringify(this.salesChannels)],
							[customerTypesKey, this.stringify(this.customerTypes)],
							[productMrpsKey, this.stringify(this.productMrpDict)],
							[syncIntervalKey, this.stringify(this.syncInterval)],
							[inventoriesKey, this.stringify(this.inventoriesKeys)],
						    [remoteReceiptsKey, this.stringify(this.receipts)],
						    [remoteReceiptsKey, this.stringify(this.receipts)],
						    [reminderDataItemKey, this.stringify(this.reminderData)]
						];
						AsyncStorage.multiSet(keyArray).then(error => {
							console.log("PosStorage:initialize: Error: " + error);
							resolve(false)
						});

					} else {
						console.log("Pos Storage: Version = " + version);
						this.version = version;
						let keyArray = [customersKey, salesKey, productsKey,
							lastCustomerSyncKey,
							lastSalesSyncKey, lastProductsSyncKey,
							pendingCustomersKey, pendingSalesKey,
							settingsKey, tokenExpirationKey, salesChannelsKey,
							customerTypesKey, productMrpsKey, syncIntervalKey, inventoriesKey,
								remoteReceiptsKey, reminderDataItemKey
						];
						AsyncStorage.multiGet(keyArray).then(function (results) {
							console.log("PosStorage Multi-Key" + results.length);
							for (let i = 0; i < results.length; i++) {
								console.log(" key : " + results[i][0] + " Value : " + results[i][
									1
								]);
							}
							this.customersKeys = this.parseJson(results[0][1]); // Array of customer keys
							this.salesKeys = this.parseJson(results[1][1]); // Array of sales keys
							this.productsKeys = this.parseJson(results[2][1]); // Array of products keys
							this.lastCustomerSync = new Date(results[3][1]); // Last customer sync time
							this.lastSalesSync = new Date(results[4][1]); // Last sales sync time
							this.lastProductsSync = new Date(results[5][1]); // Last products sync time
							this.pendingCustomers = this.parseJson(results[6][1]); // Array of pending customers
							this.pendingSales = this.parseJson(results[7][1]); // Array of pending sales
							this.settings = this.parseJson(results[8][1]); // Settings
							this.tokenExpiration = new Date(results[9][1]); // Expiration date/time of the token
							this.salesChannels = this.parseJson(results[10][1]); // array of sales channels
							this.customerTypes = this.parseJson(results[11][1]); // array of customer types
							this.productMrpDict = this.parseJson(results[12][1]); // products MRP dictionary
							this.syncInterval = this.parseJson(results[13][1]); // SyncInterval
							this.inventoriesKeys = this.parseJson(results[14][1]); // inventoriesKey
						    	this.receipts = this.parseJson(results[15][1]); // remoteReceiptsKey
						    	this.reminderDataKeys=this.parseJson(results[16][1]);//reminderData
							this.loadCustomersFromKeys()
								.then(() => {
									this.loadProductsFromKeys()
										.then(() => resolve(true));

								})
								.catch((err) => reject(err));

						}.bind(this));
					}
				})
				.catch(err => {
					console.log("Pos Storage: Exception " + err.message);
					reject(err);
				});
		});
	}

	getLastCustomerSync() {
		return this.lastCustomerSync;
	}
	getLastProductSync() {
		return this.lastProductsSync;
	}
	getLastSalesSync() {
		return this.lastSalesSync;
	}


	clearDataOnly() {
		// Clear all data - leave config alone. Note that customerTypesKey, salesChannelsKey and productMrpsKey
		// are NOT cleared
		this.customers = [];
		this.customersKeys = [];
		this.pendingCustomers = [];
		this.salesKeys = [];
		this.pendingSales = [];

		this.products = [];
		this.productsKeys = [];
		this.receipts = [];
	    	this.reminderData= [];
	    	this.reminderDataKeys=[];
		let firstSyncDate = new Date('November 7, 1973');
		this.lastCustomerSync = firstSyncDate;
		this.lastSalesSync = firstSyncDate;
		this.lastProductsSync = firstSyncDate;
		this.inventoriesKeys = [];
		this.productMrpDict = {};
		let keyArray = [
			[customersKey, this.stringify(this.customersKeys)],
			[productsKey, this.stringify(this.productsKeys)],
			[pendingCustomersKey, this.stringify(this.pendingCustomers)],
			[salesKey, this.stringify(this.salesKeys)],
			[pendingSalesKey, this.stringify(this.pendingSales)],
			[lastCustomerSyncKey, this.lastCustomerSync.toISOString()],
			[lastSalesSyncKey, this.lastSalesSync.toISOString()],
			[lastProductsSyncKey, this.lastProductsSync.toISOString()],
			[customerTypesKey, this.stringify(this.customerTypes)],
			[salesChannelsKey, this.stringify(this.salesChannels)],
			[productMrpsKey, this.stringify(this.productMrpDict)],
			[inventoriesKey, this.stringify(this.inventoriesKeys)],
		    [remoteReceiptsKey, this.stringify(this.receipts)],
		    [reminderDataItemKey,this.stringify(this.reminderDataKeys)]
		];

		AsyncStorage.multiSet(keyArray).then(error => {
			if (error) {
				console.log("PosStorage:clearDataOnly: Error: " + error);
			}
		});
	}

	makeCustomerKey(customer) {
		return (customerItemKey + '_' + customer.customerId);
	}
	customerIdFromKey(customerKey) {
		const prefix = customerItemKey + '_';
		return customerKey.slice(prefix.length);
	}

        createCustomer(phone, name, address, siteId, salesChannelId, customerTypeId,frequency) {
	        const now = new Date();
	        return this.createCustomerFull(phone, name, address, siteId, salesChannelId,
					       customerTypeId, now, now, frequency);
	 }

        
	    
	    



	createCustomerFull(phone, name, address, siteId, salesChannelId,
			   customerTypeId, createdDate, updatedDate,frequency) {
		const newCustomer = {
			customerId: uuidv1(),
			name: name,
			phoneNumber: phone,
			address: address,
			siteId: siteId,
			dueAmount: 0,
			salesChannelId: salesChannelId,
			customerTypeId: customerTypeId,
			createdDate: createdDate,
		        updatedDate: updatedDate,
		        frequency: frequency

		};
		let key = this.makeCustomerKey(newCustomer);
		this.customers.push(newCustomer);
		newCustomer.syncAction = "create";
		this.customersKeys.push(key);
		this.pendingCustomers.push(key);
		let keyArray = [
			[customersKey, this.stringify(this.customersKeys)], // Array of customer keys
			[key, this.stringify(newCustomer)], // The new customer
			[pendingCustomersKey, this.stringify(this.pendingCustomers)] // Array pending customer
		];
		AsyncStorage.multiSet(keyArray).then(error => {
			console.log("PosStorage:createCustomer: Error: " + error);
			if (error) {
				console.log("PosStorage:createCustomer: Error: " + error);
			}
		});
		return newCustomer;
	}
    	getRemindersPos(){
	    let reminderArray= Communications.getReminders();
	    console.log("Communications getReminders->"+reminderArray);
	    this.reminderData = reminderArray;
	    console.log("This dat REMINDER_DATA ==>"+this.reminderData);
	    return this.reminderData;
    	}
       setReminderDate(customer, customerFrequency){
       	   let  reminder_date = moment().add(customerFrequency,'day').format("YYYY-MM-DD");
	   console.log('Setting reminderDate ===>'+ reminder_date);
	   customer.reminder_date = reminder_date;
	   let key = this.makeCustomerKey(customer);
	   customer.syncAction = "update";	 
	   //customer.reminder_date = reminder_date;
	   console.log(customer);
	   this.pendingCustomers.push(key);

		let keyArray = [
			[key, this.stringify(customer)], // Customer keys
			[pendingCustomersKey, this.stringify(this.pendingCustomers)] // Array pending customer
		];
		AsyncStorage.multiSet(keyArray).then(error => {
			if (error) {
				console.log("PosStorage:updateCustomer: Error: " + error);
			}
		});
	     


        }
	deleteCustomer(customer) {
		let key = this.makeCustomerKey(customer);
		let index = this.customers.indexOf(customer);
		if (index > -1) {
			let customer = this.customers[index];
			customer.syncAction = "delete";
			this.customers.splice(index, 1);
			index = this.customersKeys.indexOf(key);
			if (index > -1) {
				this.customersKeys.splice(index, 1);
			}
			this.pendingCustomers.push(key);
			let keyArray = [
				[customersKey, this.stringify(this.customersKeys)], // Array of customer keys
				[key, this.stringify(customer)], // The customer being deleted
				[pendingCustomersKey, this.stringify(this.pendingCustomers)] // Array pending customer
			];
			AsyncStorage.multiSet(keyArray).then(error => {
				if (error) {
					console.log("PosStorage:deleteCustomer: Error: " + error);
				}
			});
		}
	}

	// TODO: Only accept the new customer object
    updateCustomer(customer, phone, name, address, salesChannelId, customerTypeId,frequency) {
		let key = this.makeCustomerKey(customer);
		customer.name = name;
		customer.phoneNumber = phone;
		customer.address = address;
		customer.salesChannelId = salesChannelId;
		customer.customerTypeId = customerTypeId;
		customer.updatedDate = new Date();
	        customer.syncAction = "update";
		customer.frequency = frequency;
		if(customer.reminder_date){
		    customer.reminder_date = moment(customer.reminder_date).format('YYYY-MM-DD');
	        }
	console.log("THE CUSTOMER REMINDER DATE===>"+ customer.reminder_date);
		this.pendingCustomers.push(key);

		let keyArray = [
			[key, this.stringify(customer)], // Customer keys
			[pendingCustomersKey, this.stringify(this.pendingCustomers)] // Array pending customer
		];
		AsyncStorage.multiSet(keyArray).then(error => {
			if (error) {
				console.log("PosStorage:updateCustomer: Error: " + error);
			}
		});

	}
	addRemoteCustomers(customerArray) {
		console.log(
			"PosStorage:addCustomers: No existing customers no need to merge....");
		this.customers = [];
		let keyValueArray = [];
		let keyArray = [];
		for (let index = 0; index < customerArray.length; index++) {
			if (customerArray[index].active) {
				keyValueArray.push([this.makeCustomerKey(customerArray[index]), this.stringify(
					customerArray[index])]);
				keyArray.push(this.makeCustomerKey(customerArray[index]));
				this.customers.push(customerArray[index]);
			}
		}
		this.customersKeys = keyArray;
		keyValueArray.push([customersKey, this.stringify(keyArray)]);
		AsyncStorage.multiSet(keyValueArray).then(error => {
			if (error) {
				console.log("PosStorage:addCustomers: Error: " + error);
			}
		});
	}

	// Merge new customers into existing ones
	mergeCustomers(remoteCustomers) {
		console.log("PosStorage:mergeCustomers Number of remote customers: " +
			remoteCustomers.length);
		let newCustomersAdded = remoteCustomers.length > 0 ? true : false;
		if (this.customers.length == 0) {
			this.addRemoteCustomers(remoteCustomers);
			return {
				pendingCustomers: this.pendingCustomers.slice(),
				updated: newCustomersAdded
			};
		} else {
			// Need to merge webCustomers with existing and pending customers
			console.log("PosStorage:mergeCustomers. Merging " + remoteCustomers.length +
				" web Customers into existing and pending customers");
			let webCustomersToUpdate = [];
			let isPendingModified = false;
			remoteCustomers.forEach(remoteCustomer => {
				const webCustomerKey = this.makeCustomerKey(remoteCustomer);
				const pendingIndex = this.pendingCustomers.indexOf(webCustomerKey);
				if (pendingIndex != -1) {
					let localCustomer = this.getLocalCustomer(remoteCustomer.customerId);
					if (localCustomer) {
						console.log("PostStorage - mergeCustomers. Local Date " + new Date(
								localCustomer.updatedDate) +
							" Remote Date " + remoteCustomer.updatedDate);
					}
					if (localCustomer && remoteCustomer.updatedDate > new Date(
							localCustomer.updatedDate)) {
						// remoteCustomer is the latest
						console.log("PostStorage - mergeCustomers. Remote customer " +
							remoteCustomer.name + " is later:");
						webCustomersToUpdate.push(remoteCustomer);
						this.pendingCustomers.splice(pendingIndex, 1);
						isPendingModified = true;
					} else {
						console.log("PostStorage - mergeCustomers. Local customer " +
							localCustomer.name + " is later:")
					}

				} else {
					webCustomersToUpdate.push(remoteCustomer);
				}
			});
			if (isPendingModified) {
				this.setKey(pendingCustomersKey, this.stringify(this.pendingCustomers));
			}
			this.mergeRemoteCustomers(webCustomersToUpdate);
			return {
				pendingCustomers: this.pendingCustomers.slice(),
				updated: newCustomersAdded
			};
		}
	}
	mergeRemoteCustomers(remoteCustomers) {
		let isNewCustomers = false;
		remoteCustomers.forEach(function (customer) {
			let customerKey = this.makeCustomerKey(customer);
			let keyIndex = this.customersKeys.indexOf(customerKey);
			if (keyIndex === -1) {
				if (customer.active) {
					isNewCustomers = true;
					this.customersKeys.push(customerKey);
					this.customers.push(customer);
					this.setKey(customerKey, this.stringify(customer));
				}
			} else {
				if (customer.active) {
					this.setKey(customerKey, this.stringify(customer)); // Just update the existing customer
					this.setLocalCustomer(customer);
				} else {
					// Remove an inactivated customer
					let index = this.getLocalCustomerIndex(customer.customerId);
					if (index > -1) {
						this.customers.splice(index, 1);
						index = this.customersKeys.indexOf(customerKey);
						if (index > -1) {
							this.customersKeys.splice(index, 1);
						}
						let keyArray = [
							[customersKey, this.stringify(this.customersKeys)], // Array of customer keys
							[customerKey, this.stringify(customer)], // The customer being deleted
						];
						AsyncStorage.multiSet(keyArray).then(error => {
							if (error) {
								console.log("PosStorage:mergeRemoteCustomers: Error: " + error);
							}
						});
					}

				}
			}
		}.bind(this));
		if (isNewCustomers) {
			this.setKey(customersKey, this.stringify(this.customersKeys));
		}

	}
	getLocalCustomer(customerId) {
		for (let index = 0; index < this.customers.length; index++) {
			if (this.customers[index].customerId === customerId) {
				return this.customers[index];
			}
		}
		return null;
	}
	getLocalCustomerIndex(customerId) {
		for (let index = 0; index < this.customers.length; index++) {
			if (this.customers[index].customerId === customerId) {
				return index;
			}
		}
		return -1;
	}

	setLocalCustomer(customer) {
		for (let index = 0; index < this.customers.length; index++) {
			if (this.customers[index].customerId === customer.customerId) {
				this.customers[index] = customer;
				return;
			}
		}
	}

	loadCustomersFromKeys() {
		console.log("loadCustomersFromKeys. No of customers: " + this.customersKeys.length);
		return new Promise((resolve, reject) => {
			try {
				let that = this;
				AsyncStorage.multiGet(this.customersKeys).then(results => {
					that.customers = results.map(result => {
						return that.parseJson(result[1]);
					});
					resolve();
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	removePendingCustomer(customerKey) {
		console.log("PostStorage:removePendingCustomer");
		const index = this.pendingCustomers.indexOf(customerKey);
		if (index > -1) {
			this.pendingCustomers.splice(index, 1);
			let keyArray = [
				[pendingCustomersKey, this.stringify(this.pendingCustomers)]
			];
			AsyncStorage.multiSet(keyArray).then(error => {
				if (error) {
					console.log("PosStorage:removePendingCustomer: Error: " + error);
				}
			});

		}

	}

	getCustomerFromKey(customerKey) {
		return new Promise(resolve => {
			this.getKey(customerKey)
				.then(customer => {
					resolve(this.parseJson(customer))
				})
				.catch(() => {

					resolve(null)
				});
		})
	}

	getCustomers() {
		console.log("PosStorage: getCustomers. Count " + this.customers.length);
		return this.customers;
	}

	getReceipts() {
		console.log("PosStorage: getReceipts. Count " + this.receipts.length);
		return this.receipts;
	}

	getPendingCustomers() {
		console.log("PosStorage: getPendingCustomers. Count " + this.pendingCustomers
			.length);
		return this.pendingCustomers;
	}

	getSales() {
		console.log("PosStorage: getSales. Count " + this.salesKeys.length);
		return this.salesKeys;
	}

	getFilteredSales(beginDate, endDate) {
		console.log("PosStorage: getFilteredSales. between " + beginDate.toString() +
			" and " + endDate.toString());
		return this.salesKeys.filter(receipt => {
			return moment.tz(
					new Date(receipt.saleDateTime),
					moment.tz.guess()
				)
				.isBetween(beginDate, endDate);
		});
	}

	addSale(receipt) {

		return new Promise((resolve, reject) => {
			receipt.receiptId = uuidv1();

			let saleDateKey = receipt.id;
			this.salesKeys.push({
				saleDateTime: saleDateKey,
				saleKey: saleItemKey + saleDateKey
			});
			if (this.salesKeys.length > 1) {
				// When adding a sale, purge the top one if it is older than 30 days
				let oldest = this.salesKeys[0];
				let firstDate = new Date(oldest.saleDateTime);
				firstDate = new Date(firstDate.getTime() + 30 * 24 * 60 * 60 * 1000);
				const now = new Date();
				if (firstDate < now) {
					// Older than 30 days remove it
					this.salesKeys.shift();
					AsyncStorage.removeItem(oldest.saleKey).then(error => {
						if (error) {
							console.log("error removing " + oldest.saleKey);
						} else {
							Events.trigger('RemoveLocalReceipt', saleDateKey);
							console.log("Removed " + oldest.saleKey)
						}
					});
				}
			}
			this.pendingSales.push(saleItemKey + saleDateKey);
			let keyArray = [
				[saleItemKey + saleDateKey, this.stringify(receipt)], // The sale
				[salesKey, this.stringify(this.salesKeys)], // Array of date/time sales keys
				[pendingSalesKey, this.stringify(this.pendingSales)]
			]; // Pending sales keys
			AsyncStorage.multiSet(keyArray).then(error => {
				if (error) {
					reject(error);
				} else {
					resolve(saleItemKey + saleDateKey);
				}
			});
		});
	}
	loadSale(saleKey) {
		console.log("PosStorage:loadSale");
		return new Promise((resolve, reject) => {
			this.getKey(saleKey.saleKey)
				.then(sale => {
					resolve(this.parseJson(sale));
				})
				.catch(err => reject(err))

		});
	}

	loadSalesReceipts(lastSalesSyncDate) {
		console.log("PosStorage:loadSalesReceipts");
		return new Promise((resolve, reject) => {
			let results = [];
			let sales = this.pendingSales;
			let resolvedCount = 0;
			if (sales.length === 0) {
				resolve(results)
			} else {
				for (let index = 0; index < sales.length; index++) {
					this._loadPendingSale(sales[index]).then((sale) => {
						results.push({
							key: sales[resolvedCount],
							sale: sale
						});
						resolvedCount++;
						if ((resolvedCount) === sales.length) {
							resolve(results);
						}
					});
				}
			}
		});
	};

	removePendingSale(saleKey, saleId) {
		console.log("PostStorage:removePendingSale");
		const index = this.pendingSales.indexOf(saleKey);
		if (index > -1) {
			this.pendingSales.splice(index, 1);
			let keyArray = [
				[pendingSalesKey, this.stringify(this.pendingSales)]
			];
			AsyncStorage.multiSet(keyArray).then(error => {
				if (error) {
					return console.log("PosStorage:removePendingSale: Error: " + error);
				}

				Events.trigger('RemoveLocalReceipt', saleId);
			});

		}

	}

	// Update a pending sale
	updatePendingSale(saleKey) {
		console.log("PostStorage:updatePendingSale");

		if (!saleKey.startsWith(saleItemKey)) {
			saleKey = `${saleItemKey}${saleKey}`;
		}

		this.getKey(saleKey)
			.then(receiptJSON => this.parseJson(receiptJSON))
			.then(receipt => {
				if (!receipt) return;

				receipt.active = 0;
				receipt.products = receipt.products.map(rli => {
					rli.active = 0;
					return rli;
				});
				this.setKey(saleKey, this.stringify(receipt));
			});
	}

	_loadPendingSale(saleKey) {
		return new Promise((resolve, reject) => {
			this.getKey(saleKey)
				.then(sale => {
					resolve(this.parseJson(sale));
				})
				.catch(err => reject(err))

		});
	}

	getProducts() {
		console.log("PosStorage: getProducts. Count " + this.products.length);
		return this.products;
	}

	loadProductsFromKeys() {
		console.log("loadProductsFromKeys. No of products: " + this.productsKeys.length);
		return new Promise((resolve, reject) => {
			try {
				let that = this;
				AsyncStorage.multiGet(this.productsKeys).then(results => {
					that.products = results.map(result => {
						return that.parseJson(result[1]);
					});
					resolve();
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	makeProductKey(product) {
		return (productItemKey + '_' + product.productId);
	}

	mergeProducts(remoteProducts) {
		let hasNewProducts = false;

		remoteProducts.forEach(function (product) {
			let productKey = this.makeProductKey(product);
			let keyIndex = this.productsKeys.indexOf(productKey);

			if (keyIndex === -1 && product.active) {
				hasNewProducts = true;
				this.productsKeys.push(productKey);
				this.products.push(product);
				this.setKey(productKey, this.stringify(product));
			} else if (keyIndex !== -1) {
				if (product.active) {
					this.setKey(productKey, this.stringify(product)); // Just update the existing product
					this.setLocalProduct(product)
				} else {
					// Product has been deactivated - remove it
					this.productsKeys.splice(keyIndex, 1);
					hasNewProducts = true;
					this.removeKey(productKey);
					let productIndex = this.getLocalProductIndex(product);
					if (productIndex != -1) {
						this.products.splice(productIndex, 1);
					}
				}
			}
		}.bind(this));

		if (hasNewProducts) {
			this.setKey(productsKey, this.stringify(this.productsKeys));
			return true;
		}

		return false;
	}

	setLocalProduct(product) {
		for (let index = 0; index < this.products.length; index++) {
			if (this.products[index].productId === product.productId) {
				this.products[index] = product;
				return;
			}
		}
	}

	getLocalProductIndex(product) {
		for (let index = 0; index < this.products.length; index++) {
			if (this.products[index].productId === product.productId) {
				return index;
			}
		}
		return -1;
	}

	getSettings() {
		console.log("PosStorage: getSettings.");
		return this.settings;
	}

	loadSettings() {
		console.log("PosStorage:loadSettings");
		return new Promise((resolve, reject) => {
			this.getKey(settingsKey)
				.then(settings => {
					resolve(this.parseJson(settings));
				})
				.catch(err => reject(err))
		});
	}

	saveSettings(url, site, user, password, uiLanguage, token, siteId) {
		let settings = {
			semaUrl: url,
			site,
			user,
			password,
			uiLanguage,
			token,
			siteId
		};
		this.settings = settings;
		this.setKey(settingsKey, this.stringify(settings));

	}

	setTokenExpiration() {
		// Currently the token is good for one day (24 hours)
		let expirationDate = new Date();
		expirationDate.setTime(expirationDate.getTime() + (22 * 60 * 60 * 1000));
		console.log("Token will expire at: " + expirationDate.toString());
		this.setKey(tokenExpirationKey, expirationDate.toISOString());
		this.tokenExpiration = expirationDate;
	}
	getTokenExpiration() {
		return this.tokenExpiration;
	}

	setLastCustomerSync(lastSyncTime) {
		this.lastCustomerSync = lastSyncTime;
		this.setKey(lastCustomerSyncKey, this.lastCustomerSync.toISOString());
	}

	setLastProductSync(lastSyncTime) {
		this.lastProductsSync = lastSyncTime;
		this.setKey(lastProductsSyncKey, this.lastProductsSync.toISOString());
	}

	setLastSalesSync(lastSyncTime) {
		this.lastSalesSync = lastSyncTime;
		this.setKey(lastSalesSyncKey, this.lastSalesSync.toISOString());

	}

	getSalesChannels() {
		return this.salesChannels;
	}

	saveSalesChannels(salesChannelArray) {
		this.salesChannels = salesChannelArray;
		this.setKey(salesChannelsKey, this.stringify(salesChannelArray));
	}

	loadSalesChannels() {
		console.log("PosStorage:loadSalesChannels");
		return new Promise((resolve, reject) => {
			this.getKey(salesChannelsKey)
				.then(salesChannels => {
					if (!salesChannels) {
						return resolve([]);
					}
					resolve(this.parseJson(salesChannels));
				})
				.catch(err => reject(err))
		});
	}

	loadProductMrps() {
		console.log("PosStorage:loadProductMrps");
		return new Promise((resolve, reject) => {
			this.getKey(productMrpsKey)
				.then(productMrps => {
					if (!productMrps) {
						return resolve([]);
					}
					resolve(this.parseJson(productMrps));
				})
				.catch(err => reject(err))
		});
	}

	getSalesChannelsForDisplay() {
		return this.salesChannels.map(salesChannel => {
			return {
				id: salesChannel.id,
				name: salesChannel.name,
				displayName: capitalizeWord(salesChannel.name)
			};
		});
	}

	getSalesChannelFromName(name) {
		for (let i = 0; i < this.salesChannels.length; i++) {
			if (this.salesChannels[i].name === name) {
				return this.salesChannels[i];
			}
		}
		return null;
	}

	getSalesChannelFromId(id) {
		for (let i = 0; i < this.salesChannels.length; i++) {
			if (this.salesChannels[i].id === id) {
				return this.salesChannels[i];
			}
		}
		return null;
	}

	getCustomerTypesForDisplay() {
		let customerTypesForDisplay = [];
		this.customerTypes.forEach(customerType => {
			if (customerType.name !== "anonymous") {
				customerTypesForDisplay.push({
					id: customerType.id,
					name: customerType.name,
					displayName: capitalizeWord(customerType.name)
				});
			}
		})
		return customerTypesForDisplay;
	}


	getCustomerTypes() {
		return this.customerTypes;
	}
	getCustomerTypeByName(name) {
		for (let i = 0; i < this.customerTypes.length; i++) {
			if (this.customerTypes[i].name === name) {
				return this.customerTypes[i];
			}
		}
		return null;

	}
	saveCustomerTypes(customerTypesArray) {
		this.customerTypes = customerTypesArray;
		this.setKey(customerTypesKey, this.stringify(customerTypesArray));
	}

	saveProductMrps(productMrpsArray) {
		this.productMrpDict = {}; // Note - This assumes that all productMrps are being saved
		productMrpsArray.forEach(productMrp => {
			const key = this.getProductMrpKey(productMrp);
			this.productMrpDict[key] = productMrp;
		});
		this.setKey(productMrpsKey, this.stringify(this.productMrpDict));
	}

	getProductMrps() {
		return this.productMrpDict;
	}
	getProductMrpKey(productMrp) {
		return "" + productMrp.productId + "-" + productMrp.salesChannelId; // ProductId and salesChannelId are unique key
	}

	getProductMrpKeyFromIds(productId, salesChannelId) {
		return "" + productId + "-" + salesChannelId;
	}

	getGetSyncInterval() {
		if (this.syncInterval == null) {
			this.syncInterval = {
				interval: 2 * 60 * 1000
			}; // Default to 2 minutes
		}
		return this.syncInterval.interval;
	}
	setGetSyncInterval(intervalInMinutes) {
		this.setKey(syncIntervalKey, JSON.stringify({
			interval: intervalInMinutes * 60 * 1000
		}));
	}

	getInventoryKeys() {
		return this.inventoriesKeys;
	}
	addOrUpdateInventoryItem(inventory, inventoryDate) {
		console.log("PosStorage: getInventoryItem");
		if (typeof inventoryDate == 'string') {
			inventoryDate = new Date(inventoryDate);
		}

		return new Promise((resolve, reject) => {
			let inventoryKey = this._makeInventoryKey(inventoryDate);
			let existing = this._getInventoryItemKey(inventoryDate);
			if (existing != null) {
				this.setKey(inventoryKey, this.stringify(inventory)).then(error => {
					if (error) {
						reject(error);
					} else {
						resolve(true);
					}
				});
			} else {
				this.inventoriesKeys.push({
					inventoryDate: inventoryDate,
					inventoryKey: inventoryKey
				});

				if (this.inventoriesKeys.length > 1) {
					// When adding an item, purge the top one if it is older than 32 days
					let oldest = this.inventoriesKeys[0];
					let firstDate = new Date(oldest.inventoryDate);
					firstDate = new Date(firstDate.getTime() + 32 * 24 * 60 * 60 * 1000);
					const now = new Date();
					if (firstDate < now) {
						// Older than 32 days remove it
						this.inventoriesKeys.shift();
						AsyncStorage.removeItem(oldest.inventoryKey).then(error => {
							if (error) {
								console.log("error removing " + oldest.inventoryKey);
							} else {
								console.log("Removed " + oldest.inventoryKey)
							}
						});
					}
				}
				let keyArray = [
					[inventoryKey, this.stringify(inventory)],
					[inventoriesKey, this.stringify(this.inventoriesKeys)]
				]; // Array of date/time inventory keys
				AsyncStorage.multiSet(keyArray).then(error => {
					if (error) {
						reject(error);
					} else {
						resolve(true);
					}
				});
			}
		});
	}

	getInventoryItem(inventoryDate) {
		return new Promise((resolve) => {
			let key = this._getInventoryItemKey(inventoryDate);
			if (key != null) {
				this.getKey(key)
					.then(item => {
						resolve(this.parseJson(item));
					})
					.catch(err => resolve(null));

			} else {
				resolve(null);
			}
		});

	}

	saveRemoteReceipts(receipts = []) {
		this.receipts = receipts;
		this.setKey(remoteReceiptsKey, this.stringify(receipts));
	}

	addRemoteReceipts(receipts) {
		this.receipts = this.getReceipts();
		return this.setKey(remoteReceiptsKey, this.stringify([...this.receipts, ...
				receipts
			]))
			.then(() => {
				return [...this.receipts, ...receipts];
			});
	}

	getRemoteReceipts() {
		console.log("PosStorage: getRemoteReceipts. Count " + this.receipts.length,
			JSON.stringify(this.receipts));
		return this.receipts;
	}

	loadRemoteReceipts() {
		return this.getKey(remoteReceiptsKey)
			.then(receipts => {
				this.receipts = JSON.parse(receipts);
				return this.receipts;
			});
	}

	updateLoggedReceipt(receiptId, updatedFields) {
		this.getKey(remoteReceiptsKey)
			.then(receiptsJSON => this.parseJson(receiptsJSON))
			.then(receipts => {
				if (!receipts) return;

				receipts = receipts.map(receipt => {
					console.log(receiptId, receipt.id);
					if (receipt.id === receiptId) {
						receipt = {
							...receipt,
							...updatedFields
						};
						receipt.receipt_line_items = receipt.receipt_line_items.map(rli => {
							rli.active = updatedFields.active;
							return rli;
						});
					}
					return receipt;
				});

				this.receipts = receipts;
				this.setKey(remoteReceiptsKey, this.stringify(this.receipts));
			});
	}

	logReceipt(receipt) {
		this.getKey(remoteReceiptsKey)
			.then(receiptsJSON => this.parseJson(receiptsJSON))
			.then(receipts => {
				if (!receipts) return;

				receipts.push(receipt);
				this.receipts = receipts;
				this.setKey(remoteReceiptsKey, this.stringify(this.receipts));
			});
	}

	// Return existing inventory item key or null
	_getInventoryItemKey(inventoryDate) {
		console.log("PosStorage:getInventoryItem");
		let inventoryKey = this._makeInventoryKey(inventoryDate);
		for (let index = 0; index < this.inventoriesKeys.length; index++) {
			if (this.inventoriesKeys[index].inventoryKey == inventoryKey) {
				return inventoryKey;
			}
		}
		return null;
	}
	_makeInventoryKey(date) {
		console.log("PosStorage._makeInventoryKey" + date);
		return inventoryItemKey + date.getFullYear() + '-' + date.getMonth() + '-' +
			date.getDate();
	}

	stringify(jsObject) {
		return JSON.stringify(jsObject);
	}
	parseJson(jsonString) {
		if (typeof jsonString === 'string') {
			return JSON.parse(jsonString);
		}
		return null;
	}

	// async getKey( key) {
	// 	try {
	// 		console.log("Pos Storage:getKey()" + key);
	// 		const value = await AsyncStorage.getItem(key );
	// 		return value;
	// 	} catch (error) {
	// 		console.log("Pos Storage Error retrieving data");
	// 	}
	// }
	// async setKey( key, stringValue ) {
	// 	try {
	// 		console.log("Pos Storage:setKey() Key: " + key + " Value: " + stringValue);
	// 		await AsyncStorage.setItem(key, stringValue);
	//
	// 	} catch (error) {
	// 		console.log("Pos Storage Error saving data" + error);
	// 	}
	// }

	getKey(key) {
		return AsyncStorage.getItem(key);
	}
	setKey(key, stringValue) {
		console.log("Pos Storage:setKey() Key: " + key + " Value: " + stringValue);
		return AsyncStorage.setItem(key, stringValue);
	}

	async removeKey(key) {
		try {
			await AsyncStorage.removeItem(key);

		} catch (error) {
			console.log("Pos Storage Error removing data" + error);
		}
	}

}
// Storage is a singleton

export default new PosStorage();
