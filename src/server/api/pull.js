// module
var github = require('../services/github');
var app = require('../app');

var Conf = require('mongoose').model('Conf');
var Repo = require('mongoose').model('Repo');

module.exports = {

	getAll: function(req, done){


		github.call({
			obj: 'pullRequests',
			fun: 'getAll',
			arg:{
				user: req.body.user,
				repo: req.body.repo,
				state: req.body.state
			},
			token: req.user.token
		}, function(err, pulls){

			if(err){
				return done(err, pulls);
			}

			var repo;

			try {
				repo = pulls[0].base.repo.id;
			}
			catch(ex) {
				repo = null;
			}


			Conf.findOne({
				user:req.user.id,
				repo:repo
			}, function(err,conf){

				console.log('CONF');
				console.log(conf);
				if(!err && conf) {

					pulls.forEach(function(pull){
						console.log('PULLS');
						console.log(pull);
						pull.watched = false;

						for(var key=0; key<conf.watch.length; key++){

							var r = req.body.user+':'+conf.watch[key];
							var re = new RegExp(r,'g');

							if(re.exec(pull.base.label) || re.exec(pull.head.label)){
								console.log('PULL WATCHED');
								pull.watched = true;
								break;
							}
						}

					});
					
				}
				done(err, pulls);

			});

		});


	}

};