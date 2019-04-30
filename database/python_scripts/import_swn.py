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
from enum import Enum

NUM_RECEIPTS =500
NUM_CUSTOMERS = 100

FIRST_SAMPLE_COLUMN = 4

REMAP_CUSTOMER_SALES_CHANNEL_NAME =    ["Mr. Adugyenfi", "Maxwell Acheampong", "Yorke Properties Ltd (GN Bank)","Agya Yaw", "Margaret Gyemfi", "Mr. Daniel Oteng","Nana Osei Kwame"]
REMAP_CUSTOMER_SALES_CHANNEL_CHANNEL = ["Access Points", "Household",          "Main Station",                "Access Points", "Household",     "Main Station",   "Access Points"]

class ROW(Enum):
    COUNTRY = 1
    REGION =2
    KIOSK = 3
    CONSUMER_BASE = 4
    CUSTOMER_ACCOUNT_ID = 5
    CREATED_DATE = 6
    CREATED_TIME = 7
    ACTIVE = 8
    NAME = 9
    SALES_CHANNEL = 10
    CUSTOMER_TYPE = 12
    CUSTOMER_CONSUMER_BASE = 13
    CUSTOMER_INCOME = 14
    CUSTOMER_DISTANCE = 15
    RECEIPT_ID = 16
    RECEIPT_CREATED_DATE = 17
    RECEIPT_CREATED_TIME = 18
    RECEIPT_CURRENCY = 19
    RECEIPT_ACCOUNT_ID = 20
    RECEIPT_SALES_CHANNEL = 21
    RECEIPT_CASH = 24
    RECEIPT_MOBILE = 25
    RECEIPT_CARD = 26
    RECEIPT_TOTAL = 27
    RECEIPT_ITEM_ID = 28
    RECEIPT_ITEM_RECEIPT = 29
    RECEIPT_ITEM_PRODUCT = 30
    RECEIPT_ITEM_PRICE = 31
    RECEIPT_ITEM_QUANTITY = 32
    PRODUCT_ID = 33
    PRODUCT_NAME = 34
    PRODUCT_PRICE = 35
    PRODUCT_CURRENCY = 36
    PRODUCT_UNIT_AMOUNT = 37

