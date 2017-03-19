

var prompt = require('prompt');

var net = require('net');


var twitter = require('./twitter/TwitterScripts.js')
var fb = require('./facebook/FacebookScripts.js');

var allowConnect = true;

var globalId = 0;

// Start the prompt
prompt.start();

var schema = {
    properties: {
        email: {
        },
        password: {
            hidden: true
        }
    }
};

function ask() {
    // Ask for name until user inputs "done"
    prompt.get(schema, function(err, result) {
        fb.login(result.email, result.password).then(
            (api) => {
                console.log("Server running port 5000\n");
                net.createServer((socket)=>{
                    console.log("Connection from: ", socket.remotePort);
                    socket.id = globalId ++;
                    socket.senderID = -1;
                    socket.setEncoding('utf8');
                    if (!allowConnect){
                        socket.end("already a connection!\n");
                    }
                    allowConnect = false;
                    socket.setNoDelay(true);
                    socket.on('data', (data) => {
                        var stringData = data.toString();
                        try{
                            var obj = JSON.parse(stringData);
                        } catch (e){
                            return;
                        }
                        if (obj.type == "r"){
                            if (socket.senderID == -1){
                                var obj2 = {
                                    type : "message",
                                    name : "SERVER",
                                    message : "You have not recieved any messages yet!"
                                };
                                socket.write(JSON.stringify(obj2) + "\n");
                            } else {
                                api.sendMessage(obj.content, socket.senderID)
                            }
                        } else {
                            api.getUserID(obj.name, (err, arr) => {
                                var threadID = arr[0].userID;
                                api.sendMessage(obj.content, threadID)
                            });
                        }
                    });

                    socket.on('end', function() {
                        console.log("Exited");
                        if (socket.id == 0){
                            allowConnect = true;
                            globalId = 0;
                        }
                    });

                    socket.on('error', function (exc) {
                        console.log("ignoring exception: " + exc);
                        socket.end();
                        if (socket.id == 0){
                            allowConnect = true;
                            globalId = 0;
                        }
                    });
                    api.listen((err, message)=>{
                        api.getUserInfo(message.senderID, (err, obj)=>{
                            if(err) 
                                return console.error(err);
                            var obj2 = {
                                name : obj[message.senderID].name,
                                type : "message",
                                src : "facebook"
                            }

                            if (message.body != null){
                                obj2.message = message.body;
                                
                                socket.write(JSON.stringify(obj2) + "\n");
                            } 

                            message.attachments.forEach(
                                (val) =>{
                                    obj2.message = val.previewUrl;
                                    socket.write(JSON.stringify(obj2) + "\n");
                                }
                            );



                            socket.senderID = message.senderID;

                            
                        });

                        
                    });
                    twitter.then(
                        (stream) => {
                            
                            stream.on('data', function(event) {
                                var str2 = event.text;
                                var str3 = event.user.screen_name;
                                var obj = {};
                                obj.type = "message";
                                obj.name = str3;
                                obj.message = str2;
                                obj.src = "twitter";
                                socket.write(JSON.stringify(obj) + "\n");
                            });
                             
                            stream.on('error', function(error) {
                                console.log(error);
                            });
                          
                        }

                    )

                }).listen(5000);
            }, (err) =>{
                ask();
            }

        );
    });
}

ask();