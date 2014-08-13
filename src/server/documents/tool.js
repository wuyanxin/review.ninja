var mongoose = require('mongoose');
var withHelper = require('./with');

var ToolSchema = mongoose.Schema({
    uuid: String,
    name: String,
    repo: Number,
    token: String,
    enabled: {type: Boolean, default: true}
});

ToolSchema.plugin(withHelper);

var Tool = mongoose.model('Tool', ToolSchema);

module.exports = {
    Tool: Tool
};
