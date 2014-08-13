// module
var github = require('../services/github');
var app = require('../app');

var Conf = require('mongoose').model('Conf');

modules.export = {

	getAll: function(req, done){

		github.call({
			obj: 'pullRequests',
			fun: 'getAll',
			args:{
				user: req.user,
				repo: req.repo,
				state: req.state
			}
		}, function(err, pulls){

			if(err){
                return done({
                    code: 404,
                    text: 'Not found'
                });
			}


			Conf.findOne({
				user:req.user,
				repo:req.repo
			}, function(err,conf){

				if(err){
	                return done({
	                    code: 404,
	                    text: 'Not found'
	                });
				}


				if(conf){

					console.log(conf);
						
					pulls.value.forEach(function(pull){

						console.log('PULL');
						console.log(pull);

						var found = false;

						for(key in conf.watch){

 							var reg = conf.watch[key];
                            var match =reg.exec(pull.name); 

                            if(match){
                            	found = true;
                            	break;
                            }
						}


						if(match){

							pull.highlight = true;

						}else{
							pull.highlight = false;
						}


					});

				}


			});






		});


	}

}