'use strict';

(function() {
	// Comites Controller Spec
	describe('Comites Controller Tests', function() {
		// Initialize global variables
		var ComitesController,
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

			// Initialize the Comites controller.
			ComitesController = $controller('ComitesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Comite object fetched from XHR', inject(function(Comites) {
			// Create sample Comite using the Comites service
			var sampleComite = new Comites({
				name: 'New Comite'
			});

			// Create a sample Comites array that includes the new Comite
			var sampleComites = [sampleComite];

			// Set GET response
			$httpBackend.expectGET('comites').respond(sampleComites);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.comites).toEqualData(sampleComites);
		}));

		it('$scope.findOne() should create an array with one Comite object fetched from XHR using a comiteId URL parameter', inject(function(Comites) {
			// Define a sample Comite object
			var sampleComite = new Comites({
				name: 'New Comite'
			});

			// Set the URL parameter
			$stateParams.comiteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/comites\/([0-9a-fA-F]{24})$/).respond(sampleComite);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.comite).toEqualData(sampleComite);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Comites) {
			// Create a sample Comite object
			var sampleComitePostData = new Comites({
				name: 'New Comite'
			});

			// Create a sample Comite response
			var sampleComiteResponse = new Comites({
				_id: '525cf20451979dea2c000001',
				name: 'New Comite'
			});

			// Fixture mock form input values
			scope.name = 'New Comite';

			// Set POST response
			$httpBackend.expectPOST('comites', sampleComitePostData).respond(sampleComiteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Comite was created
			expect($location.path()).toBe('/comites/' + sampleComiteResponse._id);
		}));

		it('$scope.update() should update a valid Comite', inject(function(Comites) {
			// Define a sample Comite put data
			var sampleComitePutData = new Comites({
				_id: '525cf20451979dea2c000001',
				name: 'New Comite'
			});

			// Mock Comite in scope
			scope.comite = sampleComitePutData;

			// Set PUT response
			$httpBackend.expectPUT(/comites\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/comites/' + sampleComitePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid comiteId and remove the Comite from the scope', inject(function(Comites) {
			// Create new Comite object
			var sampleComite = new Comites({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Comites array and include the Comite
			scope.comites = [sampleComite];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/comites\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleComite);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.comites.length).toBe(0);
		}));
	});
}());