const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').user;
const Role = require('../models').role;

module.exports = () => {
	const opts = {};

	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = process.env.JWT_SECRET;

	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		User
			.findOne({
				where: {
					id: jwt_payload.id
				},
				include: [Role],
				attributes: {
					exclude: ['password']
				}
			})
			.then(user => done(null, user))
			.catch(err => done(err, false));
	}));
};
