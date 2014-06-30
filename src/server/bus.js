
var mongoose = require('mongoose');
var github = require('./services/github');

module.exports = new (require('events').EventEmitter)();

module.exports.on('vote:add', function(vote) {

	var mapping = {
		'approved': 'success',
		'rejected': 'failure',
		'pending': 'pending'
	};

	var approval = require('./services/approval');

	Comm.with({repoUuid: vote.uuid, commUuid: vote.comm, token: vote.token}, function(err, comm) {

		approval(vote.comm, function(err, approval) {
			// update database
			if(approval === 'approved' || approval === 'rejected') {
				if(comm.approval !== approval) {
					comm.approval = approval;
					comm.save(function(err) {
						module.exports.emit('comm:approval', approval);
					});
				}
			}
			// update github status
			github.call({
				obj: 'statuses',
				fun: 'create',
				arg: {
					user: vote.user,
					repo: vote.repo,
					sha: vote.comm,
					state: mapping[approval],
					context: 'code-review/review.ninja',
					target_url: 'http://review.ninja/dtornow/review.ninja/sha'
				},
				token: vote.token
			}, function(err) {

			});
		});
	});
});

module.exports.on('comm:approval', function(vote) {

	console.log('new approval', vote);

});

//////////////////////////////////////////////////////////////////////////////////////////////
// Local helper
//////////////////////////////////////////////////////////////////////////////////////////////

var Comm = {
	with: function(args, done) {

		var github = require('./services/github');
		var mongod = require('mongoose').model('Comm');

		mongod.with({repo: args.repoUuid, uuid: args.commUuid}, function(err, mcomm) {

			if(err) {
				return done(err);
			}

			if(!mcomm) {

				github.call({
					obj: 'repos',
					fun: 'one',
					arg: {
						id: args.repoUuid
					},
					token: args.token
				}, function(err, grepo) {

					if(err) {
						return done(err);
					}

					github.call({
						obj: 'repos',
						fun: 'one',
						arg: {
							id: args.repoUuid
						}
					}, function(err, grepo) {

						github.call({obj: 'repos', fun: 'getContent', arg: {
							user: grepo.owner.login,
							repo: grepo.name,
							ref: args.commUuid,
							path: '.ninja.json'
						}, token: args.token}, function(err, gfile) {
							
							var content;

							try {
								content = new Buffer(gfile.content, 'base64').toString();
							} catch(ex) {
								content = null;
							}

							mongod.with({repo: args.repoUuid, uuid: args.commUuid}, {repo: args.repoUuid, uuid: args.commUuid, ninja: content}, function(err, mcomm) {
								return done(null, mcomm);
							});

						});

					});

				});

			}
			else {
				return done(err, mcomm);
			}

		});
	}
};