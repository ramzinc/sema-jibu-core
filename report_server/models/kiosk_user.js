/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const kiosk_user= sequelize.define('kiosk_user', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk',
				key: 'id'
			}
		},
		user_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id'
			}
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		}
	}, {
		tableName: 'kiosk_user',
		timestamps: false,
		underscored: true
	});

	return kiosk_user;
};
