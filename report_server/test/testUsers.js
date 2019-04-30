process.env.NODE_ENV = 'test';
let chai = require('chai');
const app = require('../bin/www');
const request = require('supertest')(app);
let should = chai.should();
const expect = require('chai').expect;
const db = require('../models');

describe('Users', () => {
	var token;
	let user;

	before(async () => {
		//delete the user if it already exists
		const u = await db.user.findOne({
			where: { username: 'testuserjs123' }
		});
		if (u) {
			await u.setRoles([]); // clear roles
			await u.destroy();
		}
	});

	after(async () => {
		const u = await db.user.findOne({ where: { id: user.id } });
		if (u) {
			await u.setRoles([]); // clear roles
			await u.destroy();
		}
	});

	beforeEach(done => {
		request
			.post('/sema/login')
			.send({ usernameOrEmail: 'unittest', password: 'testpassword' })
			.end(function(err, res) {
				if (err) throw err;
				token = res.body.token;
				done();
			});
	});
	describe('/GET user', () => {
		it('it should get all the users', done => {
			request
				.get('/sema/users')
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('users');
					res.body.users.should.be.a('array');
					done();
				});
		});
	});
	describe('/POST user', () => {
		const postUser = {
			firstName: 'Testing',
			lastName: 'Agent',
			email: 'testuserjs123@gmail.com',
			username: 'testuserjs123',
			password: 'test',
			role: ['admin']
		};

		it('should create a user', done => {
			request
				.post('/sema/users')
				.set('Authorization', 'Bearer ' + token)
				.send({ data: postUser })
				.expect(200)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					user = res.body.user;
					res.body.user.should.have.property('firstName');
					res.body.user.should.have.property('lastName');
					res.body.user.should.have.property('email');
					done();
				});
		});
	});
	describe('/PUT user', () => {
		const putUser = {
			firstName: 'Test',
			lastName: 'Person',
			email: 'testuserjs123@gmail.com',
			username: 'testuserjs123',
			role: []
		};
		it('should update a user', done => {
			request
				.put('/sema/users/' + user.id)
				.set('Authorization', 'Bearer ' + token)
				.send({ data: putUser })
				.expect(200)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					user = res.body.user;
					res.body.user.should.have.property('firstName').eql('Test');
					res.body.user.should.have
						.property('lastName')
						.eql('Person');
					done();
				});
		});
	});

	describe('/PUT toggle user', () => {
		it('should toggle user activation', done => {
			request
				.put('/sema/users/toggle/' + user.id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					user = res.body.user;
					res.body.user.should.have.property('active').eql(false);
					done();
				});
		});
	});

	describe('/Delete user', () => {
		it('should delete a user', done => {
			request
				.delete('/sema/users/' + user.id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.should.have.property('id').eql(`${user.id}`);
					done();
				});
		});
	});
});
