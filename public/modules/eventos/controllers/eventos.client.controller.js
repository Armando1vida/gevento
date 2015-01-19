'use strict';

// Eventos controller
angular.module('eventos').controller('EventosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Eventos',
	function($scope, $stateParams, $location, Authentication, Eventos) {
		$scope.authentication = Authentication;

		// Create new Evento
		$scope.create = function() {
			// Create new Evento object
			var evento = new Eventos ({
				name: this.name
			});

			// Redirect after save
			evento.$save(function(response) {
				$location.path('eventos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Evento
		$scope.remove = function(evento) {
			if ( evento ) { 
				evento.$remove();

				for (var i in $scope.eventos) {
					if ($scope.eventos [i] === evento) {
						$scope.eventos.splice(i, 1);
					}
				}
			} else {
				$scope.evento.$remove(function() {
					$location.path('eventos');
				});
			}
		};

		// Update existing Evento
		$scope.update = function() {
			var evento = $scope.evento;

			evento.$update(function() {
				$location.path('eventos/' + evento._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Eventos
		$scope.find = function() {
			$scope.eventos = Eventos.query();
		};

		// Find existing Evento
		$scope.findOne = function() {
			$scope.evento = Eventos.get({ 
				eventoId: $stateParams.eventoId
			});
		};
	}
]);