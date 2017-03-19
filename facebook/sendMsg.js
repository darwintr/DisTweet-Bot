var credentials = {

}
var userData = {

}
var readline = require('readline');
var facebookScripts = require("./FacebookThing.js")
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var readIn = (question) => {
	return new Promise((resolve, reject)=>{
		var rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		});			
		
		r1.question(question, (answer) => {
			return resolve(answer);
		}) 

	});
}



readIn(">>What's your email?  ").then(
	(answer) => {
		return readIn(">>What's your password?", (pw) =>{
			credentials.email = answer;
		   	credentials.password = pw;
		   	return resolve(credentials)
		})
	}
).then(
	(credentials) => {
		return facebookScripts.login(credentials);
	}
).then(
	(api) => {
		return readIn(">>Who do you want to send your msg to?  ", (user) =>{
  			userData.user = user;
   			return resolve(userData);
  		}) 			
   	}
).then(
	(userData) => {
		return readIn(">>Please type in your msg:  ", (text)=>{
			userData.text = text;
			return facebookScripts.sendMessage(api, userData);
		})
	}
)

// rl.question(">>What's your email?  ", function(answer) {
// 	   rl.question(">>What's your password?  ", function(pw) {
// 		   credentials.email = answer;
// 		   credentials.password = pw;
// 		   facebookScripts.login(credentials).then(
// 		   		(api) => {
// 		   			rl.question(">>Who do you want to send your msg to?  ", function(user) {
// 				  		userData.user = user;
// 				   		rl.question(">>Please type in your msg:  ", function(text) {
// 				   			userData.text = text;
// 				   			facebookScripts.sendMessage(api, userData);
// 				   		})
// 				   	})
		   				
// 		   		}, (err) => {

// 		   		}
			   
// 	   		)
//    	})
// });

//n1359620@mvrht.com
//pokemonmaster