var mongoose = require('mongoose');
var withHelper = require('./with');

var UserSchema = mongoose.Schema({
    uuid: Number,
    repos: Array,
    token: String
});

UserSchema.plugin(withHelper);

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};
