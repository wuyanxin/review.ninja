var mongoose = require('mongoose');
var keenio = require('../services/keenio');

var RepoSchema = mongoose.Schema({
    repo: Number,
    comment: {type: Boolean, default: true},
    threshold: {type: Number, min: 1, default: 1}
});

RepoSchema.post('save', function(doc) {
    keenio.client.addEvent('repoDocument', { doc: doc._doc, action: 'save' });
});

RepoSchema.post('remove', function(doc) {
    keenio.client.addEvent('repoDocument', { doc: doc._doc, action: 'remove' });
});

var Repo = mongoose.model('Repo', RepoSchema);

module.exports = {
    Repo: Repo
};
