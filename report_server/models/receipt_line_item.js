/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('receipt_line_item', {
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
		currency_code: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		price_total: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		quantity: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		receipt_id: {
			type: DataTypes.STRING(255),
			allowNull: false,
			references: {
				model: 'receipt',
				key: 'id'
			}
		},
		product_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'product',
				key: 'id'
			}
		},
		cogs_total: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		}
	}, {
		tableName: 'receipt_line_item',
		timestamps: false,
		underscored: true
	});
};
