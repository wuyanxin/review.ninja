var mongoose = require('mongoose');
var keenio = require('../services/keenio');

var StarSchema = mongoose.Schema({
    sha: String,
    repo: Number,
    user: Number,
    name: String,
    created_at: Date
});

StarSchema.post('save', function(doc) {
    keenio.client.addEvent('starDocument', { doc: doc._doc, action: 'save' });
});

StarSchema.post('remove', function(doc) {
    keenio.client.addEvent('starDocument', { doc: doc._doc, action: 'remove' });
});

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
