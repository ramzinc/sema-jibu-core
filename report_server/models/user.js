/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp')
		},
		first_name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		}
	}, {
		tableName: 'user',
		timestamps: false,
		underscored: true
	});
};
