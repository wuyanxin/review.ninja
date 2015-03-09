'use strict';
exports.id = '1.1.0_1';

exports.up = function (done) {

    var Milestones = this.db.collection('milestones');

    Milestones.dropIndex({repo: 1, number: 1});

    Milestones.ensureIndex({pull: 1, repo: 1}, {unique: true}, done);
};
