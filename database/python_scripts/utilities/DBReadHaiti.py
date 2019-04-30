#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 16:29:35 2018

@author: fredoleary
"""
import mysql.connector
import uuid
import logging


class DBReadHaiti:

    def __init__(self, connection ):
        self.connection = connection

    """ Get all countries  """
    def read_countries( self):
        countries = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, name FROM country")
        rows = cursor.fetchall()
        for row in rows:
            countries[row[0]] = row[1]
        cursor.close()
        return countries

    """ Get all regions  """
    def read_regions( self, countries):
        regions = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, name, country_id FROM region")
        rows = cursor.fetchall()
        for row in rows:
            regions[row[0]] = {"name":row[1], "country":countries[row[2]]}

        cursor.close()
        return regions


    """ Get all kiosks  """
    def read_kiosks(self, regions):
        kiosks = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, name, region_id FROM kiosk")
        rows = cursor.fetchall()
        for row in rows:
            kiosks[row[0]] = {"id": row[0], "name": row[1], "region": regions[row[2]]}
        cursor.close()
        return kiosks

    """ Get all customerTypes  """
    def read_customer_types( self):
        customer_types = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, name FROM customer_type")
        rows = cursor.fetchall()
        for row in rows:
            customer_types[row[0]] = row[1]
        cursor.close()
        return customer_types

    """ Get all sales_channels  """
    def read_sales_channels(self):
        sales_channels = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, name FROM sales_channel")
        rows = cursor.fetchall()
        for row in rows:
             sales_channels[row[0]] = {"id": row[0], "name": row[1]}

        cursor.close()
        return sales_channels

    """ Get all product categories  """
    def read_product_categories(self):
        product_categories = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, name, description FROM product_category")
        rows = cursor.fetchall()
        for row in rows:
            product_categories[row[0]] = {"name": row[1], "description": row[2]}
        cursor.close()
        return product_categories

    """ Get all products  """
    def read_products(self):
        products = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, active, base64encoded_image, category_id, description, gallons, maximum_quantity, "
                       "minimum_quantity, price_amount, price_currency, sku FROM product")
        rows = cursor.fetchall()
        for row in rows:
            products[row[0]] = {"id":row[0], "active":row[1], "base64encoded_image": row[2], "category_id":row[3],
                                "description": row[4], "gallons":row[5], "maximum_quantity":row[6],
                                "minimum_quantity":row[7], "price_amount":row[8], "price_currency":row[9],
                                 "sku":row[10]}

        cursor.close()
        return products

    """ Get all customers  """
    def read_customers(self):
        customers = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, address, contact_name, customer_type_id, due_amount, gps_coordinates, kiosk_id," 
                       "phone_number, active, serviceable_customer_base FROM customer_account")
        rows = cursor.fetchall()
        for row in rows:
            customers[row[0]] = {"id":row[0], "address": row[1], "contact_name": row[2], "customer_type_id":row[3],
                                 "due_amount":row[4], "gps_coordinates":row[5], "kiosk_id":row[6], "phone_number":row[7],
                                 "active":row[8], "servicable_customer_base":row[9]}

        cursor.close()
        return customers

    def read_receipts(self, after):
        receipts = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, created_date, currency_code, customer_account_id, customer_amount, kiosk_id," 
                       "payment_mode, payment_type, sales_channel_id, total, total_gallons FROM receipt WHERE created_date > %s", (after,))
        rows = cursor.fetchall()
        for row in rows:
            receipts[row[0]] = {"id":row[0], "created_date":row[1], "currency_code": row[2], "customer_account_id": row[3], "customer_amount":row[4],
                                 "kiosk_id":row[5], "payment_mode":row[6], "payment_type":row[7], "sales_channel_id":row[8],
                                 "total":row[9], "total_gallons":row[10]}

        cursor.close()
        return receipts

    def read_receipt_line_items(self):
        receipt_line_items = {}
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, currency_code, gallons, price, quantity, receipt_id, sku, type FROM receipt_line_item" )
        rows = cursor.fetchall()
        for row in rows:
            receipt_line_items[row[0]] = {"id":row[0], "currency_code":row[1], "gallons":row[2], "price": row[3], "quantity": row[4], "receipt_id":row[5],
                                 "sku":row[6], "type":row[7]}

        cursor.close()
        return receipt_line_items

    ## Get specific customer
    def read_customer(self, id):
        cursor = self.connection.cursor()
        cursor.execute("SELECT id, address, contact_name, customer_type_id, due_amount, gps_coordinates, kiosk_id," 
                       "phone_number, active, serviceable_customer_base FROM customer_account WHERE id = %s", (id,))
        rows = cursor.fetchall()
        row = rows[0]
        customer  = {"id":row[0], "address": row[1], "contact_name": row[2], "customer_type_id":row[3],
                             "due_amount":row[4], "gps_coordinates":row[5], "kiosk_id":row[6], "phone_number":row[7],
                             "active":row[8], "servicable_customer_base":row[9]}

        cursor.close()
        return customer

    def getSamplingSiteId(self, name ):
        cursor = self.connection.cursor()
        cursor.execute("SELECT id FROM sampling_site WHERE name = %s", (name,))
        rows = cursor.fetchall()
        id = rows[0][0]
        cursor.close()
        return id

    def getParameterId(self, name ):
        cursor = self.connection.cursor()
        cursor.execute("SELECT id FROM parameter WHERE name = %s", (name,))
        rows = cursor.fetchall()
        id = rows[0][0]
        cursor.close()
        return id

    def read_readings(self, startDate, kioskId, samplingSiteId, parameterId):
        """ Access records for a parameter from a sampling site after date """
        cursor = self.connection.cursor()
        cursor.execute("SELECT reading.created_date, measurement.value FROM reading "
            "INNER JOIN measurement ON reading.id = measurement.reading_id "
            "WHERE  measurement.parameter_id = %s AND reading.sampling_site_id = %s "
            "AND reading.kiosk_id = %s AND reading.created_date > %s", (parameterId, samplingSiteId, kioskId, startDate))
        rows = cursor.fetchall()
        cursor.close()
        return rows
