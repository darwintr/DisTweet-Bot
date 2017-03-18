var Datagram = require("./DataGram.js").DatagramConstructor
var facebookScripts = require("../../facebook/FacebookThing.js")
module.exports = {
	0: (socket, data)=>{
		var credentials = {"email" : data.user, "password" : data.text};

		facebookScripts.login(credentials).then(
			(api) => {

				socket.api = api;
				socket.state = 1;
				return facebookScripts.recieveMessage(api, socket);
			}, (err) => {
				var obj = new Datagram(
					socket.id,
					"xd",
					"xdAgain",
					false
				);
				socket.write(JSON.stringify(obj.data) + "\n");
			}
		).then(
			(message) =>{
				
			}, (err) => {
				console.log("ResponseMap.js:26", err);
			}
		);
			
	},
	1: (socket, data)=>{
		facebookScripts.sendMessage(socket.api, data);
		return new Datagram(socket.id, data.name, data.text, true);
	}
}