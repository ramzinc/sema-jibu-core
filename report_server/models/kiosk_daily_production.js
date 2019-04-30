/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const kiosk_daily_production= sequelize.define('kiosk_daily_production', {
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
		day_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		production: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		cumulative_meter_adjustment: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		water_meter_reading: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		cumulative_billing_adjustment: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		billable_production: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		last_update_by: {
			type: DataTypes.BIGINT,
			allowNull: true
		}
	}, {
		tableName: 'kiosk_daily_production',
		timestamps: false,
		underscored: true
	});

	return kiosk_daily_production;
};
