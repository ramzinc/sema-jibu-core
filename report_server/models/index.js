'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const associations = require('./associations');
const customMethods = require('./custom-methods');
const Op = Sequelize.Op;

const db = {};

const sequelize = new Sequelize(
	__dbConfig.database,
	__dbConfig.username,
	__dbConfig.password,
	{
		host: __dbConfig.host,
		dialect: __dbConfig.dialect,
		logging: false, // No need to see all those boring SQL queries
		operatorsAliases: Op // turn off string deprecation error
	}
);

fs.readdirSync(__dirname)
	.filter(file => {
		return (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			!['associations.js', 'custom-methods.js'].includes(file) &&
			file.slice(-3) === '.js'
		);
	})
	.forEach(file => {
		const model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

customMethods(db);
associations(db);

db.sequelize = sequelize;
//db.Sequelize = Sequelize;

module.exports = db;
