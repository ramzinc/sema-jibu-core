import React from 'react';
import PosStorage from "../database/PosStorage";
import moment from 'moment-timezone';

class Communications {
	constructor() {
		this._url = "";
		this._site = "";
		this._user = "";
		this._password = "";
		this._token = "";
		this._siteId = "";
	}
	initialize(url, site, user, password) {
		if (!url.endsWith('/')) {
			url = url + '/';
		}
		this._url = url;
		this._site = site;
		this._user = user;
		this._password = password;
		this._token = "not set";
	}
	setToken(token) {
		this._token = token;
	}
	setSiteId(siteId) {
		this._siteId = siteId;
	}
	login() {
		let options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				usernameOrEmail: this._user,
				password: this._password,
			}),
		};

		return new Promise((resolve, reject) => {
			fetch(this._url + 'sema/login', options)
				.then((response) => {
					console.log(response.status);
					if (response.status == 200) {
						response.json()
							.then((responseJson) => {
								resolve({
									status: response.status,
									response: responseJson
								});
							})
							.catch((error) => {
								console.log(error + " INNER " + JSON.stringify(error));
								reject({
									status: response.status,
									response: error
								});
							})
					} else {
						let reason = "";
						if (response.status === 401) {
							reason = "- Invalid credentials "
						} else if (response.status === 404) {
							reason = "- Service URL not found "
						}
						console.log(reason);
						reject({
							status: response.status,
							response: {
								message: "Cannot connect to the Sema service. " + reason
							}
						});
					}
				})
				.catch((error) => {
					console.log(error + " OUTER " + JSON.stringify(error));
					reject({
						status: 418,
						response: error
					}); // This is the "I'm a teapot error"
				});
		})
	}

	getSiteId(token, siteName) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		};

		return new Promise((resolve, reject) => {
			fetch(this._url + 'sema/kiosks', options)
				.then((response) => {
					console.log(response.status);
					response.json()
						.then((responseJson) => {
							let result = -1;
							for (let i = 0; i < responseJson.kiosks.length; i++) {
								if (responseJson.kiosks[i].name === siteName) {
									if (responseJson.kiosks[i].hasOwnProperty("active") && !
										responseJson.kiosks[i].active) {
										result = -2;
									} else {
										result = responseJson.kiosks[i].id;
									}
									break;
								}
							}
							resolve(result);
						})
						.catch((error) => {
							resolve(-1);
						})
				})
				.catch((error) => {
					resolve(-1);
				});
		})

	}
    	createReminder(reminder){
	    let options = {
		method: 'POST',
		headers:{Authorization:'Bearer' + this._token}

	    };
	    let urlr = 'sema/reminders?site-id=' + this._siteId;	
	    let absurlr = this._url + urlr;
	    return new Promise((resolve, reject)=>{
	    fetch(this._url + urlr)
		.then((response) =>{
	    	    response.json();

		}).then(((jsonResponse) =>{
		    resolve(jsonResponse);})).catch((error)=>{
			console.log("Communications:createReminders" + error);
			throw(error);
		    });
	    });
    	}

	getCustomers(updatedSince) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
		let url = 'sema/site/customers?site-id=' + this._siteId;

		if (updatedSince) {
			url = url + '&updated-date=' + updatedSince.toISOString();
		}
		return fetch(this._url + url, options)
			.then((response) => response.json())
			.then((responseJson) => {
				return responseJson
			})
			.catch((error) => {
				console.log("Communications:getCustomers: " + error);
				throw (error);
			});
	}

	createCustomer(customer) {
		// TODO - Resolve customer type.... Is it needed, currently hardcoded...
		customer.customerType = 128; // FRAGILE
		let options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify(customer)

		}
		return new Promise((resolve, reject) => {
			fetch(this._url + 'sema/site/customers', options)
				.then((response) => {
					if (response.status === 200) {
						response.json()
							.then((responseJson) => {
								resolve(responseJson)
							})
							.catch((error) => {
								console.log("createCustomer - Parse JSON: " + error.message);
								reject();
							});
					} else {
						console.log("createCustomer - Fetch status: " + response.status);
						reject();
					}
				})
				.catch((error) => {
					console.log("createCustomer - Fetch: " + error.message);
					reject();
				});
		});
	}
	// Note that deleting a csutomer actually just deactivates the customer
	deleteCustomer(customer) {
		let options = {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify({
				active: false
			})
		}
		return new Promise((resolve, reject) => {
			fetch(this._url + 'sema/site/customers/' + customer.customerId, options)
				.then((response) => {
					if (response.status === 200 || response.status === 404) {
						resolve();
					} else {
						console.log("deleteCustomer - Fetch status: " + response.status);
						reject();
					}
				})
				.catch((error) => {
					console.log("deleteCustomer - Fetch: " + error.message);
					reject();
				});
		});
	}

	updateCustomer(customer) {
		let options = {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify(customer)

		}
		return new Promise((resolve, reject) => {
			fetch(this._url + 'sema/site/customers/' + customer.customerId, options)
				.then((response) => {
					if (response.status === 200) {
						response.json()
							.then((responseJson) => {
								resolve(responseJson)
							})
							.catch((error) => {
								console.log("updateCustomer - Parse JSON: " + error.message);
								reject();
							});
					} else {
						console.log("updateCustomer - Fetch status: " + response.status);
						reject();
					}
				})
				.catch((error) => {
					console.log("createCustomer - Fetch: " + error.message);
					reject();
				});
		});
	}

	getProducts(updatedSince) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
		let url = 'sema/products';

		if (updatedSince) {
			url = url + '?updated-date=' + updatedSince.toISOString();
		}
		return fetch(this._url + url, options)
			.then((response) => response.json())
			.then((responseJson) => {
				return responseJson
			})
			.catch((error) => {
				console.log("Communications:getProducts: " + error);
				throw (error);
			});
	}

	createReceipt(receipt) {

		console.log("==============================");
		console.log(JSON.stringify(receipt) + " is being sent to the backend");
		console.log("==============================");
		let options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify(this._remoteReceiptFromReceipt(receipt))

		}
		return new Promise((resolve, reject) => {
			fetch(this._url + 'sema/site/receipts', options)
				.then((response) => {
					if (response.status === 200) {
						response.json()
							.then((responseJson) => {
								resolve(responseJson)
							})
							.catch((error) => {
								alert(error.message);
								console.log("createReceipt - Parse JSON: " + error.message);
								reject();
							});
					} else if (response.status === 409) {
						// Indicates this receipt has already been added
						console.log("createReceipt - Receipt already exists");
						resolve({})
					} else {
						console.log("createReceipt - Fetch status: " + response.status);
						reject(response.status);
					}
				})
				.catch((error) => {
					console.log("createReceipt - Fetch: " + error.message);
					reject();
				});
		});
	}

	getSalesChannels() {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		}
		let url = 'sema/sales-channels';
		return fetch(this._url + url, options)
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				return responseJson
			})
			.catch((error) => {
				console.log("Communications:getSalesChannels: " + error);
				throw (error);
			});
	}

	getCustomerTypes() {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		}
		let url = 'sema/customer-types';
		return fetch(this._url + url, options)
			.then((response) => response.json())
			.then((responseJson) => {
				return responseJson
			})
			.catch((error) => {
				console.log("Communications:getCustomerTypes: " + error);
				throw (error);
			});
	}

	// getAll will determine whether to get all product mappings or not, if it's true,
	// it will send a site/kiosk ID of -1 to the server
	getProductMrps(updatedSince, getAll) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
		let url = `sema/site/product-mrps?site-id=${getAll ? -1 : this._siteId}`;

		if (updatedSince) {
			url = url + '&updated-date=' + updatedSince.toISOString();
		}
		return fetch(this._url + url, options)
			.then((response) => response.json())
			.then((responseJson) => {
				return responseJson
			})
			.catch((error) => {
				console.log("Communications:getProductMrps: " + error);
				throw (error);
			});
	}

	getProductMrpsBySiteId(siteId) {
		let options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + this._token
			}
		};
		let url = `sema/site/product-mrps?site-id=${siteId}`;
		return fetch(this._url + url, options)
			.then((response) => response.json())
			.then((responseJson) => {
				return responseJson
			})
			.catch((error) => {
				console.log("Communications:getProductMrps: " + error);
				throw (error);
			});
	}

	_remoteReceiptFromReceipt(receipt) {
		return receipt;
	}

	getReceipts(siteId) {
		let options = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + this._token
			}
		};

		let url =
			`sema/site/receipts/${siteId}?date=${moment.tz(new Date(Date.now()), moment.tz.guess()).format('YYYY-MM-DD')}`;

		return fetch(this._url + url, options)
			.then(async response => await response.json())
			.catch(error => {
				console.log("Communications:getReceipts: " + error);
				throw (error);
			});
	}

	// Sends the kiosk ID, the logged receipts and the list of IDs that the client already
	// has to the API
	sendLoggedReceipts(siteId, receipts, exceptionList) {
		let options = {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify({
				receipts,
				exceptionList
			})
		};

		let url =
			`sema/site/receipts/${siteId}?date=${moment.tz(new Date(Date.now()), moment.tz.guess()).format('YYYY-MM-DD')}`;

		return fetch(this._url + url, options)
		.then(response => response.json()).then((jsonResponse)=>{ return jsonResponse;})
			.catch(error => {
				console.log("Communications:sendUpdatedReceipts: " + error);
				throw (error);
			});
	}

	// let remoteReceipt = {
	// 	receiptId: receipt.receiptId,
	// 	customerId: receipt.customerId,
	// 	siteId: receipt.siteId,
	// 	createdDate: new Date(receipt.createdDate),
	// 	totalSales: receipt.cash + receipt.credit + receipt.mobile,
	// 	salesChannelId: 122,
	// 	cogs:"0",		// TODO - Implement this...
	// 	products: []
	// };
	// 	receipt.products.forEach( product => {
	// 		let remoteProduct = {
	// 			productId:product.id,
	// 			quantity: product.quantity,
	// 			receiptId: remoteReceipt.receiptId,
	// 			salesPrice:product.priceAmount
	// 		}
	// 		remoteReceipt.products.push( remoteProduct);
	// 	});
	// 	return remoteReceipt;
    // }
    createReminders(){
    let options = {
	    method:'POST',
	    headers: {
		Accept: 'application/json',
		Authorization:'Bearer' + this._token
	    }	    
	};



    }
    getReminders(){
       let options = {
	    method:'GET',
	    headers: {
		Accept: 'application/json',
		Authorization:'Bearer' + this._token
	    }	    
	};
    	let urlr = 'sema/reminders?site-id='+ this._siteId;
	that = this;
	return  fetch(that._url + urlr, options).then(response =>
						      
						      response.json()
								      
	).catch(error => console.log("ERROR "+ error));

			    
    }
}
export default new Communications();
