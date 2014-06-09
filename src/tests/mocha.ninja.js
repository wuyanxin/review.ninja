module.exports = Reporter;

function Reporter(runner) {
		
	var failures = 0;
	var comments = [];
	var issues = [];
	var vote = '+';

	runner.on('pass', function(test) {
		// Nothing to do
	});

	runner.on('fail', function(test, err) {
		try {
			comments.push({
				path: err.message.file,
				line: err.message.line,
				body: test.title
			});
			issues.push({
				path: err.message.file,
				line: err.message.line,
				title: test.title
			});
			vote = '-';
		} catch(ex) {

		}
		failures++;
	});

	runner.on('end', function() {
		try {
			console.log(JSON.stringify({
				comments: comments,
				issues: issues,
				vote: vote
			}));
		} catch(ex) {

		}
		process.exit(failures);
	});

}