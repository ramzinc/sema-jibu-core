#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 16:29:35 2018

@author: fredoleary
"""
import mysql.connector
import logging

class DBConnection():
    """ Connect to the database """
    def __init__(self, host, user, password, dbName ):
        self.connection = None
        self.host = host
        self.dbName = dbName
        self.password = password
        self.user = user
        print( "Database: host-", host, "user-", user, "database-",dbName)
    def connect(self):
        """ Initialize database connection and tables """
        self.connection = mysql.connector.connect(host= self.host,
                                                  user=self.user,
                                                  password = self.password,
                                                  database = self.dbName)


    def close(self):
        """ Close db if necessary """
        if self.connection is not None:
            self.connection.close()

    def get_connection(self):
        """ Get Database connection """
        return self.connection

