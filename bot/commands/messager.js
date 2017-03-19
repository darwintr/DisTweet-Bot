var net = require('net');

module.exports = {

	sendMessage: (client, type, name, message) => {
		messageObj = {
			type,
			name,
			message
		};

		var msgObjStr = JSON.stringify(messageObj);
		console.log("WROTE: " + msgObjStr + " TO " + HOST + ":" + PORT);
		client.write(msgObjStr);
	}
};