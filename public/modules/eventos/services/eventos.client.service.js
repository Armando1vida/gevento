'use strict';

//Eventos service used to communicate Eventos REST endpoints
angular.module('eventos').factory('Eventos', ['$resource',
	function($resource) {
		return $resource('eventos/:eventoId', { eventoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);