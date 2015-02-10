'use strict';

//Setting up route
angular.module('eventos').config(['$stateProvider',
    function ($stateProvider) {
        // Eventos state routing
        $stateProvider.
            state('listEventos', {
                url: '/eventos',
                templateUrl: 'modules/eventos/views/list-eventos.client.view1.html'
            }).
            state('createEvento', {
                url: '/eventos/create',
                templateUrl: 'modules/eventos/views/create-evento.client.view.html'
            }).
            state('viewEvento', {
                url: '/eventos/:eventoId',
                templateUrl: 'modules/eventos/views/view-evento.client.view.html'
            }).
            state('editEvento', {
                url: '/eventos/:eventoId/edit',
                templateUrl: 'modules/eventos/views/edit-evento.client.view.html'
            }).
//            state('viewEvento', {
//                url: '/eventos/:eventoId',
//                templateUrl: 'modules/eventos/views/view-evento.client.view.html'
//            }).
//            state('viewEvento', {
//                url: '/eventos/:eventoId',
//                templateUrl: 'modules/eventos/views/view-evento.client.view.html'
//            }).
            state('aprobadosEvento', {
                url: '/eventos/aprobados',
                templateUrl: 'modules/eventos/views/list-eventos.client.view.html'
            });
    }
]);