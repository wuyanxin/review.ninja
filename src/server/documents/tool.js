
var mongoose = require('mongoose');

var ToolSchema = mongoose.Schema({
    uuid: String,
    name: String,
    repo: Number,
    token: String
});

var Tool = mongoose.model('Tool', ToolSchema);

module.exports = {
	Tool: Tool
};