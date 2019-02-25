/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	const kiosk_role= sequelize.define('kiosk_role', {
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
		tableName: 'kiosk_role',
		timestamps: false,
		underscored: true
	});
	return kiosk_role;
};
