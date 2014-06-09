
var path = require('path');

Object.defineProperty(global, '__stack', {
	get: function() {
		var orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function(_, stack){ return stack; };
		var err = new Error();
		Error.captureStackTrace(err, arguments.callee);
		var stack = err.stack;
		Error.prepareStackTrace = orig;
		return stack;
	}
});

Object.defineProperty(global, '__path', {
	get: function() {
		return path.relative(process.cwd(), __stack[1].getFileName());
	}
});

Object.defineProperty(global, '__line', {
	get: function() {
		return __stack[1].getLineNumber();
	}
});