/**
 * Commit Comment Service
 **/

module.service('CommitCommentService', ['$HUB',  function($HUB) {
	
	this.comment = function(body, path, position, line) {

		if(body) {
			$HUB.call('repos', 'createCommitComment', {
				user: $stateParams.user,
				repo: $stateParams.repo,
				sha: $stateParams.sha,
				commit_id: $stateParams.sha,
				body: body,
				path: path,
				position: position,
				line: line
			}, function(err, comment) {
				if(!err) {
					if(!scope.comments) {
						scope.comments = {};
					}
					if(!scope.comments[position]) {
						scope.comments[position] = [];
					}
					scope.comments[position].push(comment.value);
				}

				scope.comment = null;
			});
		}

	};
}]);