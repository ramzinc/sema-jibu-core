#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 17:20:33 2018

@author: fredoleary
"""

from platform import python_version
from utilities.DBConnection import DBConnection
from utilities.DBSchema import DBSchema
from dbConfig import dbConfig

if __name__ == "__main__":
    print('Python', python_version())
    DBConfig = dbConfig()

    print('This script is deprecated...')
    # dbConnection = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,DBConfig.dbName)
    # dbConnection.connect()
    # connection = dbConnection.get_connection()
    # dbSchema = DBSchema(connection)
    # if connection is not None:
    #     print("Connected")
    #     dbSchema = DBSchema(connection)
    #     dbSchema.update_schema()
    #     dbConnection.close()
    # else:
    #     print('failed to connect')
    #
