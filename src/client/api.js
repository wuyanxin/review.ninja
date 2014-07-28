// *****************************************************
// API
// *****************************************************

function ResultSet() {

    this.loaded = false;
    this.loading = true;

}

ResultSet.prototype.set = function(error, value, meta) {

    this.loaded = true;
    this.loading = false;

    this.error = error;
    this.value = value;
    this.meta = meta;

};


module.factory('$RAW', ['$http',
    function($http) {
        return {
            call: function(m, f, d, c) {
                var now = new Date();
                return $http.post('/api/' + m + '/' + f, d)
                    .success(function(res) {
                        // parse result (again)
                        try {
                            res = JSON.parse(res);
                        } catch (ex) {}
                        // yield result
                        c(null, res, new Date() - now);
                    })
                    .error(function(res) {
                        c(res, null, new Date() - now);
                    });
            }
        };
    }
]);


module.factory('$RPC', ['$RAW', '$log',
    function($RAW, $log) {
        return {
            call: function(m, f, d, c) {
                var res = new ResultSet();
                $RAW.call(m, f, d, function(error, value) {
                    res.set(error, value);
                    $log.debug('$RPC', m, f, d, res, res.error);
                    if (typeof c === 'function') {
                        c(res.error, res);
                    }
                });
                return res;
            }
        };
    }
]);


module.factory('$HUB', ['$RAW', '$log',
    function($RAW, $log) {
        return {
            call: function(o, f, d, c) {
                var res = new ResultSet();
                $RAW.call('github', 'call', {
                    obj: o,
                    fun: f,
                    arg: d
                }, function(error, value) {
                    res.set(error, value.data, value.meta);
                    $log.debug('$HUB', o, f, d, res, res.error);
                    if (typeof c === 'function') {
                        c(res.error, res);
                    }
                });
                return res;
            }
        };
    }
]);


// *****************************************************
// Angular Route Provider Resolve Promises
// *****************************************************


module.factory('$HUBService', ['$q', '$HUB',
    function($q, $HUB) {
        return {
            call: function(o, f, d) {
                var deferred = $q.defer();
                $HUB.call(o, f, d, function(err, obj) {
                    if (err) {
                        deferred.reject();
                    } else {
                        deferred.resolve(obj);
                    }
                });
                return deferred.promise;
            }
        };
    }
]);


// *****************************************************
// Event Bus
// *****************************************************


module.factory('$EventBus', ['$rootScope',
    function($rootScope) {
        return {
            emit: function(type, data) {
                $rootScope.$emit(type, data);
            },
            on: function(type, func, scope) {
                var unbind = $rootScope.$on(type, func);
                if (scope) {
                    scope.$on('$destroy', unbind);
                }
            }
        };
    }
]);


// *****************************************************
// Event Bus
// *****************************************************


module.factory('$Socket', ['$rootScope',
    function($rootScope) {
        var socket = io.connect();
        return {
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, arguments);
                        }
                    });
                });
            },
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    $rootScope.$apply(function() {
                        callback.apply(socket, arguments);
                    });
                });
            }
        };
    }
]);
