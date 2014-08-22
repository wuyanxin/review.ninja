var mongoose = require('mongoose');
var withHelper = require('./with');

var SettingsSchema = mongoose.Schema({
    user: String,
    repo: String,
    notifications: {
        pull_request: {type: Boolean, default: false},
        issue: {type: Boolean, default: false},
        star: {type: Boolean, default: false}
    },
    watched: [String]
});

SettingsSchema.plugin(withHelper);

var Settings = mongoose.model('Settings', SettingsSchema);

module.exports = {
    Settings: Settings
};
