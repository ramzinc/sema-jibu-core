/*
 * Set global variables here. Make sure they start
 * with "__"
 * IMPORTANT: Always add a brief comment to provide a good reason why you're
 * adding a new GLOBAL variable
 */

const path	= require('path');
const mysql	= require('mysql2');
const pe	= require('parse-error');
const env	= process.env.NODE_ENV || 'development';
const semaLog = require(`../seama_services/sema_logger`);

// So we can always have an absolute path to the root dir
__basedir	= path.resolve(__dirname, '..');

// Database configurations for different uses (sequelize/mysql2) accross the app
__dbConfig	= require(`${__basedir}/config/database`)[env];

// Clone the global DB config and add additional options
const configs = {...__dbConfig,
	connectionLimit: 100,
	supportBigNumbers: true,
	decimalNumbers: true,
	"retry":{"max": 3},
	pool: {
		max: 100,
		min: 0,
		idle: 200000,
		acquire: 1000000,
	  }
};

// The connection pool to use for database calls
__pool = mysql.createPool(configs);

// hp stands for Handle Promise
__hp = promise =>
		promise
		.then(data => [null, data])
		.catch(err => [pe(err)]);

// te stands for Throw Error
__te = (err, response, httpErrorCode, results) => {
	let stackTrace = "NA";

	if( err.hasOwnProperty("stack")){
		stackTrace = err.stack;
	}

	semaLog.error("ERROR: ", err.message, "HTTP Error code: ", httpErrorCode, "Stack: ", stackTrace);
	response.status(httpErrorCode);
	response.json(results);
}
