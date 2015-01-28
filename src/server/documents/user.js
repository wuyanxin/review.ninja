var mongoose = require('mongoose');
var keenio = require('../services/keenio');

var UserSchema = mongoose.Schema({
    uuid: Number,
    repos: Array,
    token: String,
    terms: String
});

UserSchema.post('save', function(doc) {
    doc._doc.token = "";
    keenio.client.addEvent('userDocument', { doc: doc._doc, action: 'save' });
});

UserSchema.post('remove', function(doc) {
    doc._doc.token = "";
    keenio.client.addEvent('userDocument', { doc: doc._doc, action: 'remove' });
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};
