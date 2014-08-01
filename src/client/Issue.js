
//
// To Do:
// - consider if we actually remove meta info from issue body
// - convert this into an angular service ??
//

function Issue(issue) {

    var sha = /^--- Pull Request #\d*? on commit (\b[0-9a-f]{40}\b) ---/;

    var match = sha.exec(issue.value.body);

    issue.value.sha = null;
    if(match) {
        issue.value.sha = match[1];
        issue.value.body = issue.value.body.replace(match[0], '');
    }

    return issue;
}
