/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const kiosk_panel_readings= sequelize.define('kiosk_panel_readings', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		panel_imei: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'kiosk_panel',
				key: 'imei'
			}
		},
		pulse: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		pulse_record_time: {
			type: DataTypes.DATE
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'kiosk_panel_readings',
		timestamps: false,
		underscored: true
	});

	return kiosk_panel_readings;
};
