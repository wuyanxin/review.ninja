var mongoose = require('mongoose');

var ActionSchema = mongoose.Schema({
    uuid: Number,
    user: String,
    repo: String,
    type: String
});

ActionSchema.index({
    user: 1,
    repo: 1,
    type: 1
}, {
    unique: false
});

var Action = mongoose.model('Action', ActionSchema);

module.exports = {
    Action: Action
};
