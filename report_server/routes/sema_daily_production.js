const express = require('express');
const router = express.Router();
let dProd = require('../models').kiosk_daily_production;
let auditTrail = require('../models').kiosk_production_audit_trail;

const semaLog = require(`${__basedir}/seama_services/sema_logger`);
router.get('/', function(req, res) {

	let query='select p.id, kiosk_id,k.name "kioskName", day_date "date", production "dailyProduction", cumulative_meter_adjustment, water_meter_reading "dailyWaterMeter", cumulative_billing_adjustment, billable_production "dailyBillableProduction" from kiosk_daily_production p join kiosk k on p.kiosk_id=k.id';

	if(req.query.date){
		console.log(req.query.date);
		let date=req.query.date;
		query+=" where p.day_date>='"+req.query.date+"'";
	};
	query+=" order by day_date desc, kioskName"

	console.log(query)

	__pool.getConnection((err, connection) => {
		connection.query(query, (err, result) => {
			connection.release();
			if (err) {
				semaLog.error('GET product mrps  - failed', { err });
				res.status(500).send(err.message);
			} else {
				semaLog.info('GET product mrps  - succeeded');
				res.json(result);
			}
		});
	});
});
router.put('/', function(req, res) {

	console.log(req.body);
	const {
		id,
		meterAdjustment,
		billingAdjustment,
		kioskId
	} = req.body;

	let userId=req.query.userId?req.query.userId:1;

	//Get all daily production records where id is greater or equal to the one specified in the request

	dProd.findAll({
		where: {
			id:{
				gte:id
			},
			kiosk_id:kioskId
		}
	}).then(list=>{
		let count=0;
		list.forEach(async (e,i)=>{
			let entry={
				cumulative_meter_adjustment:meterAdjustment,
				water_meter_reading:(e.production+meterAdjustment),
				cumulative_billing_adjustment:billingAdjustment,
				billable_production:(e.production+meterAdjustment+billingAdjustment)

			}

			let auditTrailEntry={
				daily_production_id: e.id,
				current_meter_adjust: meterAdjustment,
				previous_meter_adjust: e.cumulative_meter_adjustment,
				current_meter_reading: (e.production+meterAdjustment),
				previous_meter_reading: e.water_meter_reading,
				current_billing_adjust: billingAdjustment,
				previous_billing_adjust: e.cumulative_billing_adjustment,
				current_billable_prod: (e.production+meterAdjustment+billingAdjustment),
				previous_billable_prod: e.billable_production,
				created_by:userId
			}

			dProd.update(entry, {where:{id:e.id}}).then(u=>{
				console.log(u)
			});

			auditTrail.create(auditTrailEntry).then(e=>{
				console.log("Audit Trail" +e);
			});
			count++;
		});

		res.send({
			status:"UPDATED",
			changed:count
		})
	});


});



module.exports = router;
