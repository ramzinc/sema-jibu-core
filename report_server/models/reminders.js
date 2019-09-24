module.exports= function(sequelize, DataTypes){

    return sequelize.define(
	'reminders',{
	    id :{
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false

	    },
	    frequency : {
		type: DataTypes.INTEGER,
		allowNull: false,
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
	    customer_id:{
		type: DataTypes.STRING(255),
		allowNull: false,
		references:{
		    model: 'customer_account',
		    key: 'id'
		}

	    },

	    receipt_id:{
		type: DataTypes.STRING(255),
		allowNull: false,
		receipt:{
		    model: 'receipt',
		    key: 'id'
		}

	    }

	},
	{
		tableName: 'reminders',
		timestamps: false,
		underscored: true
	}
	

    );


};
