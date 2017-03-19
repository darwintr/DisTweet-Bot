signedUp = {};

module.exports =  {
	signUp: (message) => {

		var author = message.author;
		var id = author.id;

		if (!signedUp.id) {
			console.log(author.id + ": " + author.username + " has been registered");
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
	},

	signOut: (message) => {

		var author = message.author;
		var id = author.id;

		if (signedUp.id) {
			console.log(author.id + ": " + author.username + " has been signed out")
			signedUp.id = null;
		} else {
			author.sendMessage(
				"You can't sign out if you aren't signed in"
			);
		}
	}
};