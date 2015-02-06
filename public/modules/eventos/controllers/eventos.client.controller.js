'use strict';

// Eventos controller
angular.module('eventos').controller('EventosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Eventos', '$modal', '$log', '$http',
    function ($scope, $stateParams, $location, Authentication, Eventos, $modal, $log, $http) {
        $scope.aprobado = false;

        $scope.authentication = Authentication;
//        $scope.evento.actividades=[];
        $scope.actividades = [];

        $scope.actdata = '';
        $scope.addTodo = function (t) {
            if (t) {
//                var index = $scope.actividades.indexOf($scope.actdata);
//                $scope.actividades.splice(index, 1);
                $scope.actividades.push($scope.actdata);
            } else {
//                var index = $scope.evento.actividades.indexOf($scope.actdata);
//                $scope.evento.actividades.splice(index, 1);
                $scope.evento.actividades.push($scope.actdata);
            }
            $scope.actdata = '';

        };
        $scope.removeTodo = function (ac, y) {
            var oldTodos;
            if (y) {
                oldTodos = $scope.actividades;
                $scope.actividades = [];
                angular.forEach(oldTodos, function (todo) {
                    if (todo !== ac) $scope.actividades.push(todo);
                });
            } else {
                oldTodos = $scope.evento.actividades;
                $scope.evento.actividades = [];
                angular.forEach(oldTodos, function (todo) {
                    if (todo !== ac) $scope.evento.actividades.push(todo);
                });
            }

        };

        $scope.openD = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
        $scope.open = function ($event) {
            $location.path('comites/create');
        };

        // Create new Evento
        $scope.create = function () {
            // Create new Evento object
            var evento = new Eventos({
                name: this.name,
                objectives: this.objectives,
                place: this.place,
                actividades: this.actividades
            });

            // Redirect after save
            evento.$save(function (response) {
                $location.path('eventos/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Evento
        $scope.remove = function (evento) {
            if (evento) {
                evento.$remove();

                for (var i in $scope.eventos) {
                    if ($scope.eventos [i] === evento) {
                        $scope.eventos.splice(i, 1);
                    }
                }
            } else {
                $scope.evento.$remove(function () {
                    $location.path('eventos');
                });
            }
        };

        // Update existing Evento
        $scope.update = function () {
            var evento = $scope.evento;

            evento.$update(function () {
//                $location.path('eventos');
                $location.path('eventos/' + evento._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        // Update existing Evento
        $scope.aprobar = function () {
            var evento = $scope.evento;
            evento.approved ='APROBADO';


            evento.$update(function () {
//                $location.path('eventos');
                $scope.aprobado = true;

                $location.path('eventos/' + evento._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Eventos
        $scope.find = function () {
            $scope.eventos = Eventos.query();
        };

        // Find existing Evento
        $scope.findOne = function () {
            $scope.evento = Eventos.get({
                eventoId: $stateParams.eventoId
            });
            if ($scope.evento.approved === 'APROBADO') {
                $scope.aprobado = true;
            }

//            $scope.obtcomiteevento();
        };
        $scope.obtcomiteevento = function () {
            return $http.get(
                '/comites/eventoadded',
                {params: {eventoid: $stateParams.eventoId}}
            ).then(function (response) {
//                    console.log(response);
                    $scope.comitesevent = response.data;
                    $scope.evento.comites = response.data;
                });
        };
        $scope.findView = function () {
            $scope.findOne();
            $scope.obtcomiteevento();
        };
    }
]);