require('trace.ninja');

var request = require('supertest');
var express = require('express');
var http = require('http');

var bodyParser = require('body-parser');
// unit test
var assert = require('assert');
var sinon = require('sinon');

// api
var github = require('../../../server/services/github');

// Controllers
var toolRouter = require('../../../server/controller/tool');

// models
var Tool = require('../../../server/documents/tool').Tool;
var Star = require('../../../server/documents/star').Star;
var Repo = require('../../../server/documents/repo').Repo;

describe('tool::router.all', function() {

    //////////////////////////////////
    /////////////Tests////////////////
    //////////////////////////////////


    //testing creating an issue
    it('should down vote', function(done) {
        stub_Tool_findOne = sinon.stub(Tool, 'findById', function(args, done) {

            var tool = new Tool({
                uuid: args.uuid,
                name: 'mockName',
                repo: 'mockRepo',
                token: 'mockToken'
            });

            done(null, tool);
        });

        stub_Star_create = sinon.stub(Star, 'create', function(args, done) {

            console.log('help');

            var error = null;
            var star_create = null;
            done(error, star_create);
        });
        stub_Repo_findOne = sinon.stub(Repo, 'findOne', function(args, done) {

            console.log('repo');


            var repo = new Repo({
                uuid: args.uuid,
                user: 'mockUser',
                name: 'mockName',
                token: 'mockToken',
                ninja: 'true'
            });
            done(null, repo);

        });

        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            console.log('github');


            if (args.fun == 'one') {
                grepo = {
                    owner: {
                        login: 'mockLogin'
                    },
                    name: 'mockName'
                };
                done(null, grepo);
            } else if (args.fun == 'getCommit') {
                comm = {
                    sha: args.arg.sha
                };
                done(null, comm);
            } else if (args.fun == 'createCommitComment') {
                //nothing to be done
                done();
            }
        });
        // Create fake app
        app = express();

        app.use(bodyParser.json());
        app.use('/api', toolRouter);

        // Create and send fake request
        request(app)
            .post('/api/vote/mockTool/mockCommit')
            .send({
                issues: ['I has an issue'],
                comments: [],
                star: false
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(201, done);

    });









    //Test starring a commit
    it('should star commit', function(done) {
        stub_Tool_findOne = sinon.stub(Tool, 'findById', function(args, done) {

            var tool = new Tool({
                uuid: args.uuid,
                name: 'mockName',
                repo: 'mockRepo',
                token: 'mockToken'
            });

            done(null, tool);
        });

        stub_Star_create = sinon.stub(Star, 'create', function(args, done) {
            var error = null;
            var star_create = null;
            done(error, star_create);
        });



        stub_Repo_findOne = sinon.stub(Repo, 'findOne', function(args, done) {

            var repo = new Repo({
                uuid: args.uuid,
                user: 'mockUser',
                name: 'mockName',
                token: 'mockToken',
                ninja: 'true'
            });
            done(null, repo);

        });

        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            if (args.fun == 'one') {
                grepo = {
                    owner: {
                        login: 'mockLogin'
                    },
                    name: 'mockName'
                };
                done(null, grepo);
            } else if (args.fun == 'getCommit') {
                comm = {
                    sha: args.arg.sha
                };
                done(null, comm);
            } else if (args.fun == 'createCommitComment') {
                //nothing to be done
                done();
            }
        });




        // Create fake app
        app = express();

        app.use(bodyParser.json());
        app.use('/api', toolRouter);
        //create fake request
        request(app)
            .post('/api/vote/mockTool/mockCommit')
            .send({
                issues: [],
                comments: [],
                star: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(201, done);
    });









    //Testing error getting tool
    it('should throw error when getting tool', function(done) {
        stub_Tool_findOne = sinon.stub(Tool, 'findById', function(args, done) {

            var tool = new Tool({
                uuid: args.uuid,
                name: 'mockName',
                repo: 'mockRepo',
                token: 'mockToken'
            });


            done('error', tool);
        });

        stub_Star_create = sinon.stub(Star, 'create', function(args, done) {
            var error = null;
            var star_create = null;
            done(error, star_create);
        });

        stub_Repo_findOne = sinon.stub(Repo, 'findOne', function(args, done) {

            var repo = new Repo({
                uuid: args.uuid,
                user: 'mockUser',
                name: 'mockName',
                token: 'mockToken',
                ninja: 'true'
            });
            done(null, repo);

        });

        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            if (args.fun == 'one') {
                grepo = {
                    owner: {
                        login: 'mockLogin'
                    },
                    name: 'mockName'
                };
                done(null, grepo);
            } else if (args.fun == 'getCommit') {
                comm = {
                    sha: args.arg.sha
                };
                done(null, comm);
            } else if (args.fun == 'createCommitComment') {
                //nothing to be done
                done();
            }
        });

        // Create fake app
        app = express();

        app.use(bodyParser.json());
        app.use('/api', toolRouter);
        //create fake request
        request(app)
            .post('/api/vote/mockTool/mockCommit')
            .send({
                issues: [],
                comments: [],
                star: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(500, done);

    });






    //Testing getting tool as null
    it('should throw error when getting tool', function(done) {
        stub_Tool_findOne = sinon.stub(Tool, 'findById', function(args, done) {

            var tool = new Tool({
                uuid: args.uuid,
                name: 'mockName',
                repo: 'mockRepo',
                token: 'mockToken'
            });


            done(null, null);
        });

        stub_Star_create = sinon.stub(Star, 'create', function(args, done) {
            var error = null;
            var star_create = null;
            done(error, star_create);
        });

        stub_Repo_findOne = sinon.stub(Repo, 'findOne', function(args, done) {

            var repo = new Repo({
                uuid: args.uuid,
                user: 'mockUser',
                name: 'mockName',
                token: 'mockToken',
                ninja: 'true'
            });
            done(null, repo);

        });

        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            if (args.fun == 'one') {
                grepo = {
                    owner: {
                        login: 'mockLogin'
                    },
                    name: 'mockName'
                };
                done(null, grepo);
            } else if (args.fun == 'getCommit') {
                comm = {
                    sha: args.arg.sha
                };
                done(null, comm);
            } else if (args.fun == 'createCommitComment') {
                //nothing to be done
                done();
            }
        });




        // Create fake app
        app = express();

        app.use(bodyParser.json());
        app.use('/api', toolRouter);
        //create fake request
        request(app)
            .post('/api/vote/mockTool/mockCommit')
            .send({
                issues: [],
                comments: [],
                star: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(404, done);

    });






    //testing bad post data
    it('should throw error for bad post data', function(done) {
        stub_Tool_findOne = sinon.stub(Tool, 'findById', function(args, done) {

            var tool = new Tool({
                uuid: args.uuid,
                name: 'mockName',
                repo: 'mockRepo',
                token: 'mockToken'
            });

            done(null, tool);
        });

        stub_Star_create = sinon.stub(Star, 'create', function(args, done) {
            var error = null;
            var star_create = null;
            done(error, star_create);
        });

        stub_Repo_findOne = sinon.stub(Repo, 'findOne', function(args, done) {

            var repo = new Repo({
                uuid: args.uuid,
                user: 'mockUser',
                name: 'mockName',
                token: 'mockToken',
                ninja: 'true'
            });
            done(null, repo);

        });

        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            if (args.fun == 'one') {
                grepo = {
                    owner: {
                        login: 'mockLogin'
                    },
                    name: 'mockName'
                };
                done(null, grepo);
            } else if (args.fun == 'getCommit') {
                comm = {
                    sha: args.arg.sha
                };
                done(null, comm);
            } else if (args.fun == 'createCommitComment') {
                //nothing to be done
                done();
            }
        });


        // Create fake app
        app = express();

        app.use(bodyParser.json());
        app.use('/api', toolRouter);
        //create fake request
        request(app)
            .post('/api/vote/mockTool/mockCommit')
            .send({
                issues: [],
                comments: [],
                star: null
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(400, done);

    });







    //testing should have correct number of comments created
    it('should have correct number of comments created', function(done) {

        var num_comments = 0;

        stub_Tool_findOne = sinon.stub(Tool, 'findById', function(args, done) {

            var tool = new Tool({
                uuid: args.uuid,
                name: 'mockName',
                repo: 'mockRepo',
                token: 'mockToken'
            });

            done(null, tool);
        });

        stub_Star_create = sinon.stub(Star, 'create', function(args, done) {

            console.log('help');

            var error = null;
            var star_create = null;
            done(error, star_create);
        });
        stub_Repo_findOne = sinon.stub(Repo, 'findOne', function(args, done) {

            console.log('repo');


            var repo = new Repo({
                uuid: args.uuid,
                user: 'mockUser',
                name: 'mockName',
                token: 'mockToken',
                ninja: 'true'
            });
            done(null, repo);

        });

        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            console.log('github');


            if (args.fun == 'one') {
                grepo = {
                    owner: {
                        login: 'mockLogin'
                    },
                    name: 'mockName'
                };
                done(null, grepo);
            } else if (args.fun == 'getCommit') {
                comm = {
                    sha: args.arg.sha
                };
                done(null, comm);
            } else if (args.fun == 'createCommitComment') {
                num_comments = num_comments + 1;
                //nothing to be done
                done();
            }
        });


        // Create fake app
        app = express();

        app.use(bodyParser.json());
        app.use('/api', toolRouter);
        //create fake request
        request(app)
            .post('/api/vote/mockTool/mockCommit')
            .send({
                issues: [],
                comments: ['test 1', 'test 2'],
                star: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(201, function() {
                assert.equal(num_comments, 2);
                done();
            });

    });



    afterEach(function() {
        stub_Tool_findOne.restore();
        stub_Star_create.restore();
        stub_github_call.restore();
        stub_Repo_findOne.restore();
    });
});
