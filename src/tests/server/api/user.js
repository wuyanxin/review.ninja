require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');

// models
var User = require('../../../server/documents/user').User;

// api
var user = require('../../../server/api/user');


describe('user: get', function(){

	it('should get user with name', function(done){

		user_find_stub = sinon.stub(User,'findOne', function(args,done){

			err = null;
			user_stub= {
				name:'name'
			};

			done(err,user_stub);

		});


		req = {
			args:{
				user:'user'
			}
		};

		user.get(req,function(err,res){

			assert.equal(res.name,'name');
			done();

		});


	});


	it('should get user without name', function(done){

		user_find_stub = sinon.stub(User,'findOne', function(args,done){

			err = null;
			user_stub= 'user';

			done(err,user_stub);

		});


		req = {
			args:{
				user:'user'
			}
		};

		user.get(req,function(err,res){
			assert.equal(res.name,null);
			done();
		});


	});



	it('should throw error', function(done){

		user_find_stub = sinon.stub(User,'findOne', function(args,done){

			err = 'error';
			user_stub= null;

			done(err,user_stub);

		});


		req = {
			args:{
				user:'user'
			}
		};

		user.get(req,function(error,res){
			assert.equal(error,'error');
			done();
		});

	});

	afterEach(function(){
		user_find_stub.restore();
	});


});
