#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 17:20:33 2018

@author: brian mackessy
"""

from platform import python_version
from utilities.DBConnection import DBConnection
from utilities.DBPopulate import DBPopulate
from utilities.Customer import Customer
from dbConfig import dbConfig

import datetime

if __name__ == "__main__":
    print('Python', python_version())
    customers = [ Customer(name='TestCustomer 1', created_date= datetime.date(2018, 1, 1), updated_date= datetime.date(2018, 1, 1), phone="555-1212"),
                  Customer(name='TestCustomer 2', created_date=datetime.date(2018, 2, 1), updated_date= datetime.date(2018, 2, 1), phone="555-1313"),
                  Customer(name='TestCustomer 3', created_date=datetime.date(2018, 3, 1), updated_date= datetime.date(2018, 3, 1), phone="555-1414"),
                  Customer(name='TestCustomer 4', created_date=datetime.date(2018, 4, 1), updated_date= datetime.date(2018, 4, 1), phone="555-1515"),
                  Customer(name='TestCustomer 5', created_date=datetime.date(2018, 4, 1), updated_date= datetime.date(2018, 4, 1), phone="555-1616"),
                  Customer(name='TestCustomer 6', created_date=datetime.date(2018, 5, 1), updated_date= datetime.date(2018, 5, 1), phone="555-1717"),
                  ]
    DBConfig = dbConfig()
    dbConnection = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,DBConfig.dbName)
    dbConnection.connect()
    connection = dbConnection.get_connection()
    if connection is not None:
        print("Connected")
        cursor = connection.cursor()
        cursor.execute("select database()")
        db_name = cursor.fetchone()[0]

        # Verify you are connected to a test database
        if "test" in db_name.lower():

            dbPopulate = DBPopulate(connection)
            dbPopulate.populate_country('New Zealand')
            dbPopulate.populate_customer_type('TestCustomer')
            dbPopulate.populate_sales_channel(0x0, "sales channel 1")
            dbPopulate.populate_product_category("Description of product category", "product_category 1")
            dbPopulate.populate_region('New Zealand', 'Manawatu', "My home town!")
            dbPopulate.populate_kiosk('Manawatu', "UnitTestCustomers")
            for customer in customers:
                dbPopulate.populate_customer('UnitTestCustomers', "TestCustomer", "sales channel 1", customer.name,
                                             customer.created_date, customer.updated_date, customer.phone)
        else:
            print("You are not connected to a 'test' database")
        dbConnection.close()
    else:
        print('failed to connect')

