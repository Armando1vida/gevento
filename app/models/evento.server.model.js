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
//    user: {
//        type: Schema.ObjectId,
//        ref: 'User'
//    },
    objectives: {
        type: String,
        default: '',
        required: 'Please fill Evento objectives',
        trim: true
    },
    approved: {
        type: [
            {
                type: String,
                enum: ['EN_PLANEACION', 'POR_APROBAR', 'APROBADO']
            }
        ],
        default: ['EN_PLANEACION']
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
    date: {
        type: Date,
        default: Date.now,
        required: 'Please fill Evento Date'
    },
    place: {
        type: String,
        default: '',
        required: 'Please fill Evento Place',
        trim: true
    },
    actividades: {
        type: [
            {type: String}
        ]
    }

});
mongoose.model('Evento', EventoSchema);