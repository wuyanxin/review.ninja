
var loggly = require('loggly');
 
var client = loggly.createClient({
    token: process.env.LOGGLY,
	subdomain: 'reviewninja',
	json: true
});

module.exports = {
	log: function() {
		if(process.env.NODE_ENV === 'production') {
			client.log.apply(client, arguments);
		}
	}
};