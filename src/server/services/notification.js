module.exports = {
  pull_request_opened: function(user, repo_name, number, sender, review_url) {
    // start a review: send messages to appropriate users
    console.log('pull request #' + number + ' opened for ' + user + '/' + repo_name + ' by ' + sender.login + ', review at: ' + review_url);
  },
  pull_request_synchronized: function(user, repo_name, number, sender, review_url) {
    // a pull request you have been reviewing has a new commit
    console.log('pull request #' + number + ' synchronized for ' + user + '/' + repo_name + ' by ' + sender.login + ', review at: ' + review_url);
  }
};
