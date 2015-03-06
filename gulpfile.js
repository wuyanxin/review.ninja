var requireDir = require('require-dir');
var pkg = require('./package.json');

requireDir('./gulp/tasks', { recurse: true });
