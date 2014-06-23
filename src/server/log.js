
var loggly = require('loggly');
 
var client = loggly.createClient({
    token: process.env.LOGGLY,
	subdomain: 'reviewninja',
	tags: ['nodejs'],
	json: true
});

module.exports = {
	log: function() {
		client.log.apply(client, arguments);
	}
};