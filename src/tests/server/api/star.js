require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');

// models
var Star = require('../../../server/documents/star').Star;
var Repo = require('../../../server/documents/repo').Repo;
var Comm = require('../../../server/documents/comm').Comm;

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

it('should create a star', function(done){

		repo_with_stub = sinon.stub(Repo,'with', function(args, done){
			err = null;
			repo_stub = 'repo';
			done(err,repo_stub);
		});

		star_create_stub = sinon.stub(Star,'create', function(args, done){
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
				id:'user',
				login:'login'
			}
		};


		star.set(req,function(error,res){
			assert.equal('star', res);
			done();
		});


	});


	it('should throw error when no repo found', function(done){


		repo_with_stub = sinon.stub(Repo,'with', function(args, done){
			err = 'error';
			repo_stub = null;
			done(err,repo_stub);
		});

		star_create_stub = sinon.stub(Star,'create', function(args, done){
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
				id:'user',
				login:'login'
			}
		};


		star.set(req,function(error,res){
			assert.equal(error, 'error');
			done();
		});

	});



	it('should throw error for star.create error', function(done){

		repo_with_stub = sinon.stub(Repo,'with', function(args, done){
			err = null;
			repo_stub = 'repo';
			done(err,repo_stub);
		});

		star_create_stub = sinon.stub(Star,'create', function(args, done){
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
				id:'user',
				login:'login'
			}
		};


		star.set(req,function(error,res){
			assert.equal('error',error);
			done();
		});

	});

	afterEach(function(){
		repo_with_stub.restore();
		star_create_stub.restore();
	});

});