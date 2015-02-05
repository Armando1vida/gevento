'use strict';

// Comites controller
angular.module('comites').filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
}).controller('ComitesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Comites', 'Eventos', '$modal', '$log',
    function ($scope, $stateParams, $location, Authentication, Comites, Eventos, $modal, $log) {

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                console.log('ec');
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.authentication = Authentication;
        $scope.event = {};
        // Create new Comite
        $scope.create = function () {

            var comite = new Comites({
                name: this.name,
                is_organizer: this.is_organizer,
                evento: $scope.event.selected
            });
//            console.log(comite);
//            return;
            // Redirect after save
            comite.$save(function (response) {
                $location.path('comites/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Comite
        $scope.remove = function (comite) {
            if (comite) {
                comite.$remove();

                for (var i in $scope.comites) {
                    if ($scope.comites [i] === comite) {
                        $scope.comites.splice(i, 1);
                    }
                }
            } else {
                $scope.comite.$remove(function () {
                    $location.path('comites');
                });
            }
        };

        // Update existing Comite
        $scope.update = function () {
            var comite = $scope.comite;

            comite.$update(function () {
                $location.path('comites/' + comite._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Comites
        $scope.find = function () {
            $scope.comites = Comites.query();
        };
        // Find a list of Comites
        $scope.findEvents = function () {
            $scope.eventos = Eventos.query();

        };

        // Find existing Comite
        $scope.findOne = function () {
            $scope.findEvents();
            $scope.comite = Comites.get({
                comiteId: $stateParams.comiteId
            });
        };
    }
]).controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
