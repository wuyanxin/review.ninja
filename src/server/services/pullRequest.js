module.exports = {
    byLabels: function(labels) {
        var pull_request_number = null;

        for(var i=0; i<labels.length; i++){
            var reg = /pull-request-(\d*)?/;
            var match = reg.exec(labels[i].name); 

            if (match) {
                pull_request_number = match[1];
                break;
            }
        }   
        return pull_request_number;
    },

    setWatched: function(pulls, settings) {
        // set the watched pulls
        if(settings) {
            pulls.forEach(function(pull) {
                pull.watched = module.exports.isWatched(pull, settings);
            });
        }
    },

    isWatched: function(pull, settings) {
        var watched = false;

        settings.watched.forEach(function(watch) {
            // escape all regex symbols except '*'
            var watchRegex = watch.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&');
            // replace '*' with regex anything until next symbol (.*?)
            watchRegex = watchRegex.replace(/[*]/g, '(.*?)');
            var re = RegExp(watchRegex, 'g');
            if(re.exec(pull.base.ref) || re.exec(pull.head.ref)) {
                watched = true;
            }
        });
        return watched;
    }
};
