'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Comite = mongoose.model('Comite'),
	_ = require('lodash');

/**
 * Create a Comite
 */
exports.create = function(req, res) {
	var comite = new Comite(req.body);
	comite.user = req.user;

	comite.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comite);
		}
	});
};

/**
 * Show the current Comite
 */
exports.read = function(req, res) {
	res.jsonp(req.comite);
};

/**
 * Update a Comite
 */
exports.update = function(req, res) {
	var comite = req.comite ;

	comite = _.extend(comite , req.body);

	comite.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comite);
		}
	});
};

/**
 * Delete an Comite
 */
exports.delete = function(req, res) {

    var comite = req.comite ;
    comite.state=['INACTIVO'];
    comite.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comite);
        }
    });
};

/**
 * List of Comites
 */
exports.list = function(req, res) { 
	Comite.find().where('state').in(['ACTIVO']).sort('-created').populate('user', 'displayName').exec(function(err, comites) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comites);
		}
	});
};

/**
 * Comite middleware
 */
exports.comiteByID = function(req, res, next, id) { 
	Comite.findById(id).populate('user', 'displayName').exec(function(err, comite) {
		if (err) return next(err);
		if (! comite) return next(new Error('Failed to load Comite ' + id));
		req.comite = comite ;
		next();
	});
};

/**
 * Comite authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comite.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
