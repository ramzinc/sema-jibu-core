const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
// const R = require(`${__basedir}/models`).receipt;
// const CustomerAccount = require(`${__basedir}/models`).customer_account;
// const ReceiptLineItem = require(`${__basedir}/models`).receipt_line_item;
// const Product = require(`${__basedir}/models`).product;
// const Kiosk = require(`${__basedir}/models`).kiosk;
// const CustomerType = require(`${__basedir}/models`).customer_type;
// const SalesChannel = require(`${__basedir}/models`).sales_channel;
// const ProductCategory = require(`${__basedir}/models`).product_category;


const getAllKioskSalesSql = `
SELECT 
    kiosk.name AS 'Kiosk',
    DATE_FORMAT(receipt.created_at, '%Y-%m-%d') AS Date,
    customer_account.name AS 'Customer Name',
    sales_channel.name AS 'Sales Channel',
    product_category.description AS 'Product Category',
    product.sku AS 'Product SKU',
    product.description AS 'Product Description',
    receipt_line_item.quantity 'Number of Transactions',
    CASE
        WHEN LOWER(product.unit_measure) = 'liters' THEN receipt_line_item.quantity * product.unit_per_product
        ELSE 0
    END as 'Total Liters',
    receipt_line_item.price_total / receipt_line_item.quantity AS 'Unit Price',
    receipt_line_item.price_total AS 'Total Revenue'
FROM
    receipt
        INNER JOIN
    kiosk ON kiosk.id = receipt.kiosk_id
        INNER JOIN
    customer_account ON customer_account.id = receipt.customer_account_id
        INNER JOIN
    customer_type ON customer_account.customer_type_id = customer_type.id
        INNER JOIN
    sales_channel ON sales_channel.id = receipt.sales_channel_id
        INNER JOIN
    receipt_line_item ON receipt_line_item.receipt_id = receipt.id
        INNER JOIN
    product ON receipt_line_item.product_id = product.id
        INNER JOIN
    product_category ON product.category_id = product_category.id
WHERE
    YEAR(receipt.created_at) >= ?
ORDER BY
    receipt.created_at ASC
`;

const getAllKioskWQSql = `
SELECT 
    kiosk.name AS 'Kiosk',
    DATE_FORMAT(reading.created_at, '%Y-%m-%d') AS Date,
    parameter.name as Parameter,
    sampling_site.name as 'Sampling Site',
    user.username as 'Recorder Username',
    reading.value as Value
FROM
    reading
        INNER JOIN
    kiosk ON kiosk.id = reading.kiosk_id
        INNER JOIN
    parameter ON parameter.id = reading.parameter_id
        INNER JOIN
    sampling_site ON sampling_site.id = reading.sampling_site_id
        INNER JOIN
    user ON user.id = reading.user_id
WHERE
    YEAR(reading.created_at) >= ?
ORDER BY
    reading.created_at DESC
`;

const promisePool = __pool.promise();

router.get('/', async (req, res) => {
    const { dataset } = req.query;
    let err,
        results,
        metadata;

    if (dataset === 'sales') {
        [err, [results, metadata]] = await __hp(promisePool.query(getAllKioskSalesSql,
            [new Date(Date.now()).getFullYear()]
        ));
    } else {
        [err, [results, metadata]] = await __hp(promisePool.query(getAllKioskWQSql,
            [new Date(Date.now()).getFullYear()]
        ));
    }

    // On error, return a generic error message and log the error
	if (err) {
		semaLog.warn(`sema_data_export - Fetch - Error: ${JSON.stringify(err)}`);
		return res.status(500).json({ msg: "Internal Server Error" });
    }
    
    return res.json(results);
});

module.exports = router;

// TODO: Implement this using Sequelize
// Previous attempt below

// R.prototype.getCreatedAt = function() {
//     return String(this.created_at);
// };

// ReceiptLineItem.belongsTo(Product);
// R.belongsTo(CustomerAccount);
// R.hasMany(ReceiptLineItem);
// R.belongsTo(Kiosk);
// CustomerAccount.belongsTo(CustomerType);
// CustomerAccount.belongsTo(SalesChannel);
// Product.belongsTo(ProductCategory);

// const fields = [
    //     // 'kiosk.name',
    //     'created_at',
    //     'customer_account.name',
    //     'customer_account.phone_number',
    //     'customer_account.due_amount',
    //     'customer_account.gps_coordinates',
    //     // 'customer_account.sales_channel.name',
    //     // 'customer_account.customer_type.name',
    //     // 'receipt_line_items.product.product_category.name',
    //     // 'receipt_line_item.product.sku',
    //     // 'receipt_line_item.product.description',
    //     // 'receipt_line_item.quantity',
    //     // 'receipt_line_item.product.unit_per_product',
    //     // 'receipt_line_item.product.price_amount',
    //     // 'receipt_line_item.price_total',
    // ];
    
    // const [err, receipts] = await __hp(R.findAll({
    //     raw: true,
    //     // attributes: fields,
    //     where: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('receipt.created_at')), '>=', new Date(Date.now()).getFullYear()),
    //     include: [{
    //         model: CustomerAccount,
    //         // include: [{
    //         //     model: CustomerType,
    //         //     attributes: ['name']
    //         // }, {
    //         //     model: SalesChannel,
    //         //     attributes: ['name']
    //         // }]
    //     },
    //     // {
    //     //     model: Kiosk,
    //     //     attributes: ['name']
    //     // },
    //     {
    //         model: ReceiptLineItem,
    //         include: [{
    //             model: Product,
    //             // we don't need the product image
    //             attributes: { exclude: 'base64encoded_image'}
    //         }]
    //     }]
    // }));