def convertFromExcel( sheet, index ):
    xlsRecord = swnXlsRecord(sheet[sheet.columns[index]][ROW.COUNTRY.value],
                             sheet[sheet.columns[index]][ROW.REGION.value],
                             sheet[sheet.columns[index]][ROW.KIOSK.value],
                             sheet[sheet.columns[index]][ROW.CONSUMER_BASE.value],
                             sheet[sheet.columns[index]][ROW.CUSTOMER_ACCOUNT_ID.value],
                             sheet[sheet.columns[index]][ROW.CREATED_DATE.value],
                             sheet[sheet.columns[index]][ROW.CREATED_TIME.value],
                             sheet[sheet.columns[index]][ROW.ACTIVE.value],
                             sheet[sheet.columns[index]][ROW.NAME.value],
                             sheet[sheet.columns[index]][ROW.SALES_CHANNEL.value],
                             sheet[sheet.columns[index]][ROW.CUSTOMER_TYPE.value],
                             sheet[sheet.columns[index]][ROW.CUSTOMER_CONSUMER_BASE.value],
                             sheet[sheet.columns[index]][ROW.CUSTOMER_INCOME.value],
                             sheet[sheet.columns[index]][ROW.CUSTOMER_DISTANCE.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_ID.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_CREATED_DATE.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_CREATED_TIME.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_CURRENCY.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_ACCOUNT_ID.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_SALES_CHANNEL.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_CASH.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_MOBILE.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_CARD.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_TOTAL.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_ITEM_ID.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_ITEM_RECEIPT.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_ITEM_PRODUCT.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_ITEM_PRICE.value],
                             sheet[sheet.columns[index]][ROW.RECEIPT_ITEM_QUANTITY.value],
                             sheet[sheet.columns[index]][ROW.PRODUCT_ID.value],
                             sheet[sheet.columns[index]][ROW.PRODUCT_NAME.value],
                             sheet[sheet.columns[index]][ROW.PRODUCT_PRICE.value],
                             sheet[sheet.columns[index]][ROW.PRODUCT_CURRENCY.value],
                             sheet[sheet.columns[index]][ROW.PRODUCT_UNIT_AMOUNT.value],

                             )

    print("Country:", xlsRecord.country, "Region:", xlsRecord.region, "Kiosk:", xlsRecord.kiosk, "Consumer Base:",
          xlsRecord.consumerBase)
    print("       Customer AccountId:", xlsRecord.customerAccountId, "Date:", xlsRecord.customerDate,
          "Time:", xlsRecord.customerTime, "Name:", xlsRecord.customerName,
          "Sales Channel:", xlsRecord.customerSalesChannel, "Type:", xlsRecord.customerType,
          "Consumer Base:", xlsRecord.customerConsumerBase, "Income:", xlsRecord.customerIncome,
          "Distance:", xlsRecord.customerDistance)
    print("       Receipt Id:", xlsRecord.receiptId, "Date:", xlsRecord.receiptDate,
          "Time:", xlsRecord.receiptTime, "Currency:", xlsRecord.receiptCurrency, "Account:", xlsRecord.receiptAccount,
          "Sales Channel:", xlsRecord.receiptSalesChannel, "Cash:", xlsRecord.receiptCash,
          "Mobile:", xlsRecord.receiptMobile, "Card:", xlsRecord.receiptCard, "Total:", xlsRecord.receiptTotal)

    print("       Receipt Item Id:", xlsRecord.receiptItemId, "ReceiptId:", xlsRecord.receiptItemReceipt,
          "Product:", xlsRecord.receiptItemProduct, "Price:", xlsRecord.receiptItemPrice, "Quantity:",
          xlsRecord.receiptItemQuantity)

    print("       Receipt Item Id:", xlsRecord.receiptItemId, "ReceiptId:", xlsRecord.receiptItemReceipt,
          "Product:", xlsRecord.receiptItemProduct, "Price:", xlsRecord.receiptItemPrice, "Quantity:",
          xlsRecord.receiptItemQuantity)

    print("       Product Id:", xlsRecord.productId, "Name :", xlsRecord.productName,
          "Price:", xlsRecord.productPrice, "Currency:", xlsRecord.productCurrency, "Unit amount:",
          xlsRecord.productUnitAmount)
    return xlsRecord

def filterRecord( xlsRecord ):
    if isinstance(xlsRecord.customerName, str):
        return xlsRecord
    else:
        return None

