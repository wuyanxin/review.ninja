
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    uuid: String,
    name: String,
    token: String
});

var User = mongoose.model('User', UserSchema);

module.exports = {
	User: User
};