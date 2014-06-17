
var http = require('http');

//////////////////////////////////////////////////////////////////////////////////////////////
// Crash Report
//////////////////////////////////////////////////////////////////////////////////////////////

if(process.env.NODE_ENV === 'production') {

	process.on('uncaughtException', function (err) {

		console.log(err);

		var github = new (require('github'))({version: '3.0.0'});

		github.authenticate({
			type: 'oauth',
			token: process.env.ADMIN_TOKEN
		});

		github.issues.create({
			user: 'dtornow',
			repo: 'review.ninja',
			labels: ['crash'],
			title: err.toString(),
			body: err.stack.toString()
		}, function() {
			process.exit(1);
		});

	});

}

//////////////////////////////////////////////////////////////////////////////////////////////
// Lift sails
//////////////////////////////////////////////////////////////////////////////////////////////

var app = require('./src/server/app.js');

http.createServer(app).listen(60000).on('listening', function() {

});