'use strict';

// Comites controller
angular.module('comites').controller('ComitesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Comites',
	function($scope, $stateParams, $location, Authentication, Comites) {
		$scope.authentication = Authentication;

		// Create new Comite
		$scope.create = function() {
			// Create new Comite object
			var comite = new Comites ({
				name: this.name,
                is_organizer: this.is_organizer,
				date: this.date
			});

			// Redirect after save
			comite.$save(function(response) {
				$location.path('comites/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Comite
		$scope.remove = function(comite) {
			if ( comite ) { 
				comite.$remove();

				for (var i in $scope.comites) {
					if ($scope.comites [i] === comite) {
						$scope.comites.splice(i, 1);
					}
				}
			} else {
				$scope.comite.$remove(function() {
					$location.path('comites');
				});
			}
		};

		// Update existing Comite
		$scope.update = function() {
			var comite = $scope.comite;

			comite.$update(function() {
				$location.path('comites/' + comite._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Comites
		$scope.find = function() {
			$scope.comites = Comites.query();
		};

		// Find existing Comite
		$scope.findOne = function() {
			$scope.comite = Comites.get({ 
				comiteId: $stateParams.comiteId
			});
		};
	}
]);