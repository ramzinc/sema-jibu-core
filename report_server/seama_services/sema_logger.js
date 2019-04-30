const winston = require('winston');

const tsFormat = () => (new Date()).toLocaleTimeString();
module.exports = new (winston.Logger)({
	transports: [
		// colorize the output to the console
		new (winston.transports.Console)({
			timestamp: tsFormat,
			colorize: true,
		})
	]
});
