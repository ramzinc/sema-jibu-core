const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const express = require('express');
const router = express.Router();
const semaLog = require('../../seama_services/sema_logger');

let sqlGetAllReciptLineItems ="SELECT * FROM receipt_line_item;"; //"TRUNCATE TABLE receipt_line_item";
let sqlGetAllReceipts = "SELECT * FROM receipt;";//"DELETE FROM `sema_test_brian`.`receipt`";

const getReceipts = () => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(sqlGetAllReceipts, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('got all receipts - failed');
					resolve();
				}
				else {
					semaLog.info('got all receipts - succeeded');
					resolve(result);
				}
			});

		})
	});
};

const getReceiptLineItems = () => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(sqlGetAllReciptLineItems, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('got all receipt line items - failed');
					resolve();
				}
				else {
					semaLog.info('got all receipt line items - succeeded');
					resolve(result);
				}
			});

		})
	});
};

module.exports = {getReceipts, getReceiptLineItems};
