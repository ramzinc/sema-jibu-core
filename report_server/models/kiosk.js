/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const kiosk= sequelize.define('kiosk', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		},
		name: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		region_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'region',
				key: 'id'
			}
		}
	}, {
		tableName: 'kiosk',
		timestamps: false,
		underscored: true
	});
	
	return kiosk;
};
