var login = require("facebook-chat-api");

module.exports = {
    login: (email, pass)=>{
        var credentials = {
            "email" : email,
            "password" : pass
        };
        return new Promise((resolve, reject) => {
            login(credentials, (err, api) => {
                return err ? reject(err) : resolve(api);
            });
        });
    }
};
