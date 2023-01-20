const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const socketio = require('socket.io');
const http = require('http');

const { addUser, getUsersInRoom, getUser, removeUser } = require("./routes/chats/users");
const { MessageStore } = require("./routes/chats");
const { WEBSITE_URL } = require("./config/api.config");

const app = express();
const server = http.createServer(app, {
	origin: '*'
});
const io = socketio(server, { transports : ['websocket', 'polling', 'flashsocket'] });
const messageStore = new MessageStore();

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));  
app.use('/images', express.static('uploads'))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Import the routes
const auth = "./routes/auth/"
const email = "./routes/email/"
const posts = "./routes/posts/"
const users = "./routes/users/"
const search = "./routes/search/"
const chat = "./routes/chats/"

// Let the app use the routes with the right file
// Authentication
app.use("/auth/", require(auth + "index"));
app.use("/auth/login", require(auth + "login"));
app.use("/auth/register", require(auth + "register"));

// Email
// app.use("/email", email);

// Posts
app.use("/posts/", require(posts + "user-posts"));
app.use("/posts/post", require(posts + "posts"));
app.use("/posts/feed", require(posts + "feed"));
app.use("/posts/trending", require(posts + "trending"));
app.use("/posts/like", require(posts + "like"));
app.use("/posts/comment", require(posts + "comments"));
app.use("/posts/view", require(posts + "view"));

app.use("/users", require(users + "index"));
app.use("/users/likes", require(users + "likes"));
app.use("/users/profile", require(users + "profile"));
app.use("/users/password", require(users + "change-password"));
app.use("/users/email", require(users + "change-email"));
app.use("/users/friends", require(users + "friends"));


app.use("/search", require(search + "searchbar"));


app.use("/chat", require(chat + "create"));
// app.use("/chat", require(chat + "index"));
app.use("/chat/all", require(chat + "get-chats"));
// app.use("/chat", require(chat + "create"));

const findMessagesForChat = (chatroom) => {
    const messagesPerUser = [];

    messageStore.findMessagesForChat(chatroom).forEach(async(message) => {
        const { from, fromUsername, to } = message;
				
		messagesPerUser.push({user_id: from, user: fromUsername, text: message.text});
    }); 


	return messagesPerUser
}

io.on('connect', (socket) => {
	socket.on('join', ({ user_id, chatroom }, callback) => {
		if(user_id && user_id !== "none" && chatroom){
			db.query("SELECT * FROM tblusers WHERE user_id = ?", [user_id], async(err, result) => {
				if(err){
					console.log(err);
				} else {
					const { error, user } = addUser({ id: user_id, name: result[0].username, chatroom });
		
					if(error) return callback(error);
				
					socket.join(user.chatroom);

					const messages = await findMessagesForChat(user.chatroom)

					io.to(user.chatroom).emit('roomData', { chatroom: user.chatroom, users: getUsersInRoom(user.chatroom), messages: messages });
				
					callback();
				}
			})	
		}			
	});

	

	socket.on('sendMessage', ({user_id, chatroom, message}, callback) => {
		const user = getUser(user_id);
	
		io.to(user.chatroom).emit('message', { user_id: user.id, user: user.name, text: message });
		messageStore.saveMessage({ from: user.id, fromUsername: user.name, text: message, to: chatroom });

		callback();
	});
  
	socket.on('leave', ({user_id}) => {
	  	const user = removeUser(user_id);
  
		if(user) {
			io.to(user.chatroom).emit('message', { user: 'Admin', text: `${user.name} has left.` });
			io.to(user.chatroom).emit('roomData', { chatroom: user.chatroom, users: getUsersInRoom(user.chatroom)});
		}
	})
});
 
// Algorithms
const trending_algorithm = require("./services/trending_algorithm/index");
const db = require("./middleware/database/database.connection");





// Start server
server.listen(4000, '10.43.36.26', () => {
 	console.log("API has been started on port 4000!");
})