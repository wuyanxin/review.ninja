
var Comm = {
	getOrCreate: function(args, done) {

		var github = require('./services/github');
		var mongod = require('mongoose').model('Comm');

		mongod.with({repo: args.repoUuid, uuid: args.commUuid}, function(err, mcomm) {

			if(err) {
				return done(err);
			}

			if(!mcomm) {

				github.call({obj: 'repos', fun: 'one', arg: {
					id: args.repoUuid
				}, token: args.token}, function(err, grepo) {

					if(err) {
						return done(err);
					}

					github.call({obj: 'repos', fun: 'getContent', arg: {
						user: grepo.owner.login,
						repo: grepo.name,
						ref: args.commUuid,
						path: '.ninja.json'
					}, token: args.token}, function(err, gfile) {
						
						if(err) {
							return done(err);
						}

						var content;

						try {
							content = new Buffer(gfile.content, 'base64').toString();
						} catch(ex) {
							content = null;
						}

						mongod.with({repo: args.repoUuid, uuid: args.commUuid}, {repo: args.repoUuid, uuid: args.commUuid, ninja: content}, function(err, mcomm) {
							return done(null, mcomm);
						});

					});

				});

			}
			else {
				return done(err, mcomm);
			}

		});
	}
};