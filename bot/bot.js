
const Discord = require('discord.js');
var register = require('./commands/register.js');
var net = require('net');
const bot = new Discord.Client();
const key = require('./key.js');

const HOST = '10.16.185.66';
const PORT = '5000';
const MAX_TWEETS = 20;

var client = new net.Socket();
var id = 0;
var recieveTweets = false;

var tweetBuffer = [];
var currTweetCount = 0;

client.connect(PORT, HOST, () => {
	console.log("CONNECTED TO : " + HOST + ":" + PORT);
});

bot.on('message', (message) => {

	// Command handling

	/*
		User must signup before using any of the commands as the users id
		must be obtained for them to work
	*/

	if (message.content == '!signup') {

		id = register.signUp(message);

	} else if (message.content.startsWith('!m ')) {
		// Command usage : !m [name] [message]
		if (id) {
			var msg = getMessageContent(message.content);
			var name = message.content.split(' ')[1];
			sendMessage('m', name, msg.trim());
		} else {
			message.reply("Please use !signup before using" +
				" the other commands");
		}

	} else if (message.content.startsWith('!r ')) {
		// Command usage : !r [message]
		// !r replies to whoever sent you a message last
		if (id) {

			var msgIndex = message.content.indexOf(' ');
			var msg = message.content.substring(msgIndex).trim();
			sendMessage('r', '', msg);

		} else {

			message.reply("Please use !signup before using" +
				" the other commands");

		}
	} else if (message.content == '!signout') {
		id = 0;
		register.signOut(message);
		client.destroy();

	} else if (message.content == "!starttweets") {
		console.log("STARTING TO RECIEVE TWEETS");
		recieveTweets = true;

	} else if (message.content == "!endtweets") {
		console.log("STOPPING TWEETS");
		recieveTweets = false;

	} else if (message.content == '!help') {
		message.reply("Available commands:\n" +
			"!signup\n" +
			"!signout\n" +
			"!starttweets\n" +
			"!endtweets\n" +
			"!m [name] [message]\n" +
			"!r [message]");
	}

});

client.on('data', (data) => {
	console.log("RECIEVED : " + data);
	var message = JSON.parse(data.toString());

	if (recieveTweets) {
		var prefix = getPrefix(message);
		bot.fetchUser(id)
			.then((user) => {
				// Dump buffer if exists
				if (tweetBuffer.length > 0)
					dumpBuffer(user);
				// Otherwise parse and send message
				user.sendMessage("**" + prefix + message.name + "** : "
							+ message.message)
			})
			.catch(console.error);

	} else {
		// If user is not registered, cache the tweet/message
		cacheTweet(message);
	}
});

function cacheTweet(message) {
	// Adds the message to the buffer up to MAX_TWEETS
	if (currTweetCount >= MAX_TWEETS) {
		currTweetCount = 0;
	}
	tweetBuffer[currTweetCount] = message;
	currTweetCount += 1;
}

function dumpBuffer(user) {
	// Send every message in the buffer
	user.sendMessage("**--------------- WHILE YOU WERE GONE ---------------**\n\n");
	for (message of tweetBuffer) {
		prefix = getPrefix(message);
		user.sendMessage("**" + prefix + message.name + "** : "
			+ message.message);
	}
	user.sendMessage("** --------------- END OF BUFFER --------------- **");
	tweetBuffer = [];
}

function getPrefix(message) {
	return message.src == "twitter" ? "<TWITTER> " : "<FACEBOOK> ";
}

function sendMessage(type, name, message) {
	// Send message to FB server
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
	// Parse your message string
	var first = msg.indexOf(' ');
	var second = msg.indexOf(' ', first + 1);
	return msg.substring(second);
}

// use your own key
bot.login(key.clientId);