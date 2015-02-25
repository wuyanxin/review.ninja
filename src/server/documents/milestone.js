var mongoose = require('mongoose');

var MilestoneSchema = mongoose.Schema({
    id: Number,
    pull: Number,
    repo: Number,
    number: Number
});

MilestoneSchema.index({
    id: 1,
    number: 1
}, {
    unique: true
});

var Milestone = mongoose.model('Milestone', MilestoneSchema);

module.exports = {
    Milestone: Milestone
};
