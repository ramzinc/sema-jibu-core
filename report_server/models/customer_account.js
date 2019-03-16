/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('customer_account', {
		id: {
			type: DataTypes.STRING(255),
			allowNull: false,
			primaryKey: true
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
			type: DataTypes.STRING(255),
			allowNull: false
		},
		customer_type_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'customer_type',
				key: 'id'
			}
		},
		sales_channel_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'sales_channel',
				key: 'id'
			}
		},
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'kiosk',
				key: 'id'
			}
		},
		due_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		consumer_base: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		address_line1: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		address_line2: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		address_line3: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		gps_coordinates: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		what3words: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		phone_number: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		notes: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		multimedia1: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		multimedia2: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		multimedia3: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		multimedia4: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		income_level: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		gender: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		distance: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
	        frequency :{
		        type: DataTypes.TEXT,
		        allowNull:false
	        },
	        reminder_date:{
		       type:DataTypes.DATE,
                       allowNull:false	
               }
	}, {
		tableName: 'customer_account',
		timestamps: false,
		underscored: true
	});
};