def importRecord( dbPopulate, xlsRecord, counter ):
    product_category_name = "water_for_swn_import"
    encoded_image = ""
    product_description = "Product imported from excel spreadsheet"
    dbPopulate.populate_country(xlsRecord.country)
    dbPopulate.populate_region(xlsRecord.country, xlsRecord.region, "Region Description")
    dbPopulate.populate_kiosk(xlsRecord.region, xlsRecord.kiosk)
    dbPopulate.populate_sales_channel(0x0, xlsRecord.customerSalesChannel)
    dbPopulate.populate_customer_type(xlsRecord.customerType)
    dbPopulate.populate_product_category("Description of product category", product_category_name)

    # TODO - Missing fields for product
    # COGS (Temporarily use .5 times price
    # Created date
    dbPopulate.populate_product(xlsRecord.productName, encoded_image,
                                product_category_name, product_description, xlsRecord.productPrice,
                                xlsRecord.productCurrency, xlsRecord.productUnitAmount, "liters",
                                xlsRecord.productPrice * .5, xlsRecord.productId, datetime.date(2018, 1, 1), 1)

    # TODO - Missing fields for customer
    # Phone number
    # Gender
    phone = "555-1212"
    if ( counter % 2 ) == 0:
        gender = 'M'
    else:
        gender = 'F'

    # xlsDateTime = xlsRecord.customerDate + " " + xlsRecord.customerTime
    # customer_createDateTime = datetime.datetime.strptime(xlsDateTime, '%m/%d/%y %H:%M')
    salesChannelToUse = xlsRecord.customerSalesChannel
    if xlsRecord.customerName in REMAP_CUSTOMER_SALES_CHANNEL_NAME:
        idx = REMAP_CUSTOMER_SALES_CHANNEL_NAME.index(xlsRecord.customerName)
        salesChannelToUse = REMAP_CUSTOMER_SALES_CHANNEL_CHANNEL[idx]
    customer_createDateTime = xlsRecord.customerDate.replace(hour=xlsRecord.customerTime.hour, minute = xlsRecord.customerTime.minute)
    dbPopulate.populate_customer_swn( xlsRecord.kiosk, xlsRecord.customerType, salesChannelToUse, xlsRecord.customerName,
                                      customer_createDateTime, customer_createDateTime,
                                      phone, xlsRecord.customerIncome, gender, xlsRecord.customerDistance)

    # TODO - Missing fields for receipt
    # cogs
    cogs = .5 * xlsRecord.receiptTotal;
    receipt_createDateTime = xlsRecord.receiptDate.replace(hour=xlsRecord.receiptTime.hour, minute = xlsRecord.receiptTime.minute)
    dbPopulate.populate_receipt_sema_core( xlsRecord.receiptId, receipt_createDateTime, xlsRecord.receiptCurrency,
                                           xlsRecord.customerName, xlsRecord.kiosk, "N/A", xlsRecord.receiptTotal, cogs,
                                           xlsRecord.receiptCash, xlsRecord.receiptCard, xlsRecord.receiptMobile)

    quantity = round( decimal.Decimal(xlsRecord.receiptItemQuantity), 2)
    dbPopulate.populate_receipt_line_item( xlsRecord.receiptId,xlsRecord.productName, quantity)



def importSheet( xls, index, sheetName, dbPopulate):
    if sheetName.endswith( "Raw") :
        print("Ignoring sheet:", sheetName)
    else:
        print("Processing sheet:", sheetName)
        sheet = xls.parse(index)
        counter = 0
        print( "number of rows in", sheetName, len(sheet.index), "Number of columns:", len(sheet.columns))
        for index in range( FIRST_SAMPLE_COLUMN, len(sheet.columns)) :
            xlsRecord = convertFromExcel( sheet, index )
            if filterRecord( xlsRecord) != None:
                importRecord(dbPopulate, xlsRecord, counter )
                print( "Processing record" )
                counter = counter+1
                # if counter > 5:
                #     break #temporary
            else:
                print( "Skipping incomplete record" )



if __name__ == "__main__":
    print('Python', python_version())

    tstDateTime = "12/31/16" " " + "22:25"
    customer_createDateTime = datetime.datetime.strptime(tstDateTime, '%m/%d/%y %H:%M')

    DBConfig = dbConfig()
    dbConnection = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,DBConfig.dbName)
    dbConnection.connect()
    connection = dbConnection.get_connection()
    if connection is not None:
        print("Connected")

        cursor = connection.cursor()
        cursor.execute("select database()")
        db_name = cursor.fetchone()[0]


        # Verify you are connected to a swn database
        if "swn" in db_name.lower():

            dbPopulate = DBPopulate(connection)

            xls = pd.ExcelFile("spreadsheets/SWN-Dummy Data-Amasamam.xlsx")
            for i in range(len(xls.sheet_names)):
                importSheet( xls, i, xls.sheet_names[i], dbPopulate)
        else:
            print("You are not connected to a 'swn' database")
        dbConnection.close()
    else:
        print('failed to connect')

