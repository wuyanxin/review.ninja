var mongoose = require('mongoose');
var keenio = require('../services/keenio');

var SettingsSchema = mongoose.Schema({
    user: Number,
    repo: Number,
    notifications: {
        pull_request: {type: Boolean, default: false},
        issue: {type: Boolean, default: false},
        star: {type: Boolean, default: false}
    },
    watched: [String]
});

SettingsSchema.post('save', function(doc) {
    keenio.client.addEvent('settingsDocument', { doc: doc._doc, action: 'save' });
});

SettingsSchema.post('remove', function(doc) {
    keenio.client.addEvent('settingsDocument', { doc: doc._doc, action: 'remove' });
});

var Settings = mongoose.model('Settings', SettingsSchema);

module.exports = {
    Settings: Settings
};
