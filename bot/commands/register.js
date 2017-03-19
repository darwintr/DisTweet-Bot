signedUp = {};

module.exports =  {
	signUp: (message) => {

		var author = message.author;
		var id = author.id;

		if (!signedUp.id) {
			console.log(message.author.id + ": " + message.author.username + " has been registered");
			signedUp.id = id;
			author.sendMessage(
						"Hi, you have been registered for Facecord messaging."
					);
			return signedUp.id;
		} else {
			author.sendMessage(
					"You are already signed up."
				);
			return;
		}

	}
};