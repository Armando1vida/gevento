'use strict';

//Setting up route
angular.module('comites').config(['$stateProvider',
	function($stateProvider) {
		// Comites state routing
		$stateProvider.
		state('listComites', {
			url: '/comites',
			templateUrl: 'modules/comites/views/list-comites.client.view.html'
		}).
		state('createComite', {
			url: '/comites/create',
			templateUrl: 'modules/comites/views/create-comite.client.view.html'
		}).
		state('viewComite', {
			url: '/comites/:comiteId',
			templateUrl: 'modules/comites/views/view-comite.client.view.html'
		}).
		state('editComite', {
			url: '/comites/:comiteId/edit',
			templateUrl: 'modules/comites/views/edit-comite.client.view.html'
		});
	}
]);