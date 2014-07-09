var logger = require('../log');

var github = require('../services/github');
var mailchimp = require('../services/chimp');

var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var merge = require('merge');
var sugar = require('array-sugar');

passport.use(new Strategy({
		clientID: config.github.client,
		clientSecret: config.github.secret,
		callbackURL: config.github.callback,
		authorizationURL: config.github.urls.authorization,
		tokenURL: config.github.urls.token,
		userProfileURL: config.github.urls.profile,
		scope: config.github.scopes
	},
	function(accessToken, refreshToken, profile, done) {
		logger.log('Github OAuth Login');
		models.User.update({uuid: profile.id}, {name: profile.username, token: accessToken}, {upsert: true}, function(err, num, res) {

			done(err, merge(profile._json, {token: accessToken}));

			//
			// Add user to our mailing list - FIX
			//
			if(res && !res.updatedExisting) {

				github.call({
					obj: 'user',
					fun: 'get',
					token: accessToken
				}, function(err, user) {
					if(!err) {

						github.call({
							obj: 'user',
							fun: 'getEmails',
							token: accessToken
						}, function(err, emails) {
							if(!err) {

								mailchimp.call({
									obj: 'lists',
									fun: 'subscribe',
									arg: {
										id: config.mailchimp.user,
										email: {
											email: emails.last
										},
										merge_vars: {
											name: user.name,
											login: user.login
										}
									}
								}, function(){

								});
							}
						});
					}
				});
			}

		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});