#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  8 17:20:33 2018

@author: fredoleary
"""

from platform import python_version
from utilities.DBConnection import DBConnection
from utilities.DBClear import DBClear
from dbConfig import dbConfig


if __name__ == "__main__":
    print('Python', python_version())
    DBConfig = dbConfig()

    dbConnection = DBConnection(DBConfig.host, DBConfig.user, DBConfig.password,DBConfig.dbName)
    dbConnection.connect()
    connection = dbConnection.get_connection()
    #dbSchema = DBSchema(connection)
    dbClear = DBClear(connection)
    if connection is not None:
        print("Connected")

        dbClear.clear_schema()
        dbConnection.close()
    else:
        print('failed to connect')

