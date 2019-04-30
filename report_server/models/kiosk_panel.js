module.exports = function(sequelize, DataTypes) {
	const kiosk_panel= sequelize.define('kiosk_panel', {
		imei: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk',
				key: 'id'
			}
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
		}
	}, {
		tableName: 'kiosk_panel',
		timestamps: false,
		underscored: true
	});

	return kiosk_panel;
};
