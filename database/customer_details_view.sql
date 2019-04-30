CREATE VIEW `customer_details` AS
    SELECT 
		customer_account.active,
        customer_account.created_at,
        customer_account.name as customer_name,
        customer_account.income_level,
        customer_account.gender,
        customer_account.distance,
        customer_account.consumer_base as customer_consumer_base,
        kiosk.name as kiosk_name,
        kiosk.id as kiosk_id,
		kiosk.consumer_base as kiosk_consumer_base
   FROM
        customer_account
            INNER JOIN
        kiosk ON customer_account.kiosk_id = kiosk.id
