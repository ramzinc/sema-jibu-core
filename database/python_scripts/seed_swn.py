#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 17:20:33 2018

@author: fredoleary
"""
import pandas as pd
from platform import python_version
from utilities.DBConnection import DBConnection
from utilities.DBPopulate import DBPopulate
from utilities.Customer import Customer
from utilities.SalesChannel import SalesChannel
from utilities.CustomerType import CustomerType
from dbConfig import dbConfig
from utilities.Product import Product

import datetime
import random
import time
NUM_RECEIPTS =500
NUM_CUSTOMERS = 100

def strTimeProp(start, end, format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formated in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """
    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))
    ptime = stime + prop * (etime - stime)
    outtime =  time.strftime(format, time.localtime(ptime))
    outdate =  datetime.datetime.strptime(outtime, '%m/%d/%Y %I:%M %p')
    return outdate

def randomDate(start, end, prop):
    return strTimeProp(start, end, '%m/%d/%Y %I:%M %p', prop)

def getDate():
    return randomDate("1/1/2017 1:30 PM", "12/31/2018 4:50 AM", random.random())

def getCustomerType():
    index =  random.randint( 0, len(customerTypes )-1)
    return customerTypes[index].name

def getSalesChannel():
    index =  random.randint( 0, len(salesChannels )-1)
    return salesChannels[index].name

def getProduct():
    index =  random.randint( 0, len(products)-1)
    return products[index].name

def getIncome():
    return  random.randint( 1, 12)

def getGender():
    index =  random.randint( 0, 1)
    if index == 0:
        return 'M'
    else:
        return 'F'

def getDistance():
    return  random.randint( 1, 800)

if __name__ == "__main__":
    print('Python', python_version())
    salesChannels = [ SalesChannel(name='Household',),
                      SalesChannel(name='Main Station', ),
                      SalesChannel(name='Access Points', )
                      ]

    customerTypes = [ CustomerType(name='Zongo',),
                      CustomerType(name='AP1', ),
                      CustomerType(name='Church', ),
                      CustomerType(name='Mosque')
                      ]

    products = [  Product(name="1.5L bottle", base64encodedImage="1-5L-water.jpg", category="water_products",
                          description="1.5 Liter water bottle",priceAmount=2600, priceCurrency="GHS",
                          sku="sku1", cogs=1300, updatedDate = datetime.date(2018, 1, 1), quantityPerUnit = 1.5, active=1),
                  Product(name="5.0L bottle", base64encodedImage="5L-water.jpg", category="water_products",
                          description="5 Liter water bottle", priceAmount=4000, priceCurrency="GHS",
                          sku="sku2", cogs=2000, updatedDate=datetime.date(2018, 1, 1), quantityPerUnit = 5, active=1),
                  Product(name="18.9L jug", base64encodedImage="18-9L-water.jpg", category="water_products",
                          description="18.9 Liter water jug", priceAmount=20000, priceCurrency="GHS",
                          sku="sku3", cogs=10000, updatedDate=datetime.date(2018, 1, 1), quantityPerUnit = 18.9, active=1),
                  Product(name="20.0L jug", base64encodedImage="20L-water.jpg", category="water_products",
                          description="20 Liter water jug", priceAmount=25000, priceCurrency="GHS",
                          sku="sku4", cogs=13000, updatedDate=datetime.date(2018, 1, 1), quantityPerUnit = 20, active=1),
                  Product(name="2000L jug", base64encodedImage="20L-water.jpg", category="water_products",
                          description="2000L Liter water jug Inactive", priceAmount=25000, priceCurrency="GHS",
                          sku="sku5", cogs=13000, updatedDate=datetime.date(2018, 1, 1), quantityPerUnit = 20, active=0)]

    DBConfig = dbConfig()
    dbConnection = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,DBConfig.dbName)
    dbConnection.connect()
    connection = dbConnection.get_connection()
    if connection is not None:
        print("Connected")

        cursor = connection.cursor()
        cursor.execute("select database()")
        db_name = cursor.fetchone()[0]


        # Verify you are connected to a SEMA database
        if "swn" in db_name.lower():


            dbPopulate = DBPopulate(connection)


            dbPopulate.populate_country('Ghana')
            for customerType in  customerTypes:
                dbPopulate.populate_customer_type(customerType.name)

            for salesChannel in salesChannels:
                dbPopulate.populate_sales_channel(0x0, salesChannel.name)

            dbPopulate.populate_product_category("Description of product category", "product_category 1")
            dbPopulate.populate_region('Ghana', 'Accra', "Accra - Ghana")
            dbPopulate.populate_kiosk('Accra', "Lartebiokorshie")

            #create 20 customers
            customerNameBase = "swn_customer"
            for i in range(NUM_CUSTOMERS):
                customerName = customerNameBase +str(i)
                createUpdateDate = getDate()
                dbPopulate.populate_customer_swn('Lartebiokorshie', getCustomerType(), getSalesChannel(), customerName,
                                                 createUpdateDate, createUpdateDate, "5551212", getIncome(), getGender(),
                                                 getDistance())


            # add some products
            dbPopulate.populate_product_category("Water products for SWN", "water_products")

            for product in products:
                dbPopulate.populate_product(product.name, product.base64encodedImage,
                                            product.category, product.description, product.priceAmount,
                                            product.priceCurrency, product.quantityPerUnit, "liters",
                                            product.cogs, product.sku, product.updatedDate, product.active)

            #add some receipts
            for i in range(NUM_RECEIPTS):
                id = "receiptId" + str(i)
                createUpdateDate = getDate()

                currencyCode = "GHS"
                customerName = customerNameBase + str(random.randint(0,19)) # random customer
                amountCash = 1.2        # Don't care
                kiosk = 'Lartebiokorshie'
                paymentType ="N/A"
                total = 3.4              # Don't care
                cogs = 4.5               # Don't care

                dbPopulate.populate_receipt_sema_core( id, createUpdateDate, currencyCode, customerName, kiosk,
                                                        paymentType, total, cogs, amountCash, 0, 2.2 )

            # Add a receipt line item to each receipts
            for i in range(NUM_RECEIPTS):
                receipt_id = "receiptId" + str(i)
                product_ref = getProduct();
                quantity = random.randint(1,7);
                dbPopulate.populate_receipt_line_item(receipt_id, product_ref, quantity)

        else:
            print("You are not connected to a 'swn' database")
        dbConnection.close()
    else:
        print('failed to connect')

