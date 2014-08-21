var mongoose = require('mongoose');
var withHelper = require('./with');

var CommSchema = mongoose.Schema({
    uuid: String,
    user: String,
    repo: String
});

CommSchema.plugin(withHelper);

var Comm = mongoose.model('Comm', CommSchema);

module.exports = {
    Comm: Comm
};
