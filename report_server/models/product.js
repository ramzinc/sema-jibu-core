/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('product', {
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
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		sku: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		category_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'product_category',
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
		minimum_quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		maximum_quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		unit_per_product: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		unit_measure: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		cogs_amount: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		base64encoded_image: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'product',
		timestamps: false,
		underscored: true
	});
};
