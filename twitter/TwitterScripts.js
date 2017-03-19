var client = require("./TwitterCred.js");

module.exports = new Promise(
	(resolve, reject) =>{
		client.get('friends/ids',  function(error, tweets, response) {
			if (error) 
				reject(error);
			var str = response.body;

			var l = str.indexOf("[");
			var r = str.indexOf("]");
			var stream = client.stream('statuses/filter', {follow : str.substring(l + 1, r)});
		    resolve(stream);
		});
	}
)



