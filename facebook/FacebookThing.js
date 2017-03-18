var login = require("facebook-chat-api");

module.exports = {
    login: (credentials)=>{
        return new Promise((resolve, reject) => {
            login(credentials, (err, api) => {
                return err ? reject(err) : resolve(api);
            });
        });
    }, 
    sendMessage: (api, userData) => {
        return new Promise((resolve, reject) => {
            api.getUserID(userData.user, (err, arr) => {
                if (err) return reject(err);

                var threadID = arr[0].userID;
                api.sendMessage(userData.text, threadID);
                return resolve("ok");
            });
        });
    },
    recieveMessage: (api, socket) => {
        return new Promise((resolve, reject) => {
            api.listen((err, message)=>{
                var obj = {user: "unknown", text: message.body};
                api.getFriendsList((err, arr)=>{
                    for (var i in arr){
                        if (arr[i].userID == message.senderID){
                            obj.user = arr[i].fullName;
                            break;
                        }
                    }
                    socket.write(JSON.stringify(obj) + "\n");
                    return err ? reject(err) : resolve("yay");
                });
                
                
            });
        });
    }
};