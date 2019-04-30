var React = require('react-native');
var SQLite = require('react-native-sqlite-storage');
// SQLite.DEBUG(true);
// SQLite.enablePromise(true);


export default class InitializeDB {
	constructor() {
		this.db = null;
	}

	InitializeDatabase() {
		return new Promise((resolve, reject) => {
			SQLite.echoTest().then(() => {
				SQLite.openDatabase({name: 'main', createFromLocation : "db.sqlite"}).then((DB) => {
					this.db = DB;
					this.verifyDatabase(this.db).then(()=> {
						resolve();
					}).catch( (error) => {
						reject(error);
					});
				}).catch((error) => {
					console.log(error);
					reject(error);
				});
			}).catch(error => {
				console.log("echoTest failed - plugin not functional");
				reject(error);
			});
		});
	}
	verifyDatabase(db ){
		return new Promise((resolve, reject) => {
			db.executeSql('SELECT 1 FROM Version LIMIT 1').then(() => {
				console.log("Database exists ");
				resolve();
			}).catch((error) => {
				db.transaction(this.createDatabase).then(() => {
					console.log("Database created ");
					resolve();
				}).catch(error => {
					reject(error);
				});
			});
		});
	}
	createDatabase( tx ) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
			+ 'version_id INTEGER PRIMARY KEY NOT NULL); ').catch((error) => {
			this.errorCB(error)
		});

	}
	errorCB = (err) => {
		console.log("error: ",err);
	}

}


