const Discord = require('discord.js');
var register = require('./commands/register.js');
//var messager = require('./commands/messager.js');
var net = require('net');
const bot = new Discord.Client();

const HOST = '10.16.185.66';
const PORT = '5000';

var client = new net.Socket();
var id;

client.connect(PORT, HOST, () => {
	console.log("CONNECTED TO : " + HOST + ":" + PORT);
});

bot.on('message', (message) => {

	if (message.content == '!signup') {

		id = register.signUp(message);

	} else if (message.content.startsWith('!m ')) {

		var msg = getMessageContent(message.content);
		var name = message.content.split(' ')[1];

		sendMessage('m', name, msg.trim());
	} else if (message.content.startsWith('!r ')) {

		var msgIndex = message.content.indexOf(' ');
		var msg = message.content.substring(msgIndex).trim();

		sendMessage('r', '', msg);
	}

});

client.on('data', (data) => {
	console.log("RECIEVED : " + data);
	var message = JSON.parse(data.toString());
	bot.fetchUser(id)
		.then(user => user.sendMessage(message.name + " : " + message.message))
		.catch(console.error);
});

function sendMessage(type, name, message) {

	messageObj = {
		type: type,
		name: name,
		content: message
	};

	var msgObjStr = JSON.stringify(messageObj);
	console.log("WROTE: " + msgObjStr + " TO " + HOST + ":" + PORT);
	client.write(msgObjStr);
}

function getMessageContent(msg) {
	var first = msg.indexOf(' ');
	var second = msg.indexOf(' ', first + 1);
	return msg.substring(second);
}

bot.login('MjkyODI1NDE2NDIxNjA1Mzc2.C69qoA.UepTYH9OIClfrqZLZcLZkDUTzOY');