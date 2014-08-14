require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');
var github = require('../../../server/services/github');

// models
var Repo = require('../../../server/documents/repo').Repo;

// api
var repo = require('../../../server/api/repo');


/////////////////////////////////
///////////Repo Get/////////////
////////////////////////////////

describe('Repo: get', function() {

    it('should get repo', function(done) {

        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            if (args.fun == 'one' && args.obj == 'repos') {
                repo_github = {
                    permissions: {
                        pull: true
                    }
                };
                err = null;
                done(err, repo_github);
            }
        });

        repo_with = sinon.stub(Repo, 'with', function(args, done) {


            repoTest = 'repoTest';
            err = null;

            done(err, repoTest);
        });

        req = {
            args: {
                uuid: 'uuid'
            },
            user: {
                token: 'token'
            }
        };


        repo.get(req, function(err, repoTest) {
            assert.equal(repoTest, 'repoTest');
            done();
        });

    });





    it('should throw error for wrong permissions', function(done) {

        //github api stub
        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            if (args.fun == 'one' && args.obj == 'repos') {
                repo_github = {
                    permissions: {
                        pull: false
                    }
                };
                err = null;
                done(err, repo_github);
            }
        });


        repo_with = sinon.stub(Repo, 'with', function(args, done) {


            repoTest = 'repoTest';
            err = null;

            done(err, repoTest);
        });

        req = {
            args: {
                uuid: 'uuid'
            },
            user: {
                token: 'token'
            }
        };

        repo.get(req, function(err, repoTest) {
            assert.equal(err.code, 403);
            done();
        });


    });





    //testing get failure -> getting null form Repo.with
    it('should throw error for null Repo.with', function(done) {

        //github api stub
        stub_github_call = sinon.stub(github, 'call', function(args, done) {

            if (args.fun == 'one' && args.obj == 'repos') {
                repo_github = {
                    permissions: {
                        pull: true
                    }
                };
                err = null;
                done(err, repo_github);
            }
        });


        repo_with = sinon.stub(Repo, 'with', function(args, done) {

            repoTest = null;
            err = 'error';

            done(err, repoTest);
        });

        req = {
            args: {
                uuid: 'uuid'
            },
            user: {
                token: 'token'
            }
        };

        repo.get(req, function(err, repoTest) {

            assert.equal(err, 'error');
            done();
        });


    });




    afterEach(function() {
        stub_github_call.restore();
        repo_with.restore();
    });

});




/////////////////////////////////
///////////Repo Add/////////////
////////////////////////////////

// describe('repo: add', function() {

//     it('should add repo without error', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one' && args.obj == 'repos') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };
//                 err = null;
//                 done(err, repo_github);
//             } else if (args.fun == 'createHook' && args.obj == 'repos') {
//                 err = null;
//                 data = 'data';
//                 done(err, data);
//             }
//         });


//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });




//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.add(req, function(err, repoTest) {
//             assert.equal(repoTest, 'repoTest');
//             done();
//         });


//     });







//     it('should throw error with wrong permission', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one' && args.obj == 'repos') {
//                 repo_github = {
//                     permissions: {
//                         admin: false
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };
//                 err = null;
//                 done(err, repo_github);
//             } else if (args.fun == 'createHook' && args.obj == 'repos') {
//                 err = null;
//                 data = 'data';
//                 done(err, data);
//             }
//         });


//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });




//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.add(req, function(err, repoTest) {
//             assert.equal(err.code, 403);
//             done();
//         });


//     });








//     it('should throw error with null repo', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one' && args.obj == 'repos') {
//                 repo_github = null;
//                 err = null;
//                 done(err, repo_github);
//             } else if (args.fun == 'createHook' && args.obj == 'repos') {
//                 err = null;
//                 data = 'data';
//                 done(err, data);
//             }
//         });


//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });




//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.add(req, function(err, repoTest) {
//             assert.equal(err.code, 404);
//             done();
//         });


//     });









//     it('should throw error with null Repo with', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one' && args.obj == 'repos') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };
//                 err = null;
//                 done(err, repo_github);
//             } else if (args.fun == 'createHook' && args.obj == 'repos') {
//                 err = null;
//                 data = 'data';
//                 done(err, data);
//             }
//         });


//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = null;
//             err = 'error';

//             done(err, repoTest);
//         });




//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.add(req, function(err, repoTest) {
//             assert.equal(err.code, 404);
//             done();
//         });


//     });



//     it('should throw error with create hook', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one' && args.obj == 'repos') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };
//                 err = null;
//                 done(err, repo_github);
//             } else if (args.fun == 'createHook' && args.obj == 'repos') {
//                 err_string = '{"errors":["one","two"]}';
//                 //error = JSON.stringify(err_string);
//                 //et = JSON.parse(error);
//                 //console.log('in stub: '+et+' '+et.errors);
//                 err = {
//                     message: err_string
//                 };
//                 data = null;
//                 done(err, data);
//             }
//         });


//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });




//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.add(req, function(err, repoTest) {
//             assert.equal(err.message, '{"errors":["one","two"]}');
//             done();
//         });


//     });


//     it('should add hook even if hook already exists', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one' && args.obj == 'repos') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };
//                 err = null;
//                 done(err, repo_github);
//             } else if (args.fun == 'createHook' && args.obj == 'repos') {
//                 err_string = '{"errors":["Hook already exists on this repository"]}';
//                 err = {
//                     message: err_string
//                 };
//                 data = null;
//                 done(err, data);
//             }
//         });


