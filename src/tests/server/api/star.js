require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// models
var User = require('../../../server/documents/user').User;
var Star = require('../../../server/documents/star').Star;
var Repo = require('../../../server/documents/repo').Repo;
var Settings = require('../../../server/documents/settings').Settings;

// services
var github = require('../../../server/services/github');
var notification = require('../../../server/services/notification');

// api
var star = require('../../../server/api/star');

describe('star:all', function(done){

    it('should get all stars without error', function(done){
        stub_star_all = sinon.stub(Star,'find', function(args,done){
            error = null;
            star_stub = 'star';
            done(error,star_stub);
        });

        req = {
            args:{
                comm:'comm',
                repo: 'repo'
            }
        };

        star.all(req,function(error,res){
            assert.equal(res,'star');
            done();
        });

    }); 


it('should throw error when star is null', function(done){

    stub_star_all = sinon.stub(Star,'find', function(args,done){
        error = 'error';
        star_stub = null;
        done(error,star_stub);
    });

    req = {
        args:{
            comm: 'comm',
            repo: 'repo'
        }
    };

    star.all(req, function(err, res){
        assert.equal(err,'error');
        done();
    });
});

    afterEach(function(){
        stub_star_all.restore();
    });


});







describe('star:get', function(){

    it('should get star with no error', function(done){

        star_with_stub = sinon.stub(Star,'with', function(args,done){
            err = null;
            star_stub = 'star';
            done(err,star_stub);
        });

        req = {
            args:{
                repo: 'repo',
                comm:'comm'
            },
            user:{
                id:'user'
            }
        };

        star.get(req, function(err,res){
            assert.equal('star', res);
            done();
        });


    });


    it('should throw error when star is null', function(done){

        star_with_stub = sinon.stub(Star,'with', function(args, done){
            err = 'error';
            star_stub = null;
            done(err,star_stub);
        });

        req = {
            args:{
                repo: 'repo',
                comm:'comm'
            },
            user:{
                id:'user'
            }
        };

        star.get(req, function(err,res){
            assert.equal(err,'error');
            done();
        });

    });

    afterEach(function(){
        star_with_stub.restore();
    });


});









describe('star:set', function(){

beforeEach(function() {
    global.io = {emit: sinon.spy()};

});

before(function(){
    // removing until notifications is refactored
    // notification_star_stub = sinon.stub(notification,'star', function(args, done){
    //  return;
    // });
    // notification_unstar_stub = sinon.stub(notification,'unstar', function(args, done){
    //  return;
    // });
});

    it('should create a star', function(done){

        repo_with_stub = sinon.stub(Repo, 'with', function(args, done){
            done(null, {});
        });

        github_one_stub = sinon.stub(github,'call', function(args, done){
            
            assert.equal(args.obj, 'repos');
            assert.equal(args.fun, 'one');
            assert.equal(args.arg.id, 1);

            done(null, {
                permissions: { pull: true }
            });
        });

        star_create_stub = sinon.stub(Star, 'create', function(args, done){

            assert.equal(args.sha, '1234');
            assert.equal(args.repo, 1);
            assert.equal(args.user, 2);
            assert.equal(args.name, 'login');

            done(null, {
                sha: args.sha,
                repo: args.repo,
                user: args.user,
                name: args.name,
            });
        });

        notification_stub = sinon.stub(notification,'sendmail', function(user, notification_type, repo, repo_name, pull_req_number, args) {
            done();
        });

        star.set({
            args: {
                sha: '1234',
                repo: 'repo',
                user: 'user',
                name: 'name',
                repo_uuid: 1,
                number: 2
            },
            user: {
                id: 2,
                login: 'login',
                token: '12345'
            }
        }, function(error, res){
            assert(io.emit.called);

            assert.equal(res.sha, '1234');
            assert.equal(res.repo, 1);
            assert.equal(res.user, 2);
            assert.equal(res.name, 'login');

        });


    });


    it('should throw error for star.create error', function(done){

        repo_with_stub = sinon.stub(Repo, 'with', function(args, done){
            done(null, {});
        });

        github_one_stub = sinon.stub(github,'call', function(args, done){
            
            assert.equal(args.obj, 'repos');
            assert.equal(args.fun, 'one');
            assert.equal(args.arg.id, 1);

            done(null, {
                permissions: { pull: true }
            });
        });

        star_create_stub = sinon.stub(Star, 'create', function(args, done){
            done(true, null);
        });

        star.set({
            args: {
                sha: '1234',
                repo: 'repo',
                user: 'user',
                name: 'name',
                repo_uuid: 1,
                number: 2
            },
            user: {
                id: 2,
                login: 'login',
                token: '12345'
            }
        }, function(err, res){
            assert.equal(err, true);
            assert.equal(res, null);
            done();
        });

    });

    afterEach(function(){
        repo_with_stub.restore();
        github_one_stub.restore();
        star_create_stub.restore();
    });

});
