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
    customers = [
        Customer(name='TestCustomer 1', created_date=datetime.date(2018, 1, 1), updated_date=datetime.date(2018, 1, 1)),
        Customer(name='TestCustomer 2', created_date=datetime.date(2018, 2, 1), updated_date=datetime.date(2018, 2, 1)),
        Customer(name='TestCustomer 3', created_date=datetime.date(2018, 3, 1), updated_date=datetime.date(2018, 3, 1)),
        Customer(name='TestCustomer 4', created_date=datetime.date(2018, 4, 1), updated_date=datetime.date(2018, 4, 1)),
        Customer(name='TestCustomer 5', created_date=datetime.date(2018, 4, 1), updated_date=datetime.date(2018, 4, 1)),
        Customer(name='TestCustomer 6', created_date=datetime.date(2018, 5, 1), updated_date=datetime.date(2018, 5, 1))
        ]
    DBConfig = dbConfig()
    dbConnection = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,DBConfig.dbName)
    dbConnection.connect()
    connection = dbConnection.get_connection()
    if connection is not None:
        print("Connected")
        dbPopulate = DBPopulate(connection)
        dbPopulate.populate_country('New Zealand')
        dbPopulate.populate_customer_type('TestCustomer')
        dbPopulate.populate_sales_channel(0x0, "sales channel 1")
        dbPopulate.populate_product_category("Description of product category", "product_category 1")
        dbPopulate.populate_region('New Zealand', 'Manawatu')
        dbPopulate.populate_kiosk('Manawatu', "UnitTest", "my_api_key")
        for customer in customers:
            dbPopulate.populate_customer('UnitTest', "TestCustomer", customer.name, customer.created_date, customer.updated_date)
        dbPopulate.populate_product(0x1, "DEAD", "product_category 1", "Description of product 1", 20.1, 25, "NZD", "sku-100")
        dbPopulate.populate_receipt( created_date= datetime.date(2018, 1, 1), # JANUARY
                                     currency = 'NZD',
                                     customer_ref = 'TestCustomer 6',
                                     customer_amount = 15.00,
                                     is_sponsor_selected = 0x1,
                                     kiosk_ref='UnitTest',
                                     payment_mode = 'cash',
                                     payment_type = 'now',
                                     sales_channel_ref = 'sales channel 1',
                                     total = 15.00,
                                     total_gallons = 4 )

        dbPopulate.populate_receipt( created_date= datetime.date(2018, 1, 20), # JANUARY
                                     currency = 'NZD',
                                     customer_ref = 'TestCustomer 6',
                                     customer_amount = 20.00,
                                     is_sponsor_selected = 0x1,
                                     kiosk_ref='UnitTest',
                                     payment_mode = 'cash',
                                     payment_type = 'now',
                                     sales_channel_ref = 'sales channel 1',
                                     total = 20.00,
                                     total_gallons = 10 )

        dbPopulate.populate_receipt( created_date= datetime.date(2018, 3, 11), # MARCH
                                     currency = 'NZD',
                                     customer_ref = 'TestCustomer 6',
                                     customer_amount = 30.00,
                                     is_sponsor_selected = 0x1,
                                     kiosk_ref='UnitTest',
                                     payment_mode = 'cash',
                                     payment_type = 'now',
                                     sales_channel_ref = 'sales channel 1',
                                     total = 30.00,
                                     total_gallons = 13 )

        dbPopulate.populate_receipt( created_date= datetime.date(2018, 4, 22),  # APRIL
                                     currency = 'NZD',
                                     customer_ref = 'TestCustomer 6',
                                     customer_amount = 10.00,
                                     is_sponsor_selected = 0x1,
                                     kiosk_ref='UnitTest',
                                     payment_mode = 'cash',
                                     payment_type = 'now',
                                     sales_channel_ref = 'sales channel 1',
                                     total = 10.00,
                                     total_gallons = 4 )

        dbPopulate.populate_parameter(name="Total Chlorine")

        dbPopulate.populate_parameter(name="Temperature")
        dbPopulate.populate_parameter(name="pH")
        dbPopulate.populate_parameter(name="Total Alkalinity")
        dbPopulate.populate_parameter(name="Total Hardness")
        dbPopulate.populate_parameter(name="Free Chlorine")
        dbPopulate.populate_parameter(name="Total Chlorine")
        dbPopulate.populate_parameter(name="Total Dissolved Solids")
        dbPopulate.populate_parameter(name="PRE-FILTER PRESSURE IN")
        dbPopulate.populate_parameter(name="PRE-FILTER PRESSURE OUT")
        dbPopulate.populate_parameter(name="MEMBRANE FEED PRESSURE")
        dbPopulate.populate_parameter(name="Feed Flow Rate")
        dbPopulate.populate_parameter(name="Product Flow Rate")
        dbPopulate.populate_parameter(name="Gallons")
        dbPopulate.populate_parameter(name="Color")
        dbPopulate.populate_parameter(name="Odor")
        dbPopulate.populate_parameter(name="Taste")


        dbPopulate.populate_sampling_site(name="Feed")
        dbPopulate.populate_sampling_site(name="PM: Feed")
        dbPopulate.populate_sampling_site(name="Fill Station")
        dbPopulate.populate_sampling_site(name="PM: Fill Station")
        dbPopulate.populate_sampling_site(name="AM: Bulk")
        dbPopulate.populate_sampling_site(name="PM: Bulk Fill")
        dbPopulate.populate_sampling_site(name="AM: Cleaning Station")
        dbPopulate.populate_sampling_site(name="PM: Cleaning Station")
        dbPopulate.populate_sampling_site(name="Water Treatment Unit")
        dbPopulate.populate_sampling_site(name="AM: Product Line")
        dbPopulate.populate_sampling_site(name="PM: Product Line")


        dbPopulate.populate_reading_and_measurement(created_date= datetime.date(2018, 5, 1),
                                                    kiosk_ref='UnitTest',
                                                    sampling_site_ref="Water Treatment Unit",
                                                    parameter_ref="Total Chlorine",
                                                    value=.5)

        dbPopulate.populate_reading_and_measurement(created_date= datetime.date(2018, 5, 15),
                                                    kiosk_ref='UnitTest',
                                                    sampling_site_ref="PM: Fill Station",
                                                    parameter_ref="Gallons",
                                                    value=100)
        dbPopulate.populate_reading_and_measurement(created_date= datetime.date(2018, 5, 15),
                                                    kiosk_ref='UnitTest',
                                                    sampling_site_ref="Fill Station",
                                                    parameter_ref="Gallons",
                                                    value=80)
        dbPopulate.populate_reading_and_measurement(created_date=datetime.date(2018, 5, 15),
                                                    kiosk_ref='UnitTest',
                                                    sampling_site_ref="PM: Product Line",
                                                    parameter_ref="Gallons",
                                                    value=200)
        dbPopulate.populate_reading_and_measurement(created_date=datetime.date(2018, 5, 15),
                                                    kiosk_ref='UnitTest',
                                                    sampling_site_ref="AM: Product Line",
                                                    parameter_ref="Gallons",
                                                    value=160)

        dbPopulate.populate_reading_and_measurement_no_sampling_site(created_date= datetime.date(2018, 5, 10),
                                                                    kiosk_ref='UnitTest',
                                                                    parameter_ref="Product Flow Rate",
                                                                    value=123)
        dbPopulate.populate_reading_and_measurement_no_sampling_site(created_date= datetime.date(2018, 5, 20),
                                                                    kiosk_ref='UnitTest',
                                                                    parameter_ref="MEMBRANE FEED PRESSURE",
                                                                    value=456)





        dbConnection.close()
    else:
        print('failed to connect')

