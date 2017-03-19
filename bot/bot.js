const Discord = require('discord.js');
var register = require('./commands/register.js');
//var messager = require('./commands/messager.js');
var net = require('net');
const bot = new Discord.Client();

const HOST = '10.16.185.66';
const PORT = '5000';
const MAX_TWEETS = 20;

var client = new net.Socket();
var id;

var tweetBuffer = [];
var currTweetCount = 0;

client.connect(PORT, HOST, () => {
	console.log("CONNECTED TO : " + HOST + ":" + PORT);
});

bot.on('message', (message) => {

	if (message.content == '!signup') {

		id = register.signUp(message);

	} else if (message.content.startsWith('!m ')) {
		if (id) {

			var msg = getMessageContent(message.content);
			var name = message.content.split(' ')[1];
			sendMessage('m', name, msg.trim());

		} else {

			message.author.reply("Please use !signup before using" +
				" the other commands");

		}

	} else if (message.content.startsWith('!r ')) {
		if (id) {

			var msgIndex = message.content.indexOf(' ');
			var msg = message.content.substring(msgIndex).trim();
			sendMessage('r', '', msg);

		} else {

			message.author.reply("Please use !signup before using" +
				" the other commands");

		}
	}

});

client.on('data', (data) => {
	console.log("RECIEVED : " + data);
	var message = JSON.parse(data.toString());

	if (id) {
		var prefix = getPrefix(message);
		bot.fetchUser(id)
			.then((user) => {

				if (tweetBuffer.length > 0)
					dumpBuffer(user);
				user.sendMessage("**" + prefix + message.name + "** : "
							+ message.message)
			})
			.catch(console.error);

	} else {
		cacheTweet(message);
	}
});

function cacheTweet(message) {
	if (currTweetCount >= MAX_TWEETS) {
		currTweetCount = 0;
	}
	tweetBuffer[currTweetCount] = message;
	currTweetCount += 1;
}

function dumpBuffer(user) {
	for (message of tweetBuffer) {
		prefix = getPrefix(message);
		user.sendMessage("**" + prefix + message.name + "** : "
			+ message.message);
	}
	tweetBuffer = [];
}

function getPrefix(message) {
	return message.src == "twitter" ? "<TWITTER> " : "<FACEBOOK> ";
}

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