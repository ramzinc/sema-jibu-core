module.exports = {
	development: {
		username: process.env.DB_USER || 'root', // for sequelize
		user: process.env.DB_USER || 'root', // for mysql
		password: process.env.DB_PASSWORD || null,
		database: process.env.DB_SCHEMA || 'sema_dev',
		host: process.env.DB_HOST || '127.0.0.1',
		dialect: process.env.DB_DIALECT || 'mysql'
	},
	test: {
		username: process.env.DB_USER || 'root', // for sequelize
		user: process.env.DB_USER || 'root', // for mysql
		password: process.env.DB_PASSWORD || null,
		database: process.env.DB_SCHEMA || 'sema_test',
		host: process.env.DB_HOST || '127.0.0.1',
		dialect: process.env.DB_DIALECT || 'mysql'
	},
	production: {
		username: process.env.DB_USER, // for sequelize
		user: process.env.DB_USER, // for mysql
		password: process.env.DB_PASSWORD,
		database: process.env.DB_SCHEMA,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT
	}
}
