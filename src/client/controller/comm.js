// *****************************************************
// Commit Controller
//
// tmpl: comm.html
// path: /:user/:repo/commit/:sha
// resolve: repo, comm 
// *****************************************************

module.controller('CommCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$CommitCommentService', 'repo', 'comm', function($scope, $stateParams, $HUB, $RPC, $CommitCommentService, repo, comm) {

	// get the repo
	$scope.repo = repo;

	// get the commit
	$scope.comm = comm;

	// get the statuses
	$scope.stat = $HUB.call('statuses', 'get', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $stateParams.sha,
	});

	// get the tree (required for the file browser)
	$scope.tree = $HUB.call('gitdata', 'getTree', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $stateParams.sha,
	});

	// get your vote
	$scope.vote = $RPC.call('vote', 'get', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $stateParams.sha,
	});

	// get votes
	$scope.votes = $RPC.call('vote', 'all', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $stateParams.sha,
	});

	// get comments
	$scope.comments = {
		diff: {},
		file: {}
	};

	$scope.commitComments = $HUB.call('repos', 'getCommitComments', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $stateParams.sha
	}, function(err, comments) {
		comments.value.forEach(function(comment) {

			// In the future we will have to do one of the following:
			//
			// 1) map all line comments to line numbers (preferred)
			// 2) map all line comments to patch positions
			//    - not preferred but may be necessary due to line #s being deprecated

			if(comment.position) {
				if(!$scope.comments.diff[comment.path]) {
					$scope.comments.diff[comment.path] = {};
				}
				if(!$scope.comments.diff[comment.path][comment.position]) {
					$scope.comments.diff[comment.path][comment.position] = [];
				}
				$scope.comments.diff[comment.path][comment.position].push(comment);
			}

			if(comment.line) {
				if(!$scope.comments.file[comment.path]) {
					$scope.comments.file[comment.path] = {};
				}
				if(!$scope.comments.file[comment.path][comment.line]) {
					$scope.comments.file[comment.path][comment.line] = [];
				}
				$scope.comments.file[comment.path][comment.line].push(comment);
			}
		});
	});

	// get issues
	$scope.issue = $HUB.call('issues', 'repoIssues', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		state: 'open',
		labels: 'review.ninja'
	}, function() {
		$scope.issue.value.forEach(function(c) {
			$HUB.call('issues', 'getComments', {
				user: $stateParams.user,
				repo: $stateParams.repo,
				number: c.number
			}, function(err, com) {
				c.fetchedComments = com;
			});
		});
	});

	// get ninja config file
	$scope.ninja = $RPC.call('comm', 'get', {
		uuid: $scope.repo.value.id,
		user: $stateParams.user,
		repo: $stateParams.repo,
		comm: $stateParams.sha
	}, function() {
		$scope.ninja.value.config = JSON.parse($scope.ninja.value.ninja);
	});

	//
	// Actions
	//

	$scope.castVote = function(value) {
		$scope.vote = $RPC.call('vote', 'set', {
			// repo uuid
			repo: $scope.repo.value.id,
			// comm uuid
			comm: $stateParams.sha,
			// vote
			vote: value
		});
	};

	$scope.comment = function(body, issue, path, position, line) {

		if(body) {
			$CommitCommentService.comment($stateParams.user, $stateParams.repo, $stateParams.sha, body, path, position, line)
				.then(function(comment) {

					$scope.commitComments.value.push(comment);

					if(comment.position) {
						if(!$scope.comments.diff[comment.path]) {
							$scope.comments.diff[comment.path] = {};
						}
						if(!$scope.comments.diff[comment.path][comment.position]) {
							$scope.comments.diff[comment.path][comment.position] = [];
						}
						$scope.comments.diff[comment.path][comment.position].push(comment);
					}

					if(comment.line) {
						if(!$scope.comments.file[comment.path]) {
							$scope.comments.file[comment.path] = {};
						}
						if(!$scope.comments.file[comment.path][comment.line]) {
							$scope.comments.file[comment.path][comment.line] = [];
						}
						$scope.comments.file[comment.path][comment.line].push(comment);
					}
				});

			if(issue) {
				$CommitCommentService.issue($stateParams.user, $stateParams.repo, $stateParams.sha, body, path, line);
			}
		}
	};

	// $scope.compComm = function(commit) {
	// 	$scope.comp = $HUB.call('repos', 'compareCommits', {
	// 		user: $stateParams.user,
	// 		repo: $stateParams.repo,
	// 		// head sha
	// 		head: $stateParams.sha,
	// 		// base sha
	// 		base: commit
	// 	});
	// };

	// if($scope.comm.value.parents.length > 0) {
	// 	$scope.compComm($scope.comm.value.parents[0].sha);
	// }

}]);
