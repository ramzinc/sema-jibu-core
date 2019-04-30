/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('receipt', {
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
		currency_code: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		customer_account_id: {
			type: DataTypes.STRING(255),
			allowNull: false,
			references: {
				model: 'customer_account',
				key: 'id'
			}
		},
		amount_cash: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		amount_mobile: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		amount_loan: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		amount_card: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		delivery_id: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		is_sponsor_selected: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '0'
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
			allowNull: true,
			references: {
				model: 'user',
				key: 'id'
			}
		},
		payment_type: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		sales_channel_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'sales_channel',
				key: 'id'
			}
		},
		customer_type_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'customer_type',
				key: 'id'
			}
		},
		sponsor_id: {
			type: DataTypes.STRING(255),
			allowNull: true,
			references: {
				model: 'sponsor',
				key: 'id'
			}
		},
		sponsor_amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: '0.00'
		},
		total: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		cogs: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		uuid: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		}
	}, {
		tableName: 'receipt',
		timestamps: false,
		underscored: true
	});
};
