'use strict';

//Comites service used to communicate Comites REST endpoints
angular.module('comites').factory('Comites', ['$resource',
	function($resource) {
		return $resource('comites/:comiteId', { comiteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);