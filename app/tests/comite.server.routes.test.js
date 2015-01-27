'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Comite = mongoose.model('Comite'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, comite;

/**
 * Comite routes tests
 */
describe('Comite CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Comite
		user.save(function() {
			comite = {
				name: 'Comite Name'
			};

			done();
		});
	});

	it('should be able to save Comite instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comite
				agent.post('/comites')
					.send(comite)
					.expect(200)
					.end(function(comiteSaveErr, comiteSaveRes) {
						// Handle Comite save error
						if (comiteSaveErr) done(comiteSaveErr);

						// Get a list of Comites
						agent.get('/comites')
							.end(function(comitesGetErr, comitesGetRes) {
								// Handle Comite save error
								if (comitesGetErr) done(comitesGetErr);

								// Get Comites list
								var comites = comitesGetRes.body;

								// Set assertions
								(comites[0].user._id).should.equal(userId);
								(comites[0].name).should.match('Comite Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Comite instance if not logged in', function(done) {
		agent.post('/comites')
			.send(comite)
			.expect(401)
			.end(function(comiteSaveErr, comiteSaveRes) {
				// Call the assertion callback
				done(comiteSaveErr);
			});
	});

	it('should not be able to save Comite instance if no name is provided', function(done) {
		// Invalidate name field
		comite.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comite
				agent.post('/comites')
					.send(comite)
					.expect(400)
					.end(function(comiteSaveErr, comiteSaveRes) {
						// Set message assertion
						(comiteSaveRes.body.message).should.match('Please fill Comite name');
						
						// Handle Comite save error
						done(comiteSaveErr);
					});
			});
	});

	it('should be able to update Comite instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comite
				agent.post('/comites')
					.send(comite)
					.expect(200)
					.end(function(comiteSaveErr, comiteSaveRes) {
						// Handle Comite save error
						if (comiteSaveErr) done(comiteSaveErr);

						// Update Comite name
						comite.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Comite
						agent.put('/comites/' + comiteSaveRes.body._id)
							.send(comite)
							.expect(200)
							.end(function(comiteUpdateErr, comiteUpdateRes) {
								// Handle Comite update error
								if (comiteUpdateErr) done(comiteUpdateErr);

								// Set assertions
								(comiteUpdateRes.body._id).should.equal(comiteSaveRes.body._id);
								(comiteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Comites if not signed in', function(done) {
		// Create new Comite model instance
		var comiteObj = new Comite(comite);

		// Save the Comite
		comiteObj.save(function() {
			// Request Comites
			request(app).get('/comites')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Comite if not signed in', function(done) {
		// Create new Comite model instance
		var comiteObj = new Comite(comite);

		// Save the Comite
		comiteObj.save(function() {
			request(app).get('/comites/' + comiteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', comite.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Comite instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comite
				agent.post('/comites')
					.send(comite)
					.expect(200)
					.end(function(comiteSaveErr, comiteSaveRes) {
						// Handle Comite save error
						if (comiteSaveErr) done(comiteSaveErr);

						// Delete existing Comite
						agent.delete('/comites/' + comiteSaveRes.body._id)
							.send(comite)
							.expect(200)
							.end(function(comiteDeleteErr, comiteDeleteRes) {
								// Handle Comite error error
								if (comiteDeleteErr) done(comiteDeleteErr);

								// Set assertions
								(comiteDeleteRes.body._id).should.equal(comiteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Comite instance if not signed in', function(done) {
		// Set Comite user 
		comite.user = user;

		// Create new Comite model instance
		var comiteObj = new Comite(comite);

		// Save the Comite
		comiteObj.save(function() {
			// Try deleting Comite
			request(app).delete('/comites/' + comiteObj._id)
			.expect(401)
			.end(function(comiteDeleteErr, comiteDeleteRes) {
				// Set message assertion
				(comiteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Comite error error
				done(comiteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Comite.remove().exec();
		done();
	});
});