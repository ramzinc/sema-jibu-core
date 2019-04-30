CREATE VIEW `receipt_details` AS
    SELECT 
        receipt_line_item.created_at,
        receipt_line_item.quantity,
        receipt_line_item.product_id,
        receipt_line_item.receipt_id,
        receipt.sales_channel_id,
        receipt.kiosk_id,
        receipt.amount_cash,
        receipt.amount_loan,
        receipt.amount_mobile,
        receipt.amount_card,
        receipt.customer_account_id,
		product.unit_per_product,
        receipt_line_item.quantity * product.unit_per_product AS volume,
        receipt.total,
        customer_account.name,
        customer_account.income_level,
        customer_account.customer_type_id
    FROM
        receipt_line_item
            INNER JOIN
        receipt ON receipt_line_item.receipt_id = receipt.id
            INNER JOIN
        product ON receipt_line_item.product_id = product.id
            INNER JOIN
        customer_account ON receipt.customer_account_id = customer_account.id;
