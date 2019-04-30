#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 16:29:35 2018

@author: fredoleary
"""
import mysql.connector
import uuid
import logging


class DBPopulate:

    def __init__(self, connection ):
        self.connection = connection

    """ Add a country  """
    def populate_country( self, country):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM country WHERE name = %s", (country,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:
                cursor.execute("INSERT INTO country ( name) VALUES(%s)", ( country,))
                self.connection.commit()
                print(country, 'added')
            except mysql.connector.Error as err:
                print('failed to add', country, err)
        else:
            print('Country', country, 'exists')
        cursor.close()

    """ Add a customer type  """
    def populate_customer_type( self, name):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM customer_type WHERE name = %s", (name,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:
                cursor.execute("INSERT INTO customer_type (name) VALUES(%s)", (name,))
                self.connection.commit()
                print('Customer type', name, 'added')
            except mysql.connector.Error as err:
                print('failed to add Customer Type', name, err)
        else:
            print('Customer type', name, 'exists')
        cursor.close()

    """ Add a region  """
    def populate_region(self, country, region, description):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM region WHERE name = %s", (region,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:
                cursor.execute("SELECT * FROM country WHERE name = %s", (country,))
                rows = cursor.fetchall()
                cursor.execute("INSERT INTO region (country_id, name, description) VALUES(%s, %s, %s)", (rows[0][0], region, description) )
                self.connection.commit()
                print(region, 'added')
            except mysql.connector.Error as err:
                print('failed to add region', region, err)
        else:
            print('Region', region, 'exists')
        cursor.close()

    """ Add a kiosk  """
    def populate_kiosk(self, region_name, kiosk_name ):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM kiosk WHERE name = %s", (kiosk_name,))
        rows = cursor.fetchall()
        newId = None
        if len(rows) == 0:
            try:
                cursor.execute("SELECT * FROM region WHERE name = %s", (region_name,))
                rows = cursor.fetchall()
                cursor.execute("INSERT INTO kiosk (region_id, name ) VALUES(%s, %s )", (rows[0][0], kiosk_name))
                self.connection.commit()
                newId = cursor.lastrowid
                print(kiosk_name, 'added')
            except mysql.connector.Error as err:
                print('failed to add kiosk', kiosk_name, err)
        else:
            newId = rows[0][0]
            print('Kiosk', kiosk_name, 'exists')
        cursor.close()
        return newId

    """ Add a customer. Note: This assumes contact_name are unique """

    def populate_customer(self, kiosk_name, customer_type, sales_channel, customer_name, created_date, updated_date, phone):
        guid = str(uuid.uuid1())

        self.populate_customer_uuid( kiosk_name, customer_type, sales_channel, customer_name, created_date, updated_date,
                                     phone, "test_address", guid)

    def populate_customer_uuid(self, kiosk_name, customer_type, sales_channel, customer_name, created_date, updated_date,
                               phone, address, guid):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM customer_account WHERE name = %s", (customer_name,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:

                cursor.execute("SELECT * FROM kiosk WHERE name = %s", (kiosk_name,))
                kiosk_rows = cursor.fetchall()

                cursor.execute("SELECT * FROM customer_type WHERE name = %s", (customer_type,))
                ct_rows = cursor.fetchall()

                cursor.execute("SELECT * FROM sales_channel WHERE name = %s", (sales_channel,))
                sales_channel_rows = cursor.fetchall()

                cursor.execute("INSERT INTO customer_account "
                               "(created_at, updated_at, name, customer_type_id, sales_channel_id, "
                               "kiosk_id, address_line1, gps_coordinates, phone_number, id) "
                               "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                               (created_date, updated_date, customer_name, ct_rows[0][0], sales_channel_rows[0][0],
                                kiosk_rows[0][0], address, "gps", phone, guid))
                self.connection.commit()
                print("Customer", customer_name, 'added')
            except mysql.connector.Error as err:
                print('failed to add Customer', customer_name, err)
        else:
            print('Contact_name', customer_name, 'exists')
        cursor.close()

    """ Add a customer for safe water networ"""
    def populate_customer_swn(self, kiosk_name, customer_type, sales_channel, customer_name, created_date, updated_date,
                               phone, income, gender, distance):
        cursor = self.connection.cursor()
        guid = str(uuid.uuid1())
        cursor.execute("SELECT * FROM kiosk WHERE name = %s", (kiosk_name,))
        kiosk_rows = cursor.fetchall()
        kioskId = kiosk_rows[0][0]

        cursor.execute("SELECT * FROM customer_account WHERE name = %s AND kiosk_id = %s", (customer_name, kioskId,))
        rows = cursor.fetchall()
        newId = None
        if len(rows) == 0:
            try:


                cursor.execute("SELECT * FROM customer_type WHERE name = %s", (customer_type,))
                ct_rows = cursor.fetchall()

                cursor.execute("SELECT * FROM sales_channel WHERE name = %s", (sales_channel,))
                sales_channel_rows = cursor.fetchall()

                cursor.execute("INSERT INTO customer_account "
                               "(created_at, updated_at, name, customer_type_id, sales_channel_id, "
                               "kiosk_id, address_line1, gps_coordinates, phone_number, id, income_level, gender, distance) "
                               "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                               (created_date, updated_date, customer_name, ct_rows[0][0], sales_channel_rows[0][0],
                                kiosk_rows[0][0], "test_address", "gps", phone, guid, income, gender, distance))
                self.connection.commit()
                newId = cursor.lastrowid
                print("Customer", customer_name, 'added')
            except mysql.connector.Error as err:
                print('failed to add Customer', customer_name, err)
        else:
            newId = rows[0][0]
            print('Contact_name', customer_name, 'exists')
        cursor.close()
        return newId

    """ Add a product category  """
    def populate_product_category( self, description, name):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM product_category WHERE name = %s", (name,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:
                cursor.execute("INSERT INTO product_category (name, description) VALUES( %s, %s)", (name, description))
                self.connection.commit()
                print('product category', name, 'added')
            except mysql.connector.Error as err:
                print('failed to add', name, err)
        else:
            print('product category', name, 'exists')
        cursor.close()

    """ Add a product. Note: This assumes product skus are unique """
    def populate_product(self, name, encoded_image, category, description,  price, currency, unit_per_product,
                         unit_measure, cogs, sku, updatedDate, active ):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM product WHERE sku = %s", (sku,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:


                cursor.execute("SELECT * FROM product_category WHERE name = %s", (category,))
                cat_id_rows = cursor.fetchall()

                cursor.execute("INSERT INTO product "
                               "(name, sku, description, category_id, price_amount, price_currency, "
                               "unit_per_product, unit_measure, cogs_amount, base64encoded_image, updated_at, active ) "
                               "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                               ( name, sku, description, cat_id_rows[0][0], price, currency,
                                 unit_per_product, unit_measure, cogs, encoded_image, updatedDate, active ))
                self.connection.commit()
                print("Product", description, 'added')
            except mysql.connector.Error as err:
                print('failed to add product', description, err)
        else:
            print('Product "',description,'" exists')
        cursor.close()

    """ Add a product.Contains all fields used by the new db schema """

    def populate_product_swn(self, active, name, sku, description, category, price_amount, price_currency,
                                    minimum_quantity, maximum_quantity, unit_per_product, unit_measure,
                                    cogs_amount, base64encoded_image):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM product WHERE sku = %s", (sku,))
        rows = cursor.fetchall()
        newId = None
        if len(rows) == 0:
            try:


                cursor.execute("SELECT * FROM product_category WHERE name = %s", (category,))
                cat_id_rows = cursor.fetchall()

                cursor.execute("INSERT INTO product "
                               "(active, name, sku, description, category_id, price_amount, price_currency, "
                               "minimum_quantity, maximum_quantity, unit_per_product, unit_measure,"
                               "cogs_amount, base64encoded_image ) "
                               "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                               ( active, name, sku, description, cat_id_rows[0][0], price_amount, price_currency,
                                 minimum_quantity, maximum_quantity, unit_per_product, unit_measure,
                                 cogs_amount, base64encoded_image))
                self.connection.commit()
                newId = cursor.lastrowid
                print("Product", description, 'added')
            except mysql.connector.Error as err:
                print('failed to add product', description, err)
        else:
            print('Product "',description,'" exists')
            newId = rows[0][0]
        cursor.close()
        return newId

    """ Add a sales channel  """
    def populate_sales_channel( self, delayed_delivery, name):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM sales_channel WHERE name = %s", (name,))
        rows = cursor.fetchall()
        newId = None
        if len(rows) == 0:
            try:
                cursor.execute("INSERT INTO sales_channel ( name ) VALUES( %s)", (name,))
                self.connection.commit()
                newId = cursor.lastrowid
                print('sales channel', name, 'added')
            except mysql.connector.Error as err:
                print('failed to add', name, err)
        else:
            print('sales channel "', name, '" exists')
            newId = rows[0][0]
        cursor.close()
        return newId

    """ Add a receipt. Note: This assumes recipts have unique date and time """
    def populate_receipt(self, created_date, currency, customer_ref,customer_amount, is_sponsor_selected,
                         kiosk_ref, payment_mode, payment_type, sales_channel_ref, total, total_gallons):

        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM receipt WHERE created_date = %s", (created_date,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:

                cursor.execute("SELECT * FROM kiosk WHERE name = %s", (kiosk_ref,))
                found_rows = cursor.fetchall()
                kiosk_id = found_rows[0][0]

                cursor.execute("SELECT * FROM customer_account WHERE contact_name = %s", (customer_ref,))
                found_rows = cursor.fetchall()
                customer_id = found_rows[0][0]

                cursor.execute("SELECT * FROM sales_channel WHERE name = %s", (sales_channel_ref,))
                found_rows = cursor.fetchall()
                sales_channel_id = found_rows[0][0]
                try:
                    cursor.execute("INSERT INTO receipt "
                                   "( version, is_sponsor_selected, created_date, currency_code, "
                                   "customer_account_id, customer_amount, payment_mode, kiosk_id, "
                                   "payment_type, sales_channel_id, total, total_gallons )"
                                 
                                   " VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                                   (1, is_sponsor_selected, created_date, currency, customer_id,
                                    customer_amount, payment_mode, kiosk_id, payment_type,
                                    sales_channel_id, total, total_gallons))
                except Exception as e:
                    print( e.message)

                self.connection.commit()
                print("Receipt", created_date, 'added')
            except mysql.connector.Error as err:
                print('failed to add receipt for', created_date, err)
        else:
            print('Receipt for "',created_date,'" exists')
        cursor.close()

    """ Add a receipt to the receipt based on sema_core schema. Note: This assumes receipts have unique date and time """

    def populate_receipt_sema_core(self, id, createUpdateDate, currencyCode, customer_ref,
                         kiosk_ref, paymentType, total, cogs, amountCash, amountCard, amountMobile):

        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM receipt WHERE id = %s", (id,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:

                cursor.execute("SELECT * FROM kiosk WHERE name = %s", (kiosk_ref,))
                found_rows = cursor.fetchall()
                kiosk_id = found_rows[0][0]

                cursor.execute("SELECT * FROM customer_account WHERE name = %s AND kiosk_id = %s", (customer_ref, kiosk_id))
                found_rows = cursor.fetchall()
                customer_id = found_rows[0][0]
                sales_channel_id = found_rows[0][6]
                customer_type_id = found_rows[0][5]
                guid = str(uuid.uuid1())
                try:
                    cursor.execute("INSERT INTO receipt "
                                   "( id, created_at, updated_at, currency_code, "
                                   "customer_account_id, kiosk_id, payment_type, "
                                   "sales_channel_id, customer_type_id, total, cogs, uuid,"
                                   "amount_cash, amount_card, amount_mobile )"

                                   " VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                                   (id, createUpdateDate, createUpdateDate, currencyCode,
                                    customer_id, kiosk_id, paymentType,
                                    sales_channel_id, customer_type_id, total, cogs, guid,
                                    amountCash, amountCard, amountMobile))
                except Exception as e:
                    print(e.message)

                self.connection.commit()
                print("Receipt", id, 'added')
            except mysql.connector.Error as err:
                print('failed to add receipt for', id, err)
        else:
            print('Receipt for "', id, '" exists')
        cursor.close()


    """ Add a receipt to the receipt based on sema_core schema using Ids """

    def populate_receipt_sema_core_2(self, id, createdAt, updatedAt, currencyCode, customerAccountId,
                                     kioskId, paymentType, salesChannelId, amountCash, amountMobile, amountLoan,
                                     amountCard, total, cogs):

        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM receipt WHERE id = %s", (id,))
        rows = cursor.fetchall()
        newId = None
        if len(rows) == 0:
            try:


                cursor.execute("SELECT customer_type_id FROM customer_account WHERE id = %s",(customerAccountId, ))
                found_rows = cursor.fetchall()
                customer_type_id = found_rows[0][0]
                guid = str(uuid.uuid1())
                try:
                    cursor.execute("INSERT INTO receipt "
                                   "( id, created_at, updated_at, currency_code, customer_account_id, "
                                   "amount_cash, amount_mobile, amount_loan, amount_card,"
                                   "kiosk_id, payment_type, sales_channel_id, customer_type_id, total, cogs, uuid )"

                                   " VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                                   (id, createdAt, updatedAt, currencyCode, customerAccountId,
                                    amountCash, amountMobile, amountLoan, amountCard,
                                    kioskId, paymentType, salesChannelId, customer_type_id, total, cogs, guid ))

                except Exception as e:
                    print(e.message)

                self.connection.commit()
                newId = cursor.lastrowid
                print("Receipt", id, 'added')
            except mysql.connector.Error as err:
                print('failed to add receipt for', id, err)
        else:
            newId = rows[0][0]
            print('Receipt for "', id, '" exists')
        cursor.close()
        return newId

    """ Add a receipt line item to a receipt """

    def populate_receipt_line_item(self, receipt_id, product_ref, quantity):

        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM receipt_line_item WHERE receipt_id = %s", (receipt_id,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:

                cursor.execute("SELECT * FROM receipt WHERE id = %s", (receipt_id,))
                found_rows = cursor.fetchall()
                created_at = found_rows[0][1]
                updated_at = found_rows[0][2]
                currency_code = found_rows[0][3]

                cursor.execute("SELECT * FROM product WHERE name = %s", (product_ref,))
                found_rows = cursor.fetchall()
                product_id = found_rows[0][0]
                price_amount = found_rows[0][8]
                priceTotal = price_amount * quantity

                cogs_amount = found_rows[0][14]
                cogsTotal = cogs_amount * quantity


                try:
                    cursor.execute("INSERT INTO receipt_line_item "
                                   "( created_at, updated_at, currency_code, "
                                   "price_total, quantity, receipt_id, "
                                   "product_id, cogs_total )"

                                   " VALUES(%s, %s, %s, %s, %s, %s, %s, %s)",
                                   (created_at, updated_at, currency_code,
                                    priceTotal, quantity, receipt_id,
                                    product_id, cogsTotal ))
                except Exception as e:
                    print(e.message)

                self.connection.commit()
                print("Receipt_line_item", receipt_id, 'added')
            except mysql.connector.Error as err:
                print('failed to add Receipt_line_item for', receipt_id, err)
        else:
            print('Receipt_line_item for "', receipt_id, '" exists')
        cursor.close()


    def populate_receipt_line_item_sema_core(self, receiptLineItem):

        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM receipt_line_item WHERE receipt_id = %s AND product_id = %s", (receiptLineItem["receiptId"], receiptLineItem["productId"]))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:

                cursor.execute("INSERT INTO receipt_line_item "
                               "( created_at, updated_at, currency_code, "
                               "price_total, quantity, receipt_id, "
                               "product_id, cogs_total )"

                               " VALUES(%s, %s, %s, %s, %s, %s, %s, %s)",
                               (receiptLineItem["createdAt"], receiptLineItem["updatedAt"], receiptLineItem["currencyCode"],
                                receiptLineItem["priceTotal"], receiptLineItem["quantity"], receiptLineItem["receiptId"],
                                receiptLineItem["productId"], receiptLineItem["cogsTotal"] ))

                self.connection.commit()
                print("Receipt_line_item", receiptLineItem["receiptId"], 'added')
            except mysql.connector.Error as err:
                print('failed to add Receipt_line_item for', receiptLineItem["receiptId"], err)
        else:
            print('Receipt_line_item for "', receiptLineItem["receiptId"], '" exists')
        cursor.close()

    """ Add a parameter """
    def populate_parameter( self, name):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM parameter WHERE name = %s", (name,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:
                cursor.execute("INSERT INTO parameter (version, name, active, is_ok_not_ok, is_used_in_totalizer, manual)"
                               " VALUES(%s, %s, %s, %s, %s, %s)", (1, name, 0x1, 0x0, 0x0, 0x0 ))
                self.connection.commit()
                print('parameter "', name, '" added')
            except mysql.connector.Error as err:
                print('failed to add', name, err)
        else:
            print('parameter "', name, '" exists')
        cursor.close()

    """ Add a sampling site """
    def populate_sampling_site( self, name):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM sampling_site WHERE name = %s", (name,))
        rows = cursor.fetchall()
        if len(rows) == 0:
            try:
                cursor.execute(
                    "INSERT INTO sampling_site (version, is_used_for_totalizer, name)"
                    " VALUES(%s, %s, %s)", (1, 0x0, name))
                self.connection.commit()
                print('sampling_site "', name, '" added')
            except mysql.connector.Error as err:
                print('failed to add', name, err)
        else:
            print('sampling_site "', name, '" exists')
        cursor.close()

    """ Add a reading and measurement with sampling site"""
    def populate_reading_and_measurement( self, kiosk_ref, created_date, sampling_site_ref, parameter_ref, value):
        cursor = self.connection.cursor()
        try:
            cursor.execute("SELECT id FROM kiosk WHERE name = %s", (kiosk_ref,))
            found_rows = cursor.fetchall()
            kiosk_id = found_rows[0][0]

            cursor.execute("SELECT id FROM sampling_site WHERE name = %s", (sampling_site_ref,))
            found_rows = cursor.fetchall()
            sampling_site_id = found_rows[0][0]

            cursor.execute("SELECT id FROM parameter WHERE name = %s", (parameter_ref,))
            found_rows = cursor.fetchall()
            parameter_id = found_rows[0][0]

            cursor.execute("SELECT * FROM reading WHERE kiosk_id = %s AND "
                           "created_date= %s AND sampling_site_id = %s" ,
                           (kiosk_id, created_date, sampling_site_id))
            found_rows = cursor.fetchall()
            if len(found_rows) == 0:
                cursor.execute("INSERT INTO reading (version, created_date, kiosk_id, sampling_site_id) "
                               "VALUES(%s, %s, %s, %s )", (1, created_date, kiosk_id, sampling_site_id))
                self.connection.commit()
                print('Added reading for date', created_date, '. Kiosk', kiosk_ref, '. Sampling site:', sampling_site_ref)

                cursor.execute("SELECT id FROM reading WHERE kiosk_id = %s AND "
                               "created_date= %s AND sampling_site_id = %s" ,
                               (kiosk_id, created_date, sampling_site_id))
                found_rows = cursor.fetchall()
                reading_id = found_rows[0][0]

                cursor.execute("INSERT INTO measurement (version, parameter_id, reading_id, value) "
                               "VALUES(%s, %s, %s, %s )", (1, parameter_id, reading_id, value))
                self.connection.commit()
                print('Added measurement for parameter', parameter_ref )



            else:
                print('Reading for date', created_date,'. Kiosk', kiosk_ref, '. Sampling site:', sampling_site_ref, 'exists')


        except mysql.connector.Error as err:
            print('failed to add reading/measurement for ', created_date, err)
        cursor.close()

    """ Add a reading and measurement no sampling site"""
    def populate_reading_and_measurement_no_sampling_site( self, kiosk_ref, created_date, parameter_ref, value):
        cursor = self.connection.cursor()
        try:
            cursor.execute("SELECT id FROM kiosk WHERE name = %s", (kiosk_ref,))
            found_rows = cursor.fetchall()
            kiosk_id = found_rows[0][0]

            cursor.execute("SELECT id FROM parameter WHERE name = %s", (parameter_ref,))
            found_rows = cursor.fetchall()
            parameter_id = found_rows[0][0]

            cursor.execute("SELECT * FROM reading WHERE kiosk_id = %s AND "
                           "created_date= %s ", (kiosk_id, created_date ))
            found_rows = cursor.fetchall()
            if len(found_rows) == 0:
                cursor.execute("INSERT INTO reading (version, created_date, kiosk_id) "
                               "VALUES(%s, %s, %s)", (1, created_date, kiosk_id))
                self.connection.commit()
                print('Added reading for date', created_date, '. Kiosk', kiosk_ref)

                cursor.execute("SELECT id FROM reading WHERE kiosk_id = %s AND "
                               "created_date= %s " ,
                               (kiosk_id, created_date))
                found_rows = cursor.fetchall()
                reading_id = found_rows[0][0]

                cursor.execute("INSERT INTO measurement (version, parameter_id, reading_id, value) "
                               "VALUES(%s, %s, %s, %s )", (1, parameter_id, reading_id, value))
                self.connection.commit()
                print('Added measurement for parameter', parameter_ref )



            else:
                print('Reading for date', created_date,'. Kiosk', kiosk_ref, '. Sampling site:', 'exists')


        except mysql.connector.Error as err:
            print('failed to add reading/measurement for ', created_date, err)
        cursor.close()

    """ Add a row to the product_mrp table"""
    def populate_product_mrp( self, updatedDate, kiosk_name, sku_name, sales_channel_name, mrpPrice, currencyCode, cogs):
        cursor = self.connection.cursor()

        cursor.execute("SELECT * FROM kiosk WHERE name = %s", (kiosk_name,))
        kiosk_rows = cursor.fetchall()

        cursor.execute("SELECT * FROM sales_channel WHERE name = %s", (sales_channel_name,))
        sales_channel_rows = cursor.fetchall()

        cursor.execute("SELECT * FROM product WHERE sku = %s", (sku_name,))
        product_rows = cursor.fetchall()

        cursor.execute("SELECT * FROM product_mrp WHERE kiosk_id = %s AND "
                       "product_id = %s AND sales_channel_id = %s" ,
                       (kiosk_rows[0][0], product_rows[0][0], sales_channel_rows[0][0] ))
        product_mrp_rows = cursor.fetchall()

        if len(product_mrp_rows) == 0:
            try:
                cursor.execute("INSERT INTO product_mrp "
                               "(created_at, updated_at, kiosk_id, product_id, sales_channel_id,"
                               "price_amount, price_currency, cogs_amount ) "
                               "VALUES(%s, %s, %s, %s, %s, %s, %s, %s )",
                               ( updatedDate, updatedDate, kiosk_rows[0][0], product_rows[0][0], sales_channel_rows[0][0],
                                 mrpPrice, currencyCode, cogs ))
                self.connection.commit()
                print('Product_mrp for ',sku_name, '/', sales_channel_name, ' added')
            except mysql.connector.Error as err:
                print('failed to add product_mrp ', sku_name, err)
        else:
            print('Product_mrp for ',sku_name, '/', sales_channel_name, ' exists')
        cursor.close()

    def update_customer(self, id, gps_coordinates):
        cursor = self.connection.cursor()

        # sql = "UPDATE customer_account SET gps_coordinates = %s WHERE id = %s",(gps_coordinates, id )

        cursor.execute("UPDATE customer_account SET gps_coordinates = %s WHERE id = %s", (gps_coordinates, id ))

        self.connection.commit()
        cursor.close()

    def getSamplingSiteId(self, name):
        cursor = self.connection.cursor()
        cursor.execute("SELECT id FROM sampling_site WHERE name = %s", (name,))
        rows = cursor.fetchall()
        id = rows[0][0]
        cursor.close()
        return id

    def getParameterId(self, name):
        cursor = self.connection.cursor()
        cursor.execute("SELECT id FROM parameter WHERE name = %s", (name,))
        rows = cursor.fetchall()
        id = rows[0][0]
        cursor.close()
        return id

    def insertReading(self, reading, kiosk_id, samplingSiteId, parameterId, user_id):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO reading "
                       "(created_at, kiosk_id, parameter_id, sampling_site_id, value, user_id) "
                       "VALUES(%s, %s, %s, %s, %s, %s)",
                       (reading[0], kiosk_id, parameterId, samplingSiteId, reading[1], user_id))

        self.connection.commit()
        newId = cursor.lastrowid
        cursor.close()
        return newId

    def updateFlowRate( self, paramId, samplingSiteId, newParamId ):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM reading WHERE parameter_id = %s", (paramId,))
        rows = cursor.fetchall()
        cursor.close()
        for row in rows:
            cursor = self.connection.cursor()
            cursor.execute("UPDATE reading SET sampling_site_id = %s, parameter_id = %s where id = %s", (samplingSiteId, newParamId, row[0] ))
            self.connection.commit()
            cursor.close()
