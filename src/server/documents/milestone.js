var mongoose = require('mongoose');

var MilestoneSchema = mongoose.Schema({
    pull: Number,
    repo: Number,
    number: Number
});

var Milestone = mongoose.model('Milestone', MilestoneSchema);

module.exports = {
    Milestone: Milestone
};
