var mongoose = require('mongoose');
var keenio = require('../services/keenio');

var MilestoneSchema = mongoose.Schema({
    pull: Number,
    repo: Number,
    number: Number
});

MilestoneSchema.post('save', function(doc) {
    keenio.client.addEvent('milestoneDocument', { doc: doc._doc, action: 'save' });
});

MilestoneSchema.post('remove', function(doc) {
    keenio.client.addEvent('milestoneDocument', { doc: doc._doc, action: 'remove' });
});

MilestoneSchema.index({
    repo: 1,
    number: 1
}, {
    unique: true
});

var Milestone = mongoose.model('Milestone', MilestoneSchema);

module.exports = {
    Milestone: Milestone
};
