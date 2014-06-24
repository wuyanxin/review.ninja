
var async = require('async');
var express = require('express');

var github = require('../services/github');

//////////////////////////////////////////////////////////////////////////////////////////////
// Tool controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/vote/:uuid/:comm', function(req, res) {

	var Tool = require('mongoose').model('Tool');
	var Repo = require('mongoose').model('Repo');
	var Vote = require('mongoose').model('Vote');

	var uuid = req.params.uuid;
	var comm = req.params.comm;
	var vote = req.body;

	if (!vote) {
		return res.send(400, 'Bad request, no data sent');
	}

	Tool.findById(uuid, function (err, tool) {

		if (err) {
			return res.send(500);
		}

		if(!tool) {
			return res.send(404, 'Tool not found');
		}

		Vote.findOne({repo: tool.repo, comm: comm, user: 'tool/' + tool.name}, function(err, previousVote) {

			if (err) {
				return res.send(500);
			}

			if(previousVote) {
				return res.send(403);
			}

			Repo.findOne({'uuid': tool.repo}, function(err, repo) {

				if (err || !repo) {
					return res.send(404, 'Repo not found');
				}

				github.call({obj: 'repos', fun: 'getCommit', arg: {user: repo.user, repo: repo.name, sha: comm}, token: repo.token}, function(err, comm) {

					if(err) {
						return res.send(err.code, err.message.message);
					}

					var queue = [];

					if(vote.comments) {
						vote.comments.forEach(function(c) {
							queue.push(function(done) {
								github.call({obj: 'repos', fun: 'createCommitComment', arg: {
									user: repo.user,
									repo: repo.name,
									sha: comm.sha,
									commit_id: comm.sha,
									body: c.body,
									path: c.path,
									line: c.line
								}, token: repo.token}, done);
							});
						});
					}

					if(vote.vote) {
						queue.push(function(done) {
							github.call({obj: 'repos', fun: 'createCommitComment', arg: {
								user: repo.user,
								repo: repo.name,
								sha: comm.sha,
								commit_id: comm.sha,
								body: vote.vote + '\n\n' + 'On behalf of ' + tool.name
							}, token: repo.token}, done);
						});
						queue.push(function(done) {
							Vote.update({repo: repo.uuid, comm: comm.sha, user: 'tool/' + tool.name}, {vote: vote.vote}, {upsert: true}, function(err, vote) {
								if(!err) {
									require('../bus').emit('vote:add', {
										user: repo.user,
										repo: repo.name,
										comm: comm,
										token: repo.token
									});
								}
								done();
							});
						});
					}

					async.parallel(queue, function() {
						res.send(201);
					});
				
				});

			});
		});
	});
});

module.exports = router;