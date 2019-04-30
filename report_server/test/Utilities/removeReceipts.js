const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const express = require('express');
const router = express.Router();
const semaLog = require('../../seama_services/sema_logger');

let sqlDeleteAllReciptLineItems = "TRUNCATE TABLE receipt_line_item";
let sqlDeleteAllReceipts = "DELETE FROM receipt";

const removeReceipts = () => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(sqlDeleteAllReceipts, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('delete all receipts - failed');
					resolve(false);
				}
				else {
					semaLog.info('delete all receipts - succeeded');
					resolve(true);
				}
			});

		})
	});
};

const removeReceiptLineItems = () => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(sqlDeleteAllReciptLineItems, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('delete all receipt line items - failed');
					resolve(false);
				}
				else {
					semaLog.info('delete all receipt line items - succeeded');
					resolve(true);
				}
			});

		})
	});
};

module.exports = {removeReceipts, removeReceiptLineItems};
