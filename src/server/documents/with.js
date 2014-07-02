
module.exports = exports = function (schema, options) {

	schema.statics.with = function () {

		var keys;
		var args;
		var done;

		if(arguments.length == 2) {
			
			keys = arguments[0];
			done = arguments[1];

			return this.findOne(keys, done);
		}

		if(arguments.length == 3) {
			
			keys = arguments[0];
			args = arguments[1];
			done = arguments[2];

			return this.findOneAndUpdate(keys, args, {upsert: true}, done);
		}

		return done('Schema::with invalid arguments', keys, args);
		
	};


};