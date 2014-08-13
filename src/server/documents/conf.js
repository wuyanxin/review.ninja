var mongoose = require('mongoose');
var withHelper = require('./with');

var ConfSchema = mongoose.Schema({
    user: String,
    repo: String,
    notifications: {type: Object, default: {pull_request: false, issue: false, star: false}},
    watch: Array
});

ConfSchema.plugin(withHelper);

var Conf = mongoose.model('Conf', ConfSchema);

module.exports = {
    Conf: Conf
};
