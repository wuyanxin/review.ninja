var mongoose = require('mongoose');
var withHelper = require('./with');

var StarSchema = mongoose.Schema({
    repo: Number,
    comm: String,
    user: String,
    name: String,
});

StarSchema.plugin(withHelper);

StarSchema.index({
    repo: 1,
    comm: 1,
    user: 1
}, {
    unique: true
});

var Star = mongoose.model('Star', StarSchema);

module.exports = {
    Star: Star
};
