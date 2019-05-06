require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');

const fs = require('fs');

var index = require('./routes');
var seama_health_check = require('./routes/sema_health_check');
var seama_login = require('./routes/sema_login');
var seama_kiosks = require('./routes/sema_kiosks');
var seama_water_operations = require('./routes/sema_water_operations');
var sema_sales = require('./routes/sema_sales');
var sema_sales_by_channel = require('./routes/sema_sales_by_channel');
var sema_customers = require('./routes/sema_customers');
var sema_products = require('./routes/sema_products');
var sema_receipts = require('./routes/sema_receipts');
var sema_sales_channels = require('./routes/sema_sales_channels');
var sema_customer_types = require('./routes/sema_customer_types');
var sema_product_mrps = require('./routes/sema_product_mrps');
var sema_sales_by_channels_history = require('./routes/sema_sales_by_channel_history');
var sema_receipt_summary = require('./routes/sema_receipt_summary');
var sema_customer_summary = require('./routes/sema_customer_summary');
var sema_sales_ex = require('./routes/sema_sales_ex');
var sema_units = require('./routes/sema_units');
var sema_water_chart = require('./routes/sema_water_chart');
var sema_water_summary = require('./routes/sema_water_summary');
var sema_data_export = require('./routes/sema_data_export');
let sema_kiosk_user=require('./routes/sema_kiosk_user');
var sema_reminders = require('./routes/sema_reminders');
let sema_daily_production=require('./routes/sema_daily_production');
let cronJobs=require('./crons/bboxxcron');
cronJobs.downloadCronJob.start();
cronJobs.updateCronJob.start();
cronJobs.identifyDaysWithoutRecords.start();
cronJobs.downloadMissingData.start();


// const CronJob = require('cron').CronJob;
// const exec = require('child_process').exec;

// If there is a configuration file for IoTile, we set a cron job
// to sync the data every 10 minutes
fs.access('./iotile.conf.json', err => {
	if (err) return;

	const job = new CronJob('0 */10 * * * *', function() {
		console.log('SYNCING IOTILE DATA')
		exec('node iotile_sync.js',
			function (error, stdout, stderr) {
				console.log(`sync output: ${stdout}`);
				console.log(`sync error: ${stderr || 'none'}`);
				if (error !== null) {
					console.log(`exec error: ${error}`);
				}
				console.log('SYNCING IOTILE DATA DONE')
			}
		);
	});

	job.start();
});

var sema_users = require('./routes/sema_user');
var sema_admin_products = require('./routes/sema_api/sema_products');
const sema_product_categories = require('./routes/sema_api/product_category');
const sema_admin_sales_channel = require('./routes/sema_api/sales_channel');

const winston = require('winston');

const passport = require('passport');
const configurePassport = require('./config/passport');
const {
	isAuthenticated,
	isAuthorized
} = require('./seama_services/auth_services');
const cors = require('cors');

const { version } = require('./package.json');

var app = express();

app.use(cors());

app.use(passport.initialize());
configurePassport();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

// Use for react
app.use(express.static(path.join(__dirname, 'public_react/build/')));
app.use(express.static(path.join('..', 'documentations')));

app.use('/', index);
app.use('/Sales', index);
app.use('/Volumes', index);
app.use('/Demographics', index);

app.use('/untapped/health-check', seama_health_check);
app.use('/untapped/login', seama_login);
app.use('/untapped/kiosks', isAuthenticated, seama_kiosks);
app.use('/untapped/water-operations', isAuthenticated, seama_water_operations);
app.use('/untapped/sales', isAuthenticated, sema_sales);
app.use('/untapped/sales-by-channel', isAuthenticated, sema_sales_by_channel);

app.use('/sema/health-check', seama_health_check);
app.use('/sema/kiosk_users',sema_kiosk_user);
app.use('/sema/login', seama_login);
app.use('/sema/daily_production', sema_daily_production);
app.use('/sema/kiosks', isAuthenticated, seama_kiosks);
app.use('/sema/site/customers/', isAuthenticated, sema_customers);
app.use('/sema/site/receipts/', sema_receipts);
app.use('/sema/products/', isAuthenticated, sema_products);
app.use('/sema/sales-channels/', isAuthenticated, sema_sales_channels);
app.use('/sema/customer-types/', isAuthenticated, sema_customer_types);
app.use('/sema/site/product-mrps/', isAuthenticated, sema_product_mrps);
// TODO - Add 'isAuthenticated' below!!
app.use('/sema/dashboard/site/sales-by-channel-history/', sema_sales_by_channels_history);
app.use('/sema/dashboard/site/receipt-summary/', sema_receipt_summary);
app.use('/sema/dashboard/site/customer-summary/', sema_customer_summary);
app.use('/sema/dashboard/site/sales-summary/', sema_sales_ex);
app.use('/sema/measure-units/', sema_units);
app.use('/sema/dashboard/site/water-chart/', sema_water_chart);
app.use('/sema/dashboard/site/water-summary/', sema_water_summary);
app.use('/sema/data-export', isAuthenticated, sema_data_export);

app.use('/sema/users', isAuthenticated, sema_users);
app.use('/sema/admin/products', isAuthenticated, sema_admin_products);
app.use('/sema/reminders',sema_reminders);

app.use(
	'/sema/api/product-categories',
	isAuthenticated,
	sema_product_categories
);
app.use('/sema/api/sales-channel', isAuthenticated, sema_admin_sales_channel);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// Version
app.set('sema_version', version);

module.exports = app;
