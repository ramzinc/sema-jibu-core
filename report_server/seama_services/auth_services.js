const passport = require('passport');

// Simple function to take care of authentication
const isAuthenticated = (req, res, next) =>
	passport.authenticate('jwt', { session: false })(req, res, next);

// Higher order function to take care of authorizations
// It uses the 'code' column of the role table of the logged in user
const isAuthorized = (...authorizedRoles) =>
	(req, res, next) => {
		const currentUserRoles = req.user.roles.map(roles => roles.code);

		// Power to the admins
		if (currentUserRoles.includes('admin')) return next();

		const found = currentUserRoles.some(role =>
			authorizedRoles.includes(role)
		);

		if (!found) {
			// TODO: Improve this error message
			return res.status(403).json({ msg: 'Forbidden' });
		}

		next();
	};

module.exports = {
	isAuthenticated,
	isAuthorized
};
