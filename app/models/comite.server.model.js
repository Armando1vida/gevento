'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comite Schema
 */
var ComiteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Comite name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    state: {
        type: [
            {
                type: String,
                enum: ['ACTIVO', 'INACTIVO']
            }
        ],
        default: ['ACTIVO']
    },
    evento: {
        type: String,
        ref: 'Evento'
    },
    is_organizer: {
        type: Boolean,
        default: false,
        required: 'Please fill Comite is organizer'
    }
});

mongoose.model('Comite', ComiteSchema);