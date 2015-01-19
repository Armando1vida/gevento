'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Evento = mongoose.model('Evento'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, evento;

/**
 * Evento routes tests
 */
describe('Evento CRUD tests', function() {
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

		// Save a user to the test db and create new Evento
		user.save(function() {
			evento = {
				name: 'Evento Name'
			};

			done();
		});
	});

	it('should be able to save Evento instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evento
				agent.post('/eventos')
					.send(evento)
					.expect(200)
					.end(function(eventoSaveErr, eventoSaveRes) {
						// Handle Evento save error
						if (eventoSaveErr) done(eventoSaveErr);

						// Get a list of Eventos
						agent.get('/eventos')
							.end(function(eventosGetErr, eventosGetRes) {
								// Handle Evento save error
								if (eventosGetErr) done(eventosGetErr);

								// Get Eventos list
								var eventos = eventosGetRes.body;

								// Set assertions
								(eventos[0].user._id).should.equal(userId);
								(eventos[0].name).should.match('Evento Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Evento instance if not logged in', function(done) {
		agent.post('/eventos')
			.send(evento)
			.expect(401)
			.end(function(eventoSaveErr, eventoSaveRes) {
				// Call the assertion callback
				done(eventoSaveErr);
			});
	});

	it('should not be able to save Evento instance if no name is provided', function(done) {
		// Invalidate name field
		evento.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evento
				agent.post('/eventos')
					.send(evento)
					.expect(400)
					.end(function(eventoSaveErr, eventoSaveRes) {
						// Set message assertion
						(eventoSaveRes.body.message).should.match('Please fill Evento name');
						
						// Handle Evento save error
						done(eventoSaveErr);
					});
			});
	});

	it('should be able to update Evento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evento
				agent.post('/eventos')
					.send(evento)
					.expect(200)
					.end(function(eventoSaveErr, eventoSaveRes) {
						// Handle Evento save error
						if (eventoSaveErr) done(eventoSaveErr);

						// Update Evento name
						evento.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Evento
						agent.put('/eventos/' + eventoSaveRes.body._id)
							.send(evento)
							.expect(200)
							.end(function(eventoUpdateErr, eventoUpdateRes) {
								// Handle Evento update error
								if (eventoUpdateErr) done(eventoUpdateErr);

								// Set assertions
								(eventoUpdateRes.body._id).should.equal(eventoSaveRes.body._id);
								(eventoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Eventos if not signed in', function(done) {
		// Create new Evento model instance
		var eventoObj = new Evento(evento);

		// Save the Evento
		eventoObj.save(function() {
			// Request Eventos
			request(app).get('/eventos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Evento if not signed in', function(done) {
		// Create new Evento model instance
		var eventoObj = new Evento(evento);

		// Save the Evento
		eventoObj.save(function() {
			request(app).get('/eventos/' + eventoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', evento.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Evento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evento
				agent.post('/eventos')
					.send(evento)
					.expect(200)
					.end(function(eventoSaveErr, eventoSaveRes) {
						// Handle Evento save error
						if (eventoSaveErr) done(eventoSaveErr);

						// Delete existing Evento
						agent.delete('/eventos/' + eventoSaveRes.body._id)
							.send(evento)
							.expect(200)
							.end(function(eventoDeleteErr, eventoDeleteRes) {
								// Handle Evento error error
								if (eventoDeleteErr) done(eventoDeleteErr);

								// Set assertions
								(eventoDeleteRes.body._id).should.equal(eventoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Evento instance if not signed in', function(done) {
		// Set Evento user 
		evento.user = user;

		// Create new Evento model instance
		var eventoObj = new Evento(evento);

		// Save the Evento
		eventoObj.save(function() {
			// Try deleting Evento
			request(app).delete('/eventos/' + eventoObj._id)
			.expect(401)
			.end(function(eventoDeleteErr, eventoDeleteRes) {
				// Set message assertion
				(eventoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Evento error error
				done(eventoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Evento.remove().exec();
		done();
	});
});