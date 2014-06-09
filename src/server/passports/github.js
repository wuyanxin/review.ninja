var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var merge = require('merge');

passport.use(new Strategy({
		clientID: config.github.client,
		clientSecret: config.github.secret,
		callbackURL: config.github.callback,
		scope: ['repo', 'repo:status', 'read:repo_hook', 'write:repo_hook', 'read:org', 'write:org']
	},
	function(accessToken, refreshToken, profile, done) {
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