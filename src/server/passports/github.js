var logger = require('../log');

var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var merge = require('merge');

passport.use(new Strategy({
		clientID: config.github.client,
		clientSecret: config.github.secret,
		callbackURL: config.github.callback,
		authorizationURL: config.github.urls.authorization,
		tokenURL: config.github.urls.token,
		userProfileURL: config.github.urls.profile,
		scope: ['repo', 'repo:status', 'read:repo_hook', 'write:repo_hook', 'read:org', 'write:org']
	},
	function(accessToken, refreshToken, profile, done) {
		logger.log('Github OAuth Login');
		models.User.update({uuid: profile.id}, {name: profile.username, token: accessToken}, {upsert: true}, function(err) {
			done(err, merge(profile._json, {token: accessToken}));
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});