
// *****************************************************
// API
// *****************************************************


module.factory("$RPC", ['$http', '$q', function($http, $q) {
	return {
		call: function(m, f, d, c) {
			var res = {value: null, error: null, loaded: false, loading: true};
			$http.post("/api/"+m+"/"+f, d)
				.success(function(value) {
					res.value = value;
					res.loaded = true;
					res.loading = false;
					console.log("[success]", m, f, d, res);
					if(typeof c === 'function') {
						c(null, res);
					}
				})
				.error(function(value) {
					res.error = value;
					res.loaded = true;
					res.loading = false;
					console.log("[error]", m, f, d, res);
					if(typeof c === 'function') {
						c(res.error, res);
					}
				});
			return res;
		}
	};
}]);


module.factory("$HUB", ['$RPC', function($RPC) {
	return {
		call: function(o, f, d, c) {
			return $RPC.call('github', 'call', {obj: o, fun: f, arg: d}, c);
		}
	};
}]);


// *****************************************************
// Angular Route Provider Resolve Promises
// *****************************************************


module.factory('$HUBService', ['$q', '$HUB', function($q, $HUB) {
	return {
		call: function(o, f, d) {
			var deferred = $q.defer();
			$HUB.call(o, f, d, function(err, obj) {
				if(err) {
					deferred.reject();
				}
				else {
					deferred.resolve(obj);
				}
			});
			return deferred.promise;
		}
	};
}]);


// module.factory("$RepoService", ['$q', '$HUB', function($q, $HUB) {
// 	return {
// 		repo: function(user, repo) {
// 			var deferred = $q.defer();
// 			$HUB.call('repos', 'get', {
// 				user: user,
// 				repo: repo
// 			}, function(err, obj) {
// 				if(err) {
// 					deferred.reject();
// 				}
// 				else {
// 					deferred.resolve(obj);
// 				}
// 			});
// 			return deferred.promise;
// 		}
// 	};
// }]);


// module.factory("$CommService", ['$q', '$HUB', function($q, $HUB) {
// 	return {
// 		comm: function(user, repo, sha) {
// 			var deferred = $q.defer();
// 			$HUB.call('repos', 'get', {
// 				user: user,
// 				repo: repo,
// 				sha: sha
// 			}, function(err, obj) {
// 				if(err) {
// 					deferred.reject();
// 				}
// 				else {
// 					deferred.resolve(obj);
// 				}
// 			});
// 			return deferred.promise;
// 		}
// 	};
// }]);


// *****************************************************
// Event Bus
// *****************************************************


module.factory('$EventBus', ['$rootScope', function($rootScope) {
	return {
		emit: function(type, data) {
			$rootScope.$emit(type, data);
		},
		on: function(type, func, scope) {
			var unbind = $rootScope.$on(type, func);
			if(scope) {
				scope.$on('$destroy', unbind);
			}
		}
	};
}]);


// *****************************************************
// Event Bus
// *****************************************************


module.factory('$Socket', ['$rootScope', function($rootScope) {
	var socket = io.connect();
	return {
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, arguments);
					}
				});
			});
		},
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				$rootScope.$apply(function () {
					callback.apply(socket, arguments);
				});
			});
		}
	};
}]);
