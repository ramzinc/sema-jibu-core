module.exports = function(sequelize, DataTypes) {
	const helper= sequelize.define('helper', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		imei: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		is_empty: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '1'
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'helper',
		timestamps: false,
		underscored: true
	});

	return helper;
};
