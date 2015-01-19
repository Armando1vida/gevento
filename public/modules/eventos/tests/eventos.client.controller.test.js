'use strict';

(function() {
	// Eventos Controller Spec
	describe('Eventos Controller Tests', function() {
		// Initialize global variables
		var EventosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Eventos controller.
			EventosController = $controller('EventosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Evento object fetched from XHR', inject(function(Eventos) {
			// Create sample Evento using the Eventos service
			var sampleEvento = new Eventos({
				name: 'New Evento'
			});

			// Create a sample Eventos array that includes the new Evento
			var sampleEventos = [sampleEvento];

			// Set GET response
			$httpBackend.expectGET('eventos').respond(sampleEventos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eventos).toEqualData(sampleEventos);
		}));

		it('$scope.findOne() should create an array with one Evento object fetched from XHR using a eventoId URL parameter', inject(function(Eventos) {
			// Define a sample Evento object
			var sampleEvento = new Eventos({
				name: 'New Evento'
			});

			// Set the URL parameter
			$stateParams.eventoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/eventos\/([0-9a-fA-F]{24})$/).respond(sampleEvento);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.evento).toEqualData(sampleEvento);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Eventos) {
			// Create a sample Evento object
			var sampleEventoPostData = new Eventos({
				name: 'New Evento'
			});

			// Create a sample Evento response
			var sampleEventoResponse = new Eventos({
				_id: '525cf20451979dea2c000001',
				name: 'New Evento'
			});

			// Fixture mock form input values
			scope.name = 'New Evento';

			// Set POST response
			$httpBackend.expectPOST('eventos', sampleEventoPostData).respond(sampleEventoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Evento was created
			expect($location.path()).toBe('/eventos/' + sampleEventoResponse._id);
		}));

		it('$scope.update() should update a valid Evento', inject(function(Eventos) {
			// Define a sample Evento put data
			var sampleEventoPutData = new Eventos({
				_id: '525cf20451979dea2c000001',
				name: 'New Evento'
			});

			// Mock Evento in scope
			scope.evento = sampleEventoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/eventos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/eventos/' + sampleEventoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid eventoId and remove the Evento from the scope', inject(function(Eventos) {
			// Create new Evento object
			var sampleEvento = new Eventos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Eventos array and include the Evento
			scope.eventos = [sampleEvento];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/eventos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEvento);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.eventos.length).toBe(0);
		}));
	});
}());