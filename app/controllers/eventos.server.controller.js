'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Evento = mongoose.model('Evento'),
	_ = require('lodash');

/**
 * Create a Evento
 */
exports.create = function(req, res) {
	var evento = new Evento(req.body);
	evento.user = req.user;

	evento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(evento);
		}
	});
};

/**
 * Show the current Evento
 */
exports.read = function(req, res) {
	res.jsonp(req.evento);
};

/**
 * Update a Evento
 */
exports.update = function(req, res) {
	var evento = req.evento ;

	evento = _.extend(evento , req.body);

	evento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(evento);
		}
	});
};

/**
 * Delete an Evento
 */
exports.delete = function(req, res) {
	var evento = req.evento ;
    evento.state=['INACTIVO'];
    evento.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(evento);
        }
    });
//
//	evento.remove(function(err) {
//		if (err) {
//			return res.status(400).send({
//				message: errorHandler.getErrorMessage(err)
//			});
//		} else {
//			res.jsonp(evento);
//		}
//	});
};

/**
 * List of Eventos
 */
exports.list = function(req, res) {
	Evento.find().where('state').in(['ACTIVO']).sort('-created').populate('user', 'displayName').exec(function(err, eventos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventos);
		}
	});
};

/**
 * Evento middleware
 */
exports.eventoByID = function(req, res, next, id) {
	Evento.findById(id).populate('user', 'displayName').exec(function(err, evento) {
		if (err) return next(err);
		if (! evento) return next(new Error('Failed to load Evento ' + id));
		req.evento = evento ;
		next();
	});
};

/**
 * Evento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.evento.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
