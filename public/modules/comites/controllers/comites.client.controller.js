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
}).controller('ComitesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Comites', 'Eventos', '$modal', '$log', '$http',
    function ($scope, $stateParams, $location, Authentication, Comites, Eventos, $modal, $log, $http) {

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function (size) {
//            $scope.test();

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    comiteid: function () {
                        return $stateParams.comiteId;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $scope.obtusercomite();
            });
        };

        $scope.authentication = Authentication;
        $scope.event = {};
        // Create new Comite
        $scope.create = function () {

            var comite = new Comites({
                name: this.name,
                is_organizer: this.is_organizer,
                evento: $scope.event.selected._id
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
        // Remove existing Comite
        $scope.removeFromComite = function (user) {
            if (user) {
                $http.put('/comites/removeuser/', {params: {comiteid: $stateParams.comiteId, userid: user._id}})
                    .success(function (data) {
                        $scope.obtusercomite();
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
                for (var i in   $scope.userscomite) {
                    if ($scope.userscomite  [i] === user) {
                        $scope.userscomite.splice(i, 1);
                    }
                }
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
            $scope.obtusercomite();
            $scope.comite = Comites.get({
                comiteId: $stateParams.comiteId
            });
        };
        $scope.obtusercomite = function () {
            return $http.get(
                '/users/comiteadded',
                {params: {comiteid: $stateParams.comiteId}}
            ).then(function (response) {
                    $scope.userscomite = response.data;
                    $scope.comite.users = $scope.userscomite;
                });
        };
    }
]).controller('ModalInstanceCtrl', function ($scope, $modalInstance, comiteid, $http) {
    $scope.comiteid = comiteid;

    $scope.selection = [];

    $scope.toggleSelection = function toggleSelection(usert) {
        var idx = $scope.selection.indexOf(usert);
        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.selection.push(usert);
        }
    };
    $scope.ok = function () {
        $http.post('/comites/adduser', {comiteid: $scope.comiteid, users: $scope.selection})
            .success(function (data) {
                $modalInstance.dismiss('cancel');
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
// Find existing Comite
    $scope.test = function () {
        return $http.get(
            '/users/comite',
            {params: {comiteid: $scope.comiteid}}
        ).then(function (response) {
                $scope.usersnocomite = response.data;
            });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
