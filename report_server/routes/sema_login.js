const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const User = require(`${__basedir}/models`).user;
const Role = require(`${__basedir}/models`).role;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const kiosk_user=require('../models').kiosk_user;
const kiosk=require('../models').kiosk;

/* Process login. */
router.post('/', async (req, res) => {
	semaLog.info('sema_login - Enter');
	const { usernameOrEmail, password } = req.body;
	if( ! usernameOrEmail || ! password){
		return res.status(400).send({ msg: "Bad request, missing username or password" });
	}

	try {
		let whereClause = validator.isEmail(usernameOrEmail) ?
			{ email: usernameOrEmail.toLowerCase() } :
			{ username: usernameOrEmail.toLowerCase() };

		// Get the user with the assigned role code
		const user = await User.findOne({
			where: whereClause,
			include: [{
				model: Role,
				attributes: ['code']
			}]
		});

		if (!user) {
			semaLog.warn('sema_login - Invalid Credentials');
			return res.status(401).send({ msg: "Invalid Credentials" });
		}

		const isValidPassword = await user.comparePassword(password);

		if (!isValidPassword) {
			semaLog.warn('sema_login - Invalid Credentials');
			return res.status(401).send({ msg: "Invalid Credentials" });
		}

		// Everything went well

		let kioskUser= await kiosk_user.find({
			where:{user_id:user.id},
		});

		let kioskObj = await kiosk.findOne({
			id:kioskUser.kiosk_id
		});

		let data={
			kiosk:kioskObj,
			kioskUser:kioskUser
		}

		const token =  jwt.sign(data, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION_LENGTH
		});

		semaLog.info('sema_login - succeeded');

		res.json({
			version: req.app.get('sema_version'),
			data,
			token
		});
	} catch(err) {
		semaLog.warn(`sema_login - Error: ${err}`);
		return res.status(500).send({ msg: "Internal Server Error" });
	}
});

module.exports = router;
