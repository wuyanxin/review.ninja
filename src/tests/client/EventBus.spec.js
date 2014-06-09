
// $EventBus test
describe('$EventBus test', function() {

	// Given
	var scope;
	var eventBus;

	// Load app module
	beforeEach(angular.mock.module('app'));

	// Load scope and eventBus
	beforeEach(angular.mock.inject(function ($injector, $controller, $rootScope, $location, $httpBackend) {
		scope = $rootScope.$new();
	    eventBus = $injector.get('$EventBus');
	}));

	// The must be a scope to proceed
	it('should have a scope', function () {
		Should(scope).be.ok;
	});

	// There must be a eventBus to proceed
	it('should have a eventBus', function () {
		Should(eventBus).be.ok;
	});

	// There must be an eventBus to proceed
	it('should have an eventBus', function () {
		Should(eventBus).be.ok;
	});

	// Test emmitting events
	it('should receive event', function () {

		var eventCatched = false;

		// Define topic
		eventBus.on("testTopic", function (type, data) {
			eventCatched = true;
		}, scope);

		// Emit event to topic
		eventBus.emit("testTopic", "something");

		// Test
		Should(eventCatched).not.be.false;
	});


	// Test emmitting events
	it('should receive correct data', function () {
		var correctDataReceived = false;

		// Given
		var givenData = "Hello World";

		// Define topic
		eventBus.on("testTopic", function (type, receivedData) {
			correctDataReceived = receivedData === givenData;
		}, scope);

		// Emit event to topic
		eventBus.emit("testTopic", givenData);

		// Test
		Should(correctDataReceived).not.be.false;
	});
});