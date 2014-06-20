require('trace.ninja');

var request = require('supertest');
var express = require('express');
var http = require('http');

// unit test
var assert = require('assert');
var sinon = require('sinon');
var util = require('../stubs.util');

// api
var vote = require("../../../server/api/vote");

// Controllers
var toolRouter = require("../../../server/controller/tool");

// models
var Tool = require("../../../server/documents/tool").Tool;
var Vote = require("../../../server/documents/vote").Vote;
var Repo = require("../../../server/documents/repo").Repo;

describe('tool::router.all', function () {

	//
	// Stubs
	// 

	var stub_Tool_findOne = sinon.stub(Tool, "findOne", function(args, done) {

		// Create mock tool with the same id
		// that was searched for
		var tool = new Tool({
			uuid: args.uuid,
			name: "mockName",
			repo: "mockRepo",
			token: "mockToken"
		});

		// Return no error
		// Return the tool
		done(null, tool);
	});

	var stub_Vote_findOne = sinon.stub(Vote, "findOne", function(args, done) {

		// There will never be a previous vote, because otherwise our tests would fail
		var vote = null;
		done(null, vote);
	});


	var stub_Vote_update = sinon.stub(Vote, "update", function(a, b, c, done) {
		// Do nothing
		done();
	});

	var stub_Repo_findOne = sinon.stub(Repo, "findOne", function(args, done) {

		var repo = null;
		// Return mock tool with same id
		repo = new Repo({
		    uuid: args.uuid,
		    user: "mockUser",
		    name: "mockName",
		    token: "mockToken",
		    ninja: "true"
		});
		done(null, repo);

	});

	//
	// Tests
	// 

	it('should vote', function (done) {

		// Stub out github calls
		var fakedGithub = util.fakeGithub();

		// Create fake app
		var app = express();
		app.use(require('body-parser')());
		app.use('/api', toolRouter);

		// Create and send fake request
		request(app)
			.post('/api/vote/mockTool/mockCommit')

			// Send example vote
			.send({ failures: 1, issues: ['abc'], comments: ['abc'], vote: '-' })

			// Set Content-Types
  			.set('Accept', 'application/json')
  			.set('Content-Type', 'application/json')

  			// It should return a 201 - CREATED status
  			.expect(201, done);
	});
});