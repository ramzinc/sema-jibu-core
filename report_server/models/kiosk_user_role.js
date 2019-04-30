/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const kiosk_user_role= sequelize.define('kiosk_user_role', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		kiosk_user_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk_user',
				key: 'id'
			}
		},
		role_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'role',
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
		tableName: 'kiosk_user_role',
		timestamps: false,
		underscored: true
	});

	return kiosk_user_role;
};
