// *****************************************************
// ResultSet Factory
// *****************************************************

module.factory('ResultSet', ['$injector', function($injector) {

    function ResultSet() {

        this.loaded = false;
        this.loading = true;

    }

    ResultSet.prototype.set = function(error, value, meta) {

        var self = this;

        self.loaded = true;
        self.loading = false;

        self.error = error;
        self.value = value;

        if(meta) {

            $HUB = $injector.get('$HUB');

            self.hasNextPage = meta.hasNextPage;
            self.hasPreviousPage = meta.hasPreviousPage;

            self.getNextPage = self.hasNextPage ? function(done) {

                $HUB.call('page', 'getNextPage', { link: meta.link }, function(err, res) {

                    angular.extend(self, res);

                    if (typeof done === 'function') {
                        done(err, res);
                    }
                });

            } : null;

            self.getPreviousPage = self.hasPreviousPage ? function(done) {

                $HUB.call('page', 'getPreviousPage', { link: meta.link }, function(err, res) {

                    angular.extend(self, res);

                    if (typeof done === 'function') {
                        done(err, res);
                    }
                });

            } : null;
        }

    };

    return {
        init: function() {
            return new ResultSet();
        }
    };

}]);
