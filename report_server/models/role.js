/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('role', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		authority: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		code: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		}
	}, {
		tableName: 'role',
		timestamps: false,
		underscored: true
	});
};
