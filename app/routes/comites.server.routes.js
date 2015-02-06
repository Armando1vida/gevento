'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var comites = require('../../app/controllers/comites.server.controller');

	// Comites Routes
	app.route('/comites')
		.get(comites.list)
		.post(users.requiresLogin, comites.create);// Comites Routes
	app.route('/comites/adduser')
		.post(comites.addusers);
    app.route('/comites/removeuser')
		.put(comites.removeuser);

	app.route('/comites/:comiteId')
		.get(comites.read)
		.put(users.requiresLogin, comites.hasAuthorization, comites.update)
		.delete(users.requiresLogin, comites.hasAuthorization, comites.delete);

	// Finish by binding the Comite middleware
	app.param('comiteId', comites.comiteByID);
};
