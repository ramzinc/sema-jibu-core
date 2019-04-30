export default class MockStorage {
	constructor(cache = {}) {
		this.storageCache = cache;
	}

	setItem = jest.fn((key, value) => {
		return new Promise((resolve, reject) => {
			return (typeof key !== 'string' || typeof value !== 'string')
				? reject(new Error('key and value must be string'))
				: resolve(this.storageCache[key] = value);
		});
	});

	getItem = jest.fn((key) => {
		return new Promise((resolve) => {
			return this.storageCache.hasOwnProperty(key)
				? resolve(this.storageCache[key])
				: resolve(null);
		});
	});

	removeItem = jest.fn((key) => {
		return new Promise((resolve, reject) => {
			if(this.storageCache.hasOwnProperty(key)){
				delete this.storageCache[key];
				return resolve(null);
			}else {
				return reject('No such key!');
			}
		});
	});

	clear = jest.fn((key) => {
		return new Promise((resolve, reject) =>  resolve(this.storageCache = {}));
	});

	getAllKeys = jest.fn((key) => {
		return new Promise((resolve, reject) => resolve(Object.keys(this.storageCache)));
	});


	multiSet = jest.fn(( keys ) =>{
		return new Promise( (resolve, reject ) =>{
			console.log( "MockStorage:multiSet");
			keys.forEach( keyValue => {
				const key = keyValue[0];
				const value = keyValue[1];
//				console.log( "Key/Value: " + key + " " + value);
				if (typeof key !== 'string' || typeof value !== 'string'){
					reject( new Error('key and value must be string'))
				}else{
					this.storageCache[key] = value;
				}

			})
			resolve(null);
		});

	});

	multiGet = jest.fn(( keys ) =>{
		return new Promise( (resolve, reject ) =>{
			console.log( "MockStorage:multiGet");
			let keyValues = [];
			keys.forEach( key => {

				let value = this.storageCache[key];
				keyValues.push( [key, value ]);

			});
			resolve(keyValues);
		});

	});

}
