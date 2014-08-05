require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');

// models
var Tool = require('../../../server/documents/tool').Tool;

// api
var tool = require('../../../server/api/tool');


describe('tool:all', function(){


	it('should get all tools', function(done){

		tool_find_stub = sinon.stub(Tool,'find', function(args,done){
			err = null;
			tool_stub = 'Tool';
			done(err,tool_stub);
		});

		req = {
			args:{
				repo:'repo'
			}
		};

		tool.all(req,function(error,res){
			assert.equal('Tool',res);
			done();
		});


	});


	it('should throw error when tool is null', function(done){

		tool_find_stub = sinon.stub(Tool,'find', function(args,done){
			err = 'error';
			tool_stub = null;
			done(err,tool_stub);
		});

		req = {
			args:{
				repo:'repo'
			}
		};

		tool.all(req,function(error,res){
			assert.equal(error,'error');
			done();
		});

	});

	afterEach(function(){
		tool_find_stub.restore();
	});


});




describe('tool:add', function(){

	it('should add tool', function(done){

		tool_create_stub = sinon.stub(Tool,'create', function(args,done){
			err = null;
			tool_stub = 'tool';
			done(err,tool_stub);
		});

		req = {
			args:{
				repo:'repo',
				name: 'name'
			}
		};

		tool.add(req,function(error,res){
			assert.equal(res,'tool');
			done();
		});
	});

	it('should throw error for null tool', function(done){

		tool_create_stub = sinon.stub(Tool,'create', function(args,done){
			err = 'error';
			tool_stub = null;
			done(err,tool_stub);
		});

		req = {
			args:{
				repo:'repo',
				name: 'name'
			}
		};

		tool.add(req,function(error,res){
			assert.equal(error,'error');
			done();
		});

	});


	afterEach(function(){
		tool_create_stub.restore();
	});

});





describe('tool:get', function(){

	it('should get tool', function(done){
		
		tool_find_id_stub = sinon.stub(Tool,'findById', function(args,done){
			err = null;
			tool_stub = 'tool';
			done(err,tool_stub);
		});

		req = {
			args:{
				id:'id'
			}
		};

		tool.get(req,function(error,res){
			assert.equal(res,'tool');
			done();
		});

	});


	it('should throw error for null tool', function(done){


		tool_find_id_stub = sinon.stub(Tool,'findById', function(args,done){
			err = 'error';
			tool_stub = null;
			done(err,tool_stub);
		});

		req = {
			args:{
				id:'id'
			}
		};

		tool.get(req,function(error,res){
			assert.equal(error,'error');
			done();
		});

	});

	afterEach(function(){
		tool_find_id_stub.restore();
	});

});





describe('tool:set', function(){

	it('should set tool', function(done){
		
		var tool_inst = {
			name: 'MyName',
			save: function (done) {
				err =null;
				tool_test = 'tool';
				done(err,tool_test);
			}
		};

		tool_find_id_stub = sinon.stub(Tool,'findById', function(args,done){
			err =null;
			done(err,tool_inst);
		});

		req = {
			args:{
				id:'id',
				name: 'name'
			}
		};


		tool.set(req, function(err,tool){
			assert.equal(tool,'tool');
			done();
		});

	});




	it('should throw error', function(done){
		
		var tool_inst = {
			name: 'MyName',
			save: function (done) {
				err =null;
				tool_test = 'tool';
				done(err,tool_test);
			}
		};

		tool_find_id_stub = sinon.stub(Tool,'findById', function(args,done){
			err ='error';
			done(err,tool_inst);
		});

		req = {
			args:{
				id:'id',
				name: 'name'
			}
		};


		tool.set(req, function(err,tool){
			assert.equal(err.code,404);
			done();
		});

	});


	it('should catch error from tool_inst', function(done){
		
		var tool_inst = {
			name: 'MyName',
			save: function (done) {
				err ='error';
				tool_test = null;
				done(err,tool_test);
			}
		};

		tool_find_id_stub = sinon.stub(Tool,'findById', function(args,done){
			err =null;
			done(err,tool_inst);
		});

		req = {
			args:{
				id:'id',
				name: 'name'
			}
		};


		tool.set(req, function(err,tool){
			assert.equal(err,'error');
			done();
		});

	});


afterEach(function(){
	tool_find_id_stub.restore();
});

});
