
var async = require('async');
var colors = require('colors');
var express = require('express');
var glob = require('glob');
var merge = require('merge');
var passport = require('passport');
var path = require('path');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Load Event Bus 
//////////////////////////////////////////////////////////////////////////////////////////////////

require('./bus');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Load configuration 
//////////////////////////////////////////////////////////////////////////////////////////////////

global.config = require('./../config');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Express application
//////////////////////////////////////////////////////////////////////////////////////////////////

var app = express();
var api = {};

config.server.static.forEach(function(p) {
	app.use(express.static(p));
});

app.use(require('body-parser')());
app.use(require('cookie-parser')());
app.use(require('cookie-session')({secret: 'review.ninja!', cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(passport.initialize());
app.use(passport.session());

// custom middleware
app.use(require('./middleware/github'));
app.use('/api', require('./middleware/param'));
app.use('/api', require('./middleware/authenticated'));


async.series([

	//////////////////////////////////////////////////////////////////////////////////////////////
	// Bootstrap mongoose
	//////////////////////////////////////////////////////////////////////////////////////////////

	function(callback) {

		console.log('bootstrap mongoose'.bold);

		var mongoose = require('mongoose');

		mongoose.connect(config.server.mongodb.uri, {
			server: {
				socketOptions: {
					keepAlive: 1
				}
			}
		});

		global.models = {};

		async.eachSeries(config.server.documents, function(p, callback) {
			glob(p, function(err, file) {
				if(file && file.length && file.length > 0) {
					file.forEach(function(f) {
						try {
							global.models = merge(global.models, require(f));
							console.log('✓ '.bold.green + path.relative(process.cwd(), f));
						} catch(ex) {
							console.log('✖ '.bold.red + path.relative(process.cwd(), f));
							console.log(ex.stack);
						}
					});
					callback();
				}
			});
		}, callback);
	},

	//////////////////////////////////////////////////////////////////////////////////////////////
	// Bootstrap passport
	//////////////////////////////////////////////////////////////////////////////////////////////

	function(callback) {

		console.log('bootstrap passport'.bold);

		async.eachSeries(config.server.passport, function(p, callback) {
			glob(p, function(err, file) {
				if(file && file.length && file.length > 0) {
					file.forEach(function(f) {
						console.log('✓ '.bold.green + path.relative(process.cwd(), f));
						require(f);
					});
				}
				callback();
			});
		}, callback);
	},

	//////////////////////////////////////////////////////////////////////////////////////////////
	// Bootstrap controller
	//////////////////////////////////////////////////////////////////////////////////////////////

	function(callback) {

		console.log('bootstrap controller'.bold);

		async.eachSeries(config.server.controller, function(p, callback) {
			glob(p, function(err, file) {
				if(file && file.length && file.length > 0) {
					file.forEach(function(f) {
						try {
							app.use('/', require(f));
							console.log('✓ '.bold.green + path.relative(process.cwd(), f));
						} catch(ex) {
							console.log('✖ '.bold.red + path.relative(process.cwd(), f));
							console.log(ex.stack);
						}
					});
				}
				callback();
			});
		}, callback);
	},

	//////////////////////////////////////////////////////////////////////////////////////////////
	// Bootstrap api
	//////////////////////////////////////////////////////////////////////////////////////////////

	function(callback) {

		console.log('bootstrap api'.bold);

		async.eachSeries(config.server.api, function(p, callback) {
			glob(p, function(err, file) {
				if(file && file.length && file.length > 0) {
					file.forEach(function(f) {
						console.log('✓ '.bold.green + path.relative(process.cwd(), f));
						api[path.basename(f, '.js')] = require(f);
					});
				}
				callback();
			});
		}, callback());
	}

], function(err, res) {
	console.log('✓ '.bold.green + 'bootstrapped');
});

//////////////////////////////////////////////////////////////////////////////////////////////////
// Handle api calls
//////////////////////////////////////////////////////////////////////////////////////////////////

// call

app.all('/api/:obj/:fun', function(req, res) {
	api[req.params.obj][req.params.fun](req, function(err, obj) {
		if (err) {
			console.log(('✖ ' + req.params.obj + ":" +  req.params.fun).bold.red);
			console.log(err);
			res.send(err.code || 500, JSON.stringify(err.text || err));
		}
		else {
			console.log(('✓ ' + req.params.obj + ":" +  req.params.fun).bold.green);
			return obj ? res.send(JSON.stringify(obj)) : res.send();
		}
	});
});

// meta

app.all('/api', function(req, res) {
	var ref = {};
	for (var obj in api) {
		if (api.hasOwnProperty(obj)) {
			ref[obj] = ref[obj] || [];
			for (var fun in api[obj]) {
				if (api[obj].hasOwnProperty(fun)) {
					ref[obj].push(fun);
				}
			}
		}
	}
	res.send(JSON.stringify(ref));
});

module.exports = app;