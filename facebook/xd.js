var login = require("facebook-chat-api");
var credentials = {"email" : "k3273159@mvrht.com", "password" : "promisetest"}

login(credentials, function callback (err, api) {
    if(err) return console.error(err);

    api.listen(function callback(err, message) {
        console.log(message.body);
    });
});