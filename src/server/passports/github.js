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
        done(null, merge(profile._json, {
            token: accessToken
        }));
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
