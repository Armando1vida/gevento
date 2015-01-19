'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Evento Schema
 */
var EventoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Evento name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Evento', EventoSchema);