var parse = require('parse-diff');

module.exports = {
    
    getFiles: function(args, files, done) {
        files.forEach(function(file) {
            file.patch = parse(file.patch);
        });

        done(null, files);
    }
};