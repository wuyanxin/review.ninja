// module
var github = require('../services/github');
var app = require('../app');

var Conf = require('mongoose').model('Conf');
var Repo = require('mongoose').model('Repo');

module.exports = {

	getAll: function(req, done){

		var args={
			user: req.body.user,
			repo: req.body.repo,
			state: req.body.state
		};

		github.call({
			obj: 'pullRequests',
			fun: 'getAll',
			arg:args,
			token: req.user.token
		}, function(err, pulls){

			if(err){
                return done({
                    code: 404,
                    text: 'Not found'
                });
			}


    		github.call({
    			obj:'repos',
    			fun:'get',
    			arg:{
    				user: req.body.user,
    				repo: req.body.repo
    			},
    			token:req.user.token

			}, function(err, repo) {

				Conf.findOne({
					// user:req.user.id,
					user:'7750964',
					repo:repo.id
				}, function(err,conf){

					if(err){
						return done({
							code: 404,
							text: 'Not found'
						});
					}


					if(conf){

						for(var index in pulls){
							var pull = pulls[index];

							var found = false;

							for(var key=0; key<conf.watch.length; key++){

								var r = req.body.user+':'+conf.watch[key];
								var re = new RegExp(r,"g");

								var match_base =re.exec(pull.base.label); 
								var match_head = re.exec(pull.head.label);

	                            if(match_base || match_head){
									found = true;
									break;
	                            }
							}

							if(found){

								pull.highlight = true;

							}else{
								pull.highlight = false;
							}


						}

						done(err, pulls);

					}
						


				});


			});



		});


	}

};