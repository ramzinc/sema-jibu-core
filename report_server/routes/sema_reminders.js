const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const ReminderData = require('../model_layer/ReminderData');
const bodyParser = require('body-parser');
const moment =  require('moment');
router.use(bodyParser.urlencoded({ extended: false }));

let sqlReminderData = 'select distinct * from reminder_details where reminder_date=? and Kiosk_id=?';

let sqlInsertReminder = 'insert INTO reminders ' + '(frequency,created_at,customer_id,receipt_id,reminder_date,comment,)'+
    '(?,?,?,?,?,?)';

router.get('/', function(req, res) {
	semaLog.info('GET Reminders - Enter');

	req.check("site-id", "Parameter site-id is missing").exists();

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("GET Reminder data validation error: ", errors);
			res.status(400).send(errors.toString());
		}
		else {
		    let todayDate = moment( new Date()).add(1,'days').format('YYYY-MM-DD');

			semaLog.info("today_date: " + todayDate);
				if (isNaN(todayDate)) {
				     getReminderData(sqlReminderData,
						     [todayDate,req.query["site-id"]], res);
				}
				else {
					semaLog.error("GET Reminder Details - Invalid today_date");
					res.status(400).send("Invalid Date");
				}
			


			}


		}
				      );
});

router.post('/',function(req,res){
    semaLog.info("Checking the request body");
    req.check("site-id","site-id missing").exists();
    req.check("frequency","frequency is missing").exists();
    req.check("customer_id","customer_id is missing").exists();
    req.check("receipt","receipt_id is missing").exists();

    req.getValidationResult().then((result) =>{

	if(result.isEmpty()){
	    let reminder = new Reminder(req.body);
	    let params = [reminder.frequency, reminder.createdAt, reminder.customerId, reminder.receipt, reminder.reminder_date,reminder.comment];
	    insertReminder(sqlInsertReminder,params, res);
	}
	else{
	    const errors = result.array.map(error =>{return error.msg;});
	    semaLog.error("INSERTING THE REMINDER HAS FAILED");
	    res.status(500).send(errors.toString());

	}
    });

});


const insertReminder = (query,params,response) => {
    return new Promise((resolve,reject) => {
	__pool.getConnection((err,connection) =>{
	    connection.query(query, params,(err, result)=>{
		if (err){
		    semaLog.error('INSERT OF  Reminder Details- Failed==> ',{err});
		    res.status(500).send('Failed in the sql query '+err.message);
		    reject(err);
		}else{
		    semaLog.info('INSERT Reminder SUCCEEDED');
		    
			    //semaLog.info("Total ==>"+reminders.reminder_date);
			    semaLog.info({result});
			    resolve(response.json({result}));
			

		    }
	    });
			    
	});

    });
}

const getReminderData = (query,params,response) => {
    return new Promise((resolve,reject) => {
	__pool.getConnection((err,connection) =>{
	    connection.query(query, params,(err, result)=>{
		connection.release();
		if (err){
		    semaLog.error('GET Reminder Details- Failed==> ',{err});
		    res.status(500).send('Failed in the sql query '+err.message);
		    reject(err);
		}else{
		    semaLog.info('GET Reminder Details SUCCEEDED');
		    try {
			if (Array.isArray(result) && result.length >= 1){
			    var reminders = result.map(item => {
				//semaLog.info(item);
				var reminder = new ReminderData(item);
				semaLog.info("Returned from db 0 ==>"+item +'--> '+ reminder['reminder_date']);
				semaLog.info("THE AMOUNT DUE " + reminder["amountDue"]);
				return reminder;
			    });
			    //semaLog.info("Total ==>"+reminders.reminder_date);
			    semaLog.info({reminders});
			    resolve(response.json({reminders}));
			}else{
			    resolve(response.json({reminderDetails:[] }));
				   
				   }
		    

		    }catch(err){
			semaLog.error('GET ReminderDetails -failed',{err});
		    	response.status(500).send(err.message);
			reject(err);
			       }
		    }
		}
			    );
	



	}

    );


    });
};

module.exports = router;
