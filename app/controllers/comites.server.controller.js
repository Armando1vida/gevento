'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Comite = mongoose.model('Comite'),
    Evento = mongoose.model('Evento'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Create a Comite
 */
exports.create = function (req, res) {
    var comite = new Comite(req.body);
    comite.user = req.user;
    comite.save(function (err) {
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
exports.read = function (req, res) {
    res.jsonp(req.comite);
};

/**
 * Update a Comite
 */
exports.update = function (req, res) {
    var comite = req.comite;

    comite = _.extend(comite, req.body);

    comite.save(function (err) {
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
exports.delete = function (req, res) {

    var comite = req.comite;
    comite.state = ['INACTIVO'];
    comite.save(function (err) {
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
exports.list = function (req, res) {
    Comite.find().where('state').in(['ACTIVO']).sort('-created').populate('user', 'displayName').populate('evento', 'name').exec(function (err, comites) {
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
exports.comiteByID = function (req, res, next, id) {
    Comite.findById(id).populate('user', 'displayName').populate('evento', 'name').exec(function (err, comite) {
        if (err) return next(err);
        if (!comite) return next(new Error('Failed to load Comite ' + id));
        req.comite = comite;
        next();
    });
};

/**
 * Comite authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.comite.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
/**
 * Update a Comite
 */
exports.addusers = function (req, res) {
    Comite.findById(req.body.comiteid).exec(function (err, comite) {
        var userold = comite.users;
        userold = userold.concat(req.body.users);
        comite.users = userold;
        comite.users = comite.users.filter(function (item, i, ar) {
            return ar.indexOf(item) === i;
        });
        console.log(comite.users);
        comite.save(function (err) {
            User.find().
                where('_id').in(comite.users)
                .exec(function (erre, users) {
                    users.forEach(function (user) {
                        var comitesold = user.comites;
                        comitesold = comitesold.concat([req.body.comiteid]);
                        user.comites = comitesold;
                        user.comites = user.comites.filter(function (item, i, ar) {
                            return ar.indexOf(item) === i;
                        });
                        user.save(function (err) {
                            if (err) return;
                        });
                    });
                });
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(comite);
            }
        });
    });


};
/**
 * Update a Comite
 */
exports.removeuser = function (req, res) {
//    console.log(req);
    Comite.findById(req.body.params.comiteid).exec(function (err, comite) {
        var index = comite.users.indexOf(req.body.params.userid);
        comite.users.splice(index, 1);
        comite.save(function (err) {
            User.findById(req.body.params.userid).exec(function (erre, user) {
                var index = user.comites.indexOf(req.body.params.comiteid);
                user.comites.splice(index, 1);
                user.save(function (err) {
                    if (err) return;
                });
            });
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(comite);
            }
        });
    });
};
/**
 * Send User
 */
exports.byevento = function (req, res) {
    Comite.find().
        where('evento').ne(req.query.eventoid)
        .exec(function (err, comites) {
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
 * Send User
 */
exports.byeventoadd = function (req, res) {
    Comite.find().
        where('evento').equals(req.query.eventoid)
        .exec(function (err, comites) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(comites);
            }
        });
};