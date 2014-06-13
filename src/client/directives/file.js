module.directive('file', ['$stateParams', '$HUB', function($stateParams, $HUB) {
	return {
		restrict: 'E',
		templateUrl: '/directives/templates/file.html',
		scope: {
			path: '=',
			content: '=',
			comments: '='
		},
		link: function(scope, elem, attrs) {

			scope.$watch('content', function(newVal, oldVal) {
				if(newVal) {
					scope.lines = scope.content.trim().replace(/\t/g, '    ').split('\n');
				}
			});

			//
			// Actions
			//

			scope.addComment = function(body, path, position, line) {

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
							if(!scope.comments[line]) {
								scope.comments[line] = [];
							}
							scope.comments[line].push(comment.value);
						}

						scope.comment = null;
					});
				}
			};
		}
	}
}]);