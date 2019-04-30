#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 16:29:35 2018

@author: fredoleary
"""
import mysql.connector
import logging


class DBSchema:

    def __init__(self, connection):
        self.connection = connection

    def update_customer_account(self):
        cursor = self.connection.cursor()

        cursor.execute("DESC customer_account")
        columns = cursor.fetchall()
        column_found = False
        for column in columns:
            if column[0] == "created_date":
                column_found = True
                break
        if not column_found:
            try:
                cursor.execute("ALTER TABLE customer_account ADD created_date DATETIME")
            except mysql.connector.Error as err:
                print('failed to add created_date column', err)


        cursor.execute("DESC customer_account")
        columns = cursor.fetchall()
        column_found = False
        for column in columns:
            if column[0] == "updated_date":
                column_found = True
                break
        if not column_found:
            try:
                cursor.execute("ALTER TABLE customer_account ADD updated_date DATETIME")
            except mysql.connector.Error as err:
                print('failed to add created_date column', err)


        cursor.close()

    """ Update schema """
    def update_schema(self):
        self.update_customer_account()

