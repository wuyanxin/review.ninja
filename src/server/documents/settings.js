var mongoose = require('mongoose');
var withHelper = require('./with');

var SettingsSchema = mongoose.Schema({
    user: String,
    repo: String,
    notifications: {type: Object, default: {pull_request: false, issue: false, star: false}},
    watch: Array
});

SettingsSchema.plugin(withHelper);

var Settings = mongoose.model('Settings', SettingsSchema);

module.exports = {
    Settings: Settings
};
