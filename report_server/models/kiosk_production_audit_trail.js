/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const kiosk_production_audit_trail= sequelize.define('kiosk_production_audit_trail', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		daily_production_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk_daily_production',
				key: 'id'
			}
		},
		current_meter_adjust: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		previous_meter_adjust: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		current_meter_reading: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		previous_meter_reading: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		current_billing_adjust: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		previous_billing_adjust: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		current_billable_prod: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		previous_billable_prod: {
			type: DataTypes.INTEGER,
			allowNull:false,
			defaultValue:0
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'kiosk_daily_production_audit_trail',
		timestamps: false,
		underscored: true
	});

	return kiosk_production_audit_trail;
};
