#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 17:20:33 2018

@author: fredoleary
"""

from platform import python_version
from utilities.DBConnection import DBConnection
from utilities.DBPopulate import DBPopulate
from utilities.Customer import Customer
from dbConfig import dbConfig

import datetime

if __name__ == "__main__":
    print('Python', python_version())
    customers = [ Customer(name='TestCustomer 1', created_date=datetime.date(2018, 1, 1), updated_date= datetime.date(2018, 1, 1), phone="555-1212", channel='walkup'),
                  Customer(name='TestCustomer 2', created_date=datetime.date(2018, 2, 1), updated_date= datetime.date(2018, 2, 1), phone="555-1313", channel='walkup'),
                  Customer(name='TestCustomer 3', created_date=datetime.date(2018, 3, 1), updated_date= datetime.date(2018, 3, 1), phone="555-1414", channel='walkup'),
                  Customer(name='TestCustomer 4', created_date=datetime.date(2018, 4, 1), updated_date= datetime.date(2018, 4, 1), phone="555-1515", channel='walkup'),
                  Customer(name='TestCustomer 5', created_date=datetime.date(2018, 4, 1), updated_date= datetime.date(2018, 4, 1), phone="555-1616", channel='walkup'),
                  Customer(name='TestCustomer 6', created_date=datetime.date(2018, 5, 1), updated_date= datetime.date(2018, 5, 1), phone="555-1717", channel='walkup'),
                  Customer(name='TestCustomer A', created_date=datetime.date(2018, 6, 1), updated_date= datetime.date(2018, 6, 1), phone="555-1313", channel='reseller'),
                  Customer(name='TestCustomer B', created_date=datetime.date(2018, 6, 2), updated_date= datetime.date(2018, 6, 2), phone="555-1414", channel='reseller'),
                  Customer(name='TestCustomer C', created_date=datetime.date(2018, 6, 3), updated_date= datetime.date(2018, 6, 3), phone="555-1515", channel='reseller'),
                  Customer(name='TestCustomer D', created_date=datetime.date(2018, 6, 4), updated_date= datetime.date(2018, 6, 4), phone="555-1616", channel='reseller'),
                  Customer(name='TestCustomer E', created_date=datetime.date(2018, 6, 5), updated_date= datetime.date(2018, 6, 5), phone="555-1717", channel='reseller'),
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


        # Verify you are connected to a SEMA database
        if "sema" in db_name.lower():

            dbPopulate = DBPopulate(connection)
            dbPopulate.populate_country('Uganda')
            dbPopulate.populate_customer_type('generic')
            dbPopulate.populate_sales_channel(0x0, "walkup")
            dbPopulate.populate_sales_channel(0x0, "reseller")
            dbPopulate.populate_product_category("Description of product category", "product_category 1")
            dbPopulate.populate_region('Uganda', 'Kampala', "Kampala - Uganda")
            dbPopulate.populate_kiosk('Kampala', "Kiswa")

            # add the 'anonymous' walk up customer
            dbPopulate.populate_customer_uuid('Kiswa', "generic", "walkup", "Walkup Client",
                                              datetime.date(2018, 1, 1), datetime.date(2018, 1, 1),
                                              "----------------------------",
                                              "----------------------------",
                                              "9999999-9999-9999-9999-9999999")

            for customer in customers:
                dbPopulate.populate_customer('Kiswa', "generic", customer.channel, customer.name,
                                             customer.created_date, customer.updated_date, customer.phone)
        else:
            print("You are not connected to a 'sema' database")
        dbConnection.close()
    else:
        print('failed to connect')

