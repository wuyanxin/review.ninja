module.exports = {

    pull_request_label : function(labels) {

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

    }

};