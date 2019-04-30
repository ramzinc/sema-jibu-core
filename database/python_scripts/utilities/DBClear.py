#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 16:29:35 2018

@author: fredoleary
"""
import mysql.connector
import logging


class DBClear:

    def __init__(self, connection):
        self.connection = connection

    """ Clear schema"""
    def clear_schema(self):
        cursor = self.connection.cursor()
        cursor.execute("select database()")
        db_name = cursor.fetchone()[0]
        errFlag = 0


        # Verify you are connected to a test database
        if "test" in db_name.lower():
            print("Database to be cleared is " + str(db_name))

            cursor.execute("SHOW FULL TABLES WHERE Table_Type != 'VIEW'")
            table_names = cursor.fetchall()
            #print("Num of Tables " + str(len(table_names)))
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

            for table in table_names:
                try:
                    #print("Table: " + str(table))
                    sql = 'TRUNCATE TABLE `%s`' % (table[0],)
                    cursor.execute(sql)
                    self.connection.commit()


                except mysql.connector.Error as err:
                    errFlag = 1
                    print("Error: " + str(table[0]))
                    pass


            cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
            if errFlag:
                print("Errors were caught")


        else:
            print("You are not connected to the test DB")

