// home test
describe('Home Controller', function() {

	var scope, httpBackend, createCtrl;

	beforeEach(angular.mock.module('app'));

	beforeEach(angular.mock.module('templates'));

	beforeEach(angular.mock.inject(function ($injector, $rootScope, $controller) {

		httpBackend = $injector.get('$httpBackend');

		scope = $rootScope.$new();

		createCtrl = function() {
			return $controller('HomeCtrl', {
				$scope: scope
			});
		}
	}));

	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

	it('should toggle off', function() {

		var ctrl = createCtrl();

		// load the data

		httpBackend.expect('POST', '/api/github/call', '{"obj":"user","fun":"get"}').respond({
			data: {
				login: 'me'
			}
		});

		httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getAll","arg":{"type":"all"}}').respond({
			data: [
				{
					id: 1,
					name: 'repo-1',
					owner: {
						login: 'me'
					},
				}
			]
		});

		httpBackend.expect('POST', '/api/repo/get', '{"user":"me","repo":"repo-1","uuid":1}').respond({
			name: 'repo-1',
			ninja: true,
			user: 'me',
			uuid: 1
		});

		httpBackend.flush();


		// now toggle the repo

		scope.repos.value[0].ninja.ninja = !scope.repos.value[0].ninja.ninja;

		scope.toggle( scope.repos.value[0] );

		httpBackend.expect('POST', '/api/repo/rmv', '{"user":"me","repo":"repo-1","uuid":1}').respond({
			name: 'repo-1',
			ninja: false,
			user: 'me',
			uuid: 1
		});

		httpBackend.flush();

		scope.repos.value[0].ninja.ninja.should.be.exactly.false;
	});

	it('should toggle on', function() {

		var ctrl = createCtrl();

		// load the data

		httpBackend.expect('POST', '/api/github/call', '{"obj":"user","fun":"get"}').respond({
			data: {
				login: 'me'
			}
		});

		httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getAll","arg":{"type":"all"}}').respond({
			data: [
				{
					id: 2,
					name: 'repo-2',
					owner: {
						login: 'me'
					}
				}
			]
		});

		httpBackend.expect('POST', '/api/repo/get', '{"user":"me","repo":"repo-2","uuid":2}').respond({
			'name': 'repo-2',
			'ninja': false,
			'user': 'me',
			'uuid': 2
		});

		httpBackend.flush();


		// now toggle the repo

		scope.repos.value[0].ninja.ninja = !scope.repos.value[0].ninja.ninja;

		scope.toggle( scope.repos.value[0] );

		httpBackend.expect('POST', '/api/repo/add', '{"user":"me","repo":"repo-2","uuid":2}').respond({
			name: 'repo-2',
			ninja: true,
			user: 'me',
			uuid: 1
		});

		httpBackend.flush();

		scope.repos.value[0].ninja.ninja.should.be.exactly.true;
	});


});