import jwt from 'jsonwebtoken';
import { axiosService } from 'services';

const login = (usernameOrEmail, password) =>
	axiosService.post('/sema/login',
		{
			usernameOrEmail,
			password
		}
	)
	.then(response => {
		const user = jwt.decode(response.data.token);

		localStorage.setItem('currentUser', JSON.stringify(user));
		localStorage.setItem('token', response.data.token);
		// localStorage.setItem('refreshToken', response.data.refreshToken);

		return response;
	});

const logout = () => {
	localStorage.removeItem('currentUser');
	localStorage.removeItem('token');
	// localStorage.removeItem('refreshToken');
};

export const authService = {
	login,
	logout
};
