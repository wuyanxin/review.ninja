// *****************************************************
// Commit Comment Service
// *****************************************************

module.factory('$CommitCommentService', ['$q', '$HUB', '$RPC', function($q, $HUB, $RPC) {
	return {
		comment: function(user, repo, sha, body, path, position, line) {
			var deferred = $q.defer();

			$HUB.call('repos', 'createCommitComment', {
				user: user,
				repo: repo,
				sha: sha,
				commit_id: sha,
				body: body,
				path: path,
				position: position,
				line: line
			}, function(err, comment) {
				if(err) {
					deferred.reject();
				}
				else {
					deferred.resolve(comment.value);
				}
			});

			return deferred.promise;
		},

		issue: function(user, repo, sha, body, path, line) {
			var deferred = $q.defer();

			var title = 'Issue with commit ' + sha;

			$RPC.call('issue', 'add', {
				user: user,
				repo: repo,
				comm: sha,
				title: title,
				body: body,
				path: path,
				line: line
			}, function(err, issue) {
				if(err) {
					deferred.reject();
				}
				else {
					deferred.resolve(issue.value);
				}
			});
			
			return deferred.promise;
		}
	};
}]);