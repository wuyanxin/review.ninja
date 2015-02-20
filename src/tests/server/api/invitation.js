// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// api
var invitation = require('../../../server/api/invitation');

// services
var github = require('../../../server/services/github');

// libraries
var nodemailer = require('nodemailer');

describe('invitation:invite', function(done) {
    //  it('should send an invitation to the collaborator', function(done) {
    //     var transporter = {
    //         sendMail: function(mailOptions, done) {
    //             assert.equal(mailOptions.to, 'email@testmail.com');
    //             assert.equal(mailOptions.subject, 'You are invited to ReviewNinja');
    //             assert.equal(mailOptions.html, 'invitee invited you to join <a href="url">user/repo in ReviewNinja.\n');
    //             done();
    //         },
    //         close: sinon.spy()
    //     };
    //     var nodemailerStub = sinon.stub(nodemailer, 'createTransport').returns(transporter);

    //     var req = {
    //         args: {
    //             user: 'user',
    //             repo: 'repo',
    //             invitee: 'invitee',
    //             email: 'email@testmail.com'
    //         }
    //     };
    //     invitation.invite(req, null);

    //     assert(nodemailer.createTransport.called, 'transporter not created');
    //     assert(transporter.close.called, 'mail not send via transporter');

    //     nodemailerStub.restore();

    //     done();
    // });
});