//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });




//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.add(req, function(err, repoTest) {
//             assert.equal(repoTest, 'repoTest');
//             done();
//         });


//     });


//     afterEach(function() {
//         stub_github_call.restore();
//         repo_with.restore();
//     });


// });



// /////////////////////////////////
// ///////////Repo Rmv/////////////
// ////////////////////////////////

// describe('repo:rmv', function() {


//     it('should remove existing repo webhook', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };

//                 err = null;

//                 done(err, repo_github);

//             } else if (args.fun == 'getHooks') {

//                 webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';

//                 hook1 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook1'
//                 };

//                 hook2 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook2'
//                 };

//                 hook3 = {
//                     config: {
//                         url: webhook_url
//                     },
//                     id: 'hook3'
//                 };
//                 hooks = [hook1, hook2, hook3];

//                 error = null;

//                 done(error, hooks);

//             } else if (args.fun == 'deleteHook') {
//                 error = null;
//                 data = 'data';
//                 done(error, data);
//             }

//         });

//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });


//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.rmv(req, function(err, res) {
//             assert.equal(res, 'repoTest');
//             done();
//         });


//     });



//     it('should return not found for no repo', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one') {
//                 repo_github = null;

//                 err = 'error';

//                 done(err, repo_github);

//             } else if (args.fun == 'getHooks') {

//                 webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';

//                 hook1 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook1'
//                 };

//                 hook2 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook2'
//                 };

//                 hook3 = {
//                     config: {
//                         url: webhook_url
//                     },
//                     id: 'hook3'
//                 };
//                 hooks = [hook1, hook2, hook3];

//                 error = null;

//                 done(error, hooks);

//             } else if (args.fun == 'deleteHook') {
//                 error = null;
//                 data = 'data';
//                 done(error, data);
//             }

//         });

//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });


//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };

//         repo.rmv(req, function(err, res) {
//             assert.equal(err.code, 404);
//             done();
//         });

//     });




//     it('should return forbidden with bad permissions', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one') {
//                 repo_github = {
//                     permissions: {
//                         admin: false
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };

//                 err = null;

//                 done(err, repo_github);

//             } else if (args.fun == 'getHooks') {

//                 webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';

//                 hook1 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook1'
//                 };

//                 hook2 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook2'
//                 };

//                 hook3 = {
//                     config: {
//                         url: webhook_url
//                     },
//                     id: 'hook3'
//                 };
//                 hooks = [hook1, hook2, hook3];

//                 error = null;

//                 done(error, hooks);

//             } else if (args.fun == 'deleteHook') {
//                 error = null;
//                 data = 'data';
//                 done(error, data);
//             }

//         });

//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });


//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.rmv(req, function(err, res) {
//             assert.equal(err.code, 403);
//             done();
//         });


//     });




//     it('should throw error if not correct hook', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };

//                 err = null;

//                 done(err, repo_github);

//             } else if (args.fun == 'getHooks') {

//                 webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';

//                 hook1 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook1'
//                 };

//                 hook2 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook2'
//                 };

//                 hooks = [hook1, hook2];

//                 error = null;

//                 done(error, hooks);

//             } else if (args.fun == 'deleteHook') {
//                 error = null;
//                 data = 'data';
//                 done(error, data);
//             }

//         });

//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });


//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.rmv(req, function(err, res) {
//             assert.equal(err.code, 404);
//             done();
//         });


//     });


//     it('should throw error for github gethooks', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };

//                 err = null;

//                 done(err, repo_github);

//             } else if (args.fun == 'getHooks') {

//                 hooks = null;

//                 error = 'error';

//                 done(error, hooks);

//             } else if (args.fun == 'deleteHook') {
//                 error = null;
//                 data = 'data';
//                 done(error, data);
//             }

//         });

//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });


//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.rmv(req, function(err, res) {
//             assert.equal(err, 'error');
//             done();
//         });


//     });



//     it('should throw error for github delete hook', function(done) {

//         stub_github_call = sinon.stub(github, 'call', function(args, done) {

//             if (args.fun == 'one') {
//                 repo_github = {
//                     permissions: {
//                         admin: true
//                     },
//                     owner: {
//                         login: 'login'
//                     },
//                     name: 'name'
//                 };

//                 err = null;

//                 done(err, repo_github);

//             } else if (args.fun == 'getHooks') {
//                 webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';

//                 hook1 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook1'
//                 };

//                 hook2 = {
//                     config: {
//                         url: 'http://google.com'
//                     },
//                     id: 'hook2'
//                 };

//                 hook3 = {
//                     config: {
//                         url: webhook_url
//                     },
//                     id: 'hook3'
//                 };
//                 hooks = [hook1, hook2, hook3];

//                 error = null;

//                 done(error, hooks);

//             } else if (args.fun == 'deleteHook') {
//                 error = 'error';
//                 data = null;
//                 done(error, data);
//             }

//         });

//         repo_with = sinon.stub(Repo, 'with', function(args, done) {

//             repoTest = 'repoTest';
//             err = null;

//             done(err, repoTest);
//         });


//         req = {
//             args: {
//                 uuid: 'uuid'
//             },
//             user: {
//                 token: 'token'
//             }
//         };


//         repo.rmv(req, function(err, res) {
//             assert.equal(err, 'error');
//             done();
//         });


//     });



//     afterEach(function() {
//         stub_github_call.restore();
//         repo_with.restore();
//     });

// });
