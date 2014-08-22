var mongoose = require('mongoose');
var withHelper = require('./with');

var StarSchema = mongoose.Schema({
    sha: String,
    repo: Number,
    user: Number,
    name: String,
});

StarSchema.plugin(withHelper);

StarSchema.index({
    sha: 1,
    repo: 1,
    user: 1
}, {
    unique: true
});

var Star = mongoose.model('Star', StarSchema);

module.exports = {
    Star: Star
};
