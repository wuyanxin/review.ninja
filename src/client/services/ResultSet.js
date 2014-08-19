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

        this.loaded = true;
        this.loading = false;

        this.error = error;
        this.value = value;

        if(meta) {

            $HUB = $injector.get('$HUB');

            this.hasNextPage = meta.hasNextPage;

            this.hasPreviousPage = meta.hasPreviousPage;

            this.getNextPage = this.hasNextPage ? function(done) {

                $HUB.call('page', 'getNextPage', { link: meta.link }, function(err, res) {

                    angular.extend(self, res);

                    if (typeof done === 'function') {
                        done(err, res);
                    }
                });

            } : null;

            this.getPreviousPage = this.hasPreviousPage ? function(done) {

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
