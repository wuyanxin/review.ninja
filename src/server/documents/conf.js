var mongoose = require('mongoose');
var withHelper = require('./with');

var ConfSchema = mongoose.Schema({
    user: String,
    repo: String,
    notes: Array, 
    watch: Array
});

ConfSchema.plugin(withHelper);

var Conf = mongoose.model('Conf', ConfSchema);

module.exports = {
    Conf: Conf
};