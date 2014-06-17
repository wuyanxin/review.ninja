require('./../../trace.ninja.js');
// unit test
var assert = require('assert');
var sinon = require('sinon');
// api
var vote = require("../../../server/api/vote");
// models
var Tool = require("../../../server/documents/tool").Tool;
var Vote = require("../../../server/documents/vote").Vote;
var Repo = require("../../../server/documents/repo").Repo;

describe('tool::router.all', function () {

	// Stub database calls

	var stub_Tool_findOne = sinon.stub(Tool, "findOne", function(args, done) {

		var tool = null;

		if (!args.nullObj) {
			// Return mock tool with same id
			tool = new Tool({
			    uuid: args.uuid,
			    name: "mockName",
			    repo: "mockRepo",
			    token: "mockToken"
			});
		}

		done(null, tool);
	});

	var stub_Vote_findOne = sinon.stub(Vote, "findOne", function(args, done) {

		var vote = null;

		// If special arg is set, return a null obj
		if (!args.nullObj) {
			// args example: {repo: tool.repo, comm: comm, user: "tool/" + tool.name}
			// Return mock tool with same id
			vote = new Vote({
				repo: args.repo,
				comm: args.comm,
				user: args.user,
				vote: "mockVote"
			});
		}

		done(null, vote);
	});

	var stub_Repo_findOne = sinon.stub(Repo, "findOne", function(args, done) {

		var repo = null;

		// If special arg is set, return a null obj
		if (!args.nullObj) {
			// Return mock tool with same id
			repo = new Repo({
			    uuid: args.uuid,
			    user: "mockUser",
			    name: "mockName",
			    token: "mockToken",
			    ninja: "true"
			});
		}
		done(null, repo);

	});

	// Tests

	it('should have Tool.findOne being stubbed', function (done) {

		Tool.findOne({uuid: "someUuid"}, function(err, obj) {

			assert.equal(obj.uuid, "someUuid", "Object must exist");

			Tool.findOne({nullObj: true}, function(err, obj) {

				// Obj must not exist
				assert.equal(obj, null, "Object must not exist");
				done();
			});
		});
	});

	it('should have Vote.findOne being stubbed', function (done) {

		// Given 
		var repo = "1234";
		var comm = "abcdefgh";
		var user = "tool/mockToolName";


		Vote.findOne({repo: repo, comm: comm, user: user}, function(err, obj) {

			// Obj must exist
			assert.equal(obj.repo, repo);
			assert.equal(obj.comm, comm);
			assert.equal(obj.user, user);

			Vote.findOne({nullObj: true}, function(err, obj) {

				// Obj must not exist
				assert.equal(obj, null, "Object must not exist");
				done();
			});
		});
	});

	it('should have Repo.findOne being stubbed', function (done) {

		var repoName = "1234";

		Repo.findOne({uuid: repoName}, function(err, obj) {

			// Obj must exist
			assert.equal(obj.uuid, repoName);

			Repo.findOne({nullObj: true}, function(err, obj) {

				// Obj must not exist
				assert.equal(obj, null, "Object must not exist");
				done();
			});
		});
	});
});