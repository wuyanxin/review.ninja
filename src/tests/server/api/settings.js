require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// documents
var Settings = require('../../../server/documents/settings').Settings;

// api
var settings = require('../../../server/api/settings');

describe('settings:get', function(done){
    it('should return the settings object if is exists', function(done) {
        var settingsStub = sinon.stub(Settings, 'with', function(args, done) {
            done(null, {settings: 'object'});
        });

        var req = {
            user: {id: 1234},
            args: {repo_uuid: 'uuid'}
        };

        settings.get(req, function(err, res) {
            assert.deepEqual(res, {settings: 'object'});
            settingsStub.restore();
            done();
        });
    }); 

    it('should create a new settings object if it does not already exists', function(done) {
        var settingsStub = sinon.stub(Settings, 'with', function() {
            if(arguments.length == 2) {
                // done is the second argument
                arguments[1](null, null);
            }
            if(arguments.length == 3) {
                // done is the third argument
                arguments[2](null, {settings: 'object'});
            }
        });

        var req = {
            user: {id: 1234},
            args: {repo_uuid: 'uuid'}
        };

        settings.get(req, function(err, res) {
            assert.deepEqual(res, {settings: 'object'});
            settingsStub.restore();
            done();
        });
    }); 
});

describe('settings:setWatched', function(done) {
    it('should uniquify the watched list and only watchlist should be set', function(done) {
        var settingsStub = sinon.stub(Settings, 'with', function(key, args, done) {
            assert.equal(args.watched.length, 2);
            assert.deepEqual(args, {watched: ['test', 'test1']});
            done();
        });

        var req = {
            user: {id: 1234},
            args: {
                repo_uuid: 'uuid',
                watched: ['test', 'test', 'test1']
            }
        };

        settings.setWatched(req, function() {
            settingsStub.restore();
            done();
        });
    }); 
});

describe('settings:setNotifications', function(done) {
    it('should only set the notifications even if other args are set', function(done) {
        var settingsStub = sinon.stub(Settings, 'with', function(key, args, done) {
            assert.deepEqual(args, {notifications: {pull_request: true}});
            done();
        });

        var req = {
            user: {id: 1234},
            args: {
                repo_uuid: 'uuid',
                watched: ['test', 'test', 'test1'],
                notifications: {pull_request: true}
            }
        };

        settings.setNotifications(req, function() {
            settingsStub.restore();
            done();
        });
    });
});
