#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thur Sep  20 17:20:33 2018

@author: fredoleary
"""
import pandas as pd

from platform import python_version
from utilities.DBConnection import DBConnection
from utilities.DBPopulate import DBPopulate
from utilities.DBReadHaiti import DBReadHaiti
from utilities.Customer import Customer
from utilities.SalesChannel import SalesChannel
from utilities.CustomerType import CustomerType
from dbConfig import dbConfig
from utilities.Product import Product
from swn_xls_record import swnXlsRecord

import datetime
import random
import time
import math
import decimal
import json
import pickle
import sys

from enum import Enum

USE_CACHE =True

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

def getSalesChannel( salesChannels):
    keys = list(salesChannels.keys())
    index =  random.randint( 0, len(keys )-1)
    return salesChannels[keys[index]]

def getDate():
    return randomDate("1/1/2017 1:30 PM", "12/31/2018 4:50 AM", random.random())

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


def importHaitDb( dbPopulate, dbReadHaiti):

    countries = dbReadHaiti.read_countries()
    # Countries
    for country in countries.values():
        dbPopulate.populate_country(country)

    # Regions
    regions = dbReadHaiti.read_regions( countries )
    for region in regions.values():
        dbPopulate.populate_region( region['country'], region['name'], "description")

    # Kiosks
    kioskMapOldIdToNewId = {}
    kiosks = dbReadHaiti.read_kiosks(regions)
    for kiosk in kiosks.values():
        newId = dbPopulate.populate_kiosk( kiosk['region'], kiosk['name'])
        kioskMapOldIdToNewId[kiosk['id']] = newId

    # Customer types
    customer_types = dbReadHaiti.read_customer_types()
    for customer_type in customer_types.values():
        dbPopulate.populate_customer_type( customer_type)

    # Sales channels
    salesChannelMapOldIdToNewId = {}
    sales_channels = dbReadHaiti.read_sales_channels()

    for sales_channel in sales_channels.values():
        newId = dbPopulate.populate_sales_channel( False,  sales_channel['name'])
        salesChannelMapOldIdToNewId[sales_channel['id']] = newId

    # Product categories
    product_categories = dbReadHaiti.read_product_categories()
    for product_category in product_categories.values():
        dbPopulate.populate_product_category( product_category['description'],  product_category['name'])

    # Products
    if USE_CACHE:
        with open('products-tmp.txt') as json_file:
            productMapOldIdToNewId = json.load(json_file)

    else:
        productMapOldIdToNewId = {}
        products = dbReadHaiti.read_products()
        for product in products.values():
            active = product['active']
            name = product['sku']
            sku = product['sku']
            description = product['description']
            category = product_categories[product['category_id']]['name']
            price_amount = product['price_amount']
            price_currency = product['price_currency']
            minimum_quantity = product['minimum_quantity']
            maximum_quantity = product['maximum_quantity']
            unit_per_product = product['gallons']
            unit_measure = 'gallons'
            cogs_amount = price_amount * decimal.Decimal(.5)
            base64encoded_image = product['base64encoded_image']

            newId = dbPopulate.populate_product_swn(active, name, sku, description,category, price_amount,price_currency,
                                            minimum_quantity, maximum_quantity, unit_per_product,unit_measure,
                                            cogs_amount, base64encoded_image)
            productMapOldIdToNewId[sku] = newId

        with open('products-tmp.txt', 'w') as outfile:
            json.dump(productMapOldIdToNewId, outfile)

    # Customers
    if USE_CACHE:
        with open('customers-tmp.txt') as json_file:
            customerMapOldIdToNewId = json.load(json_file)

    else:
        customerMapOldIdToNewId = {}
        customers = dbReadHaiti.read_customers()
        for customer in customers.values():
            newCustomer = {"id":customer['id'],"address":customer['address'], "name":customer['contact_name'],
                           "customerType":customer_types[customer['customer_type_id']], "amountDue": customer['due_amount'],
                           "gpsCoordinates":customer['gps_coordinates'], "kiosk":kiosks[customer['kiosk_id']]['name'],
                           "phoneNumber":customer['phone_number'], "active": customer['active'],
                           "servicableCustomerBase": customer['servicable_customer_base']}
            phoneNumber = newCustomer['phoneNumber']
            if phoneNumber == None:
                phoneNumber = "555-1212"
            salesChannel = getSalesChannel(sales_channels)
            createUpdateDate = getDate()

            print( json.dumps(newCustomer, indent=1))

            newId = dbPopulate.populate_customer_swn(newCustomer['kiosk'], newCustomer['customerType'], salesChannel, newCustomer['name'],
                                             createUpdateDate, createUpdateDate, phoneNumber, getIncome(), getGender(),
                                             getDistance())
            customerMapOldIdToNewId[customer['id']] = newId

        with open('customers-tmp.txt', 'w') as outfile:
            json.dump(customerMapOldIdToNewId, outfile)


    #receipts
    count = 0
    if USE_CACHE:
        with open('receipts-tmp.txt') as json_file:
            receiptMapOldIdToNewId = json.load(json_file)

    else:

        receiptMapOldIdToNewId = {}
        receipts = dbReadHaiti.read_receipts( "2017-6-1")  # After June, 2017
        for receipt in receipts.values():  #count is temp
            # if  count > 100:
            #     break
            count = count+1
            try:
                newReceipt ={}
                newReceipt["id"] = receipt['id']
                newReceipt["createdAt"] = receipt['created_date']
                newReceipt["updatedAt"] = receipt['created_date']
                newReceipt["currencyCode"] = receipt['currency_code']
                newReceipt["customerAccountId"] = customerMapOldIdToNewId[receipt['customer_account_id']]
                newReceipt["amountCash"] = receipt['total']
                newReceipt["amountMobile"] = 0
                newReceipt["amountLoan"] = 0
                newReceipt["amountCard"] = 0
                newReceipt["kioskId"] = kioskMapOldIdToNewId[receipt['kiosk_id']]
                newReceipt["paymentType"] = receipt['payment_type']
                newReceipt["salesChannelId"] = salesChannelMapOldIdToNewId[receipt['sales_channel_id']]
                newReceipt["total"] = receipt['total']
                newReceipt["cogs"]= receipt['total'] * decimal.Decimal(.5)
                newId = dbPopulate.populate_receipt_sema_core_2(newReceipt["id"], newReceipt["createdAt"], newReceipt["updatedAt"],
                                                                newReceipt["currencyCode"],newReceipt["customerAccountId"],
                                                                newReceipt["kioskId"],newReceipt["paymentType"],
                                                                newReceipt["salesChannelId"],
                                                                newReceipt["amountCash"], newReceipt["amountMobile"],
                                                                newReceipt["amountLoan"], newReceipt["amountCard"],
                                                                newReceipt["total"], newReceipt["cogs"] )

                createdAt = newReceipt["createdAt"].strftime('%m/%d/%Y %I:%M %p')
                receiptMapOldIdToNewId[newReceipt['id']] = {"id":newId, "createdAt":createdAt}
                print( "Count", count)
            except Exception as e:
                print(e.args[0], "error adding receipt", receipt['customer_account_id'] )

        with open('receipts-tmp.txt', 'w') as outfile:
            json.dump(receiptMapOldIdToNewId, outfile)

    #receipt_line_items
    receipt_line_items = dbReadHaiti.read_receipt_line_items()
    for receipt_line_item in receipt_line_items.values():
        try:
            receipt = str(receipt_line_item['receipt_id'] )
            if receipt in receiptMapOldIdToNewId:
                oldReceipt = receiptMapOldIdToNewId[receipt]
                newReceiptLineItem ={}
                createdAt = datetime.datetime.strptime( oldReceipt['createdAt'], '%m/%d/%Y %I:%M %p' )
                newReceiptLineItem["createdAt"] = createdAt
                newReceiptLineItem["updatedAt"] = createdAt
                newReceiptLineItem["currencyCode"] = receipt_line_item["currency_code"]
                newReceiptLineItem["priceTotal"] = receipt_line_item["price"]
                newReceiptLineItem["quantity"] = receipt_line_item["quantity"]
                newReceiptLineItem["receiptId"] = oldReceipt["id"]
                newReceiptLineItem["productId"] = productMapOldIdToNewId[receipt_line_item["sku"]]
                newReceiptLineItem["cogsTotal"] = receipt_line_item["price"] * decimal.Decimal(.5)
                dbPopulate.populate_receipt_line_item_sema_core(newReceiptLineItem )

        except Exception as e:
            print(e.args[0], "error adding receipt_line", receipt_line_item['receipt_id'] )

    print("foo")

## Update gps from haiti database. (Due to bug in original import where gps is not imported
## this requires that the old->new mapping file is valid...

def fix_gps(dbPopulate, dbReadHaiti):
    with open('customers-tmp.txt') as json_file:
        customerMapOldIdToNewId = json.load(json_file)
        for key, value in customerMapOldIdToNewId.items():
            haiti = dbReadHaiti.read_customer(key)
            print("Customer", haiti['contact_name'], haiti['gps_coordinates'])
            dbPopulate.update_customer(value, haiti['gps_coordinates'])
    print("Done")


def importReading( dbPopulate, dbReadHaiti, samplingSiteIdSrc, parameterIdSrc, samplingSiteIdDest, parameterIdDest):

    countries = dbReadHaiti.read_countries()
    regions = dbReadHaiti.read_regions( countries )

    kioskMapOldIdToNewId = {}
    kiosks = dbReadHaiti.read_kiosks(regions)
    for kiosk in kiosks.values():
        newId = dbPopulate.populate_kiosk( kiosk['region'], kiosk['name'])
        kioskMapOldIdToNewId[kiosk['id']] = newId

        readings = dbReadHaiti.read_readings( "2017-6-1", kiosk['id'], samplingSiteIdSrc, parameterIdSrc)
        for reading in readings:
            # Note that the user_id is hard coded here...
            dbPopulate.insertReading( reading, newId, samplingSiteIdDest, parameterIdDest, 1 )


def importHaitiDbTotalChlorine( dbPopulate, dbReadHaiti ):
    """ Import total chlorine"""
    waterTreatmentIdSrc = dbReadHaiti.getSamplingSiteId( "Water Treatment Unit" )
    waterTreatmentIdDest = dbPopulate.getSamplingSiteId( "Water Treatment Unit" )
    chlorineIdSrc = dbReadHaiti.getParameterId( "Total Chlorine" )
    chlorineIdDest = dbPopulate.getParameterId( "Total Chlorine" )
    importReading( dbPopulate, dbReadHaiti, waterTreatmentIdSrc, chlorineIdSrc, waterTreatmentIdDest, chlorineIdDest)

def importHaitiDbTds( dbPopulate, dbReadHaiti ):
    """ Import total disolved solids"""
    waterTreatmentIdSrc = dbReadHaiti.getSamplingSiteId( "Water Treatment Unit" )
    waterTreatmentIdDest = dbPopulate.getSamplingSiteId( "Water Treatment Unit" )
    tdsIdSrc = dbReadHaiti.getParameterId( "Total Dissolved Solids" )
    tdsIdDest = dbPopulate.getParameterId( "Total Dissolved Solids" )
    importReading( dbPopulate, dbReadHaiti, waterTreatmentIdSrc, tdsIdSrc, waterTreatmentIdDest, tdsIdDest)

def importHaitiDbPressureIn( dbPopulate, dbReadHaiti ):
    """ Import pre-membrane pressure"""
    waterTreatmentIdSrc = dbReadHaiti.getSamplingSiteId( "Water Treatment Unit" )
    waterTreatmentIdDest = dbPopulate.getSamplingSiteId( "Water Treatment Unit" )
    pressureIdSrc = dbReadHaiti.getParameterId( "PRE-FILTER PRESSURE IN" )
    pressureIdDest = dbPopulate.getParameterId( "PRE-FILTER PRESSURE IN" )
    importReading( dbPopulate, dbReadHaiti, waterTreatmentIdSrc, pressureIdSrc, waterTreatmentIdDest, pressureIdDest)

def importHaitiDbPressureOut( dbPopulate, dbReadHaiti ):
    """ Import post-membrane pressure"""
    waterTreatmentIdSrc = dbReadHaiti.getSamplingSiteId( "Water Treatment Unit" )
    waterTreatmentIdDest = dbPopulate.getSamplingSiteId( "Water Treatment Unit" )
    pressureIdSrc = dbReadHaiti.getParameterId( "PRE-FILTER PRESSURE OUT" )
    pressureIdDest = dbPopulate.getParameterId( "PRE-FILTER PRESSURE OUT" )
    importReading( dbPopulate, dbReadHaiti, waterTreatmentIdSrc, pressureIdSrc, waterTreatmentIdDest, pressureIdDest)

def importHaitiDbMembranePressure( dbPopulate, dbReadHaiti ):
    """ Import post-membrane pressure"""
    waterTreatmentIdSrc = dbReadHaiti.getSamplingSiteId( "Water Treatment Unit" )
    waterTreatmentIdDest = dbPopulate.getSamplingSiteId( "Water Treatment Unit" )
    pressureIdSrc = dbReadHaiti.getParameterId( "MEMBRANE FEED PRESSURE" )
    pressureIdDest = dbPopulate.getParameterId( "MEMBRANE FEED PRESSURE" )
    importReading( dbPopulate, dbReadHaiti, waterTreatmentIdSrc, pressureIdSrc, waterTreatmentIdDest, pressureIdDest)

def importHaitiDbFeedFlowRate( dbPopulate, dbReadHaiti ):
    """ Import feed flowrate"""
    waterTreatmentIdSrc = dbReadHaiti.getSamplingSiteId( "Water Treatment Unit" )
    waterTreatmentIdDest = dbPopulate.getSamplingSiteId( "Water Treatment Unit" )
    paramIdSrc = dbReadHaiti.getParameterId( "Feed Flow Rate" )
    paramIdDest = dbPopulate.getParameterId( "Feed Flow Rate" )
    importReading( dbPopulate, dbReadHaiti, waterTreatmentIdSrc, paramIdSrc, waterTreatmentIdDest, paramIdDest)

def importHaitiDbProductFlowRate( dbPopulate, dbReadHaiti ):
    """ Import product flowrate"""
    waterTreatmentIdSrc = dbReadHaiti.getSamplingSiteId( "Water Treatment Unit" )
    waterTreatmentIdDest = dbPopulate.getSamplingSiteId( "Water Treatment Unit" )
    paramIdSrc = dbReadHaiti.getParameterId( "Product Flow Rate" )
    paramIdDest = dbPopulate.getParameterId( "Product Flow Rate" )
    importReading( dbPopulate, dbReadHaiti, waterTreatmentIdSrc, paramIdSrc, waterTreatmentIdDest, paramIdDest)

def redoFeedFlowRate( dbPopulate, flowRate, samplingSite ):
    samplingSiteId = dbPopulate.getSamplingSiteId( samplingSite )
    paramId = dbPopulate.getParameterId(flowRate)
    newParamId = dbPopulate.getParameterId("Flow Rate")
    dbPopulate.updateFlowRate( paramId, samplingSiteId, newParamId );

def importXLSReading( dbPopulate, samplingSite, volumeId):
    xls = pd.ExcelFile("spreadsheets/sema-haiti-volumes.xls")
    sheet = xls.parse(0)    # Just one sheet
    col_date = 1                    # column for date
    col_sampling_site_id = 4        # column for the sampling site
    col_value = 5                   # column for the reading value
    for row in range( sheet.shape[0]):
        kiosk_id = 1    # Hard coded for now
        user_id = 1    # Hard coded for now

        date = sheet[sheet.columns[col_date]][row]
        sampling_site_id = sheet[sheet.columns[col_sampling_site_id]][row]
        value = sheet[sheet.columns[col_value]][row]
        if sampling_site_id == samplingSite:
            print("Date", date, "sampling_site_id", sampling_site_id, "value", value)
            reading = [date, decimal.Decimal(value)]
            dbPopulate.insertReading(reading, kiosk_id, samplingSite, volumeId, user_id)

    print("done")

def importXlsVolume( dbPopulate ):
    """ Import total volume data from the 'mock' Xls spreadsheet"""
    A_FeedIdDest = dbPopulate.getSamplingSiteId( "A:Feed" )
    volumeIdDest = dbPopulate.getParameterId( "Volume" )
    print("Importing A:Feed")
    importXLSReading( dbPopulate, A_FeedIdDest, volumeIdDest)

    B_Product = dbPopulate.getSamplingSiteId( "B:Product" )
    print("Importing B:Product")
    importXLSReading( dbPopulate, B_Product, volumeIdDest)

    D_Fill = dbPopulate.getSamplingSiteId( "D:Fill" )
    print("Importing D:Fill")
    importXLSReading( dbPopulate, D_Fill, volumeIdDest)


if __name__ == "__main__":
    print('Python', python_version())

    print( 'Number of arguments:', len(sys.argv), 'arguments.')

    DBConfig = dbConfig()
    dbConnection = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,DBConfig.dbName)
    dbConnection.connect()
    connection = dbConnection.get_connection()
    dbConnectionHaiti = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,"sema")
    dbConnectionHaiti.connect()
    connectionHaiti = dbConnectionHaiti.get_connection()
    if connection is not None and connectionHaiti is not None:
        print("Connected")

        cursor = connection.cursor()
        cursor.execute("select database()")
        db_name = cursor.fetchone()[0]


        # Verify you are connected to a sample database
        if "sample" in db_name.lower():
            dbPopulate = DBPopulate(connection)
            dbReadHaiti = DBReadHaiti(connectionHaiti )
            if len(sys.argv) == 1:
                importHaitDb( dbPopulate, dbReadHaiti)
            elif sys.argv[1] == "gps":
                    #fix gps
                    print("reimporting gps")
                    fix_gps(dbPopulate, dbReadHaiti)
            elif  len(sys.argv) == 3 and sys.argv[1] == "chart":
                if sys.argv[2] == "totalchlorine":
                    print( "importing chlorine data")
                    importHaitiDbTotalChlorine( dbPopulate, dbReadHaiti)
                elif sys.argv[2] == "tds":
                    print( "importing total disolved solids")
                    importHaitiDbTds( dbPopulate, dbReadHaiti)
                elif sys.argv[2] == "Volume":
                    print( "importing water volume")
                    importXlsVolume( dbPopulate)
                elif sys.argv[2] == "pin":
                    print( "importing prefilter pressure in")
                    importHaitiDbPressureIn( dbPopulate, dbReadHaiti)
                elif sys.argv[2] == "pout":
                    print( "importing prefilter pressure out")
                    importHaitiDbPressureOut( dbPopulate, dbReadHaiti)
                elif sys.argv[2] == "pmembrane":
                    print( "importing prefilter pressure out")
                    importHaitiDbMembranePressure( dbPopulate, dbReadHaiti)
                elif sys.argv[2] == "ffr":
                    print( "importing feed flow rate")
                    importHaitiDbFeedFlowRate( dbPopulate, dbReadHaiti)
                elif sys.argv[2] == "pfr":
                    print( "importing product flow rate")
                    importHaitiDbProductFlowRate( dbPopulate, dbReadHaiti)
                elif sys.argv[2] == "redoFFR":
                    print( "Fixup feed flow rate")
                    redoFeedFlowRate( dbPopulate, "Feed Flow Rate", "A:Feed")
                elif sys.argv[2] == "redoPFR":
                    print( "Fixup Product flow rate")
                    redoFeedFlowRate( dbPopulate, "Product Flow Rate", "B:Product")


        else:
            print("You are not connected to a 'sample' database")
        dbConnection.close()
    else:
        print('failed to connect')

