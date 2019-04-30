/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'product_mrp',
		{
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
			kiosk_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: 'kiosk',
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
			sales_channel_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: 'sales_channel',
					key: 'id'
				}
			},
			price_amount: {
				type: DataTypes.DECIMAL,
				allowNull: false
			},
			price_currency: {
				type: DataTypes.STRING(255),
				allowNull: false
			},
			cogs_amount: {
				type: DataTypes.DECIMAL,
				allowNull: false
			},
			active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: '1'
			}
		},
		{
			tableName: 'product_mrp',
			timestamps: false,
			underscored: true
		}
	);
};
