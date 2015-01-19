'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var eventos = require('../../app/controllers/eventos.server.controller');

	// Eventos Routes
	app.route('/eventos')
		.get(eventos.list)
		.post(users.requiresLogin, eventos.create);

	app.route('/eventos/:eventoId')
		.get(eventos.read)
		.put(users.requiresLogin, eventos.hasAuthorization, eventos.update)
		.delete(users.requiresLogin, eventos.hasAuthorization, eventos.delete);

	// Finish by binding the Evento middleware
	app.param('eventoId', eventos.eventoByID);
};
