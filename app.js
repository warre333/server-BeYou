const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketio = require('socket.io');
const http = require('http');
const db = require("./middleware/database/database.connection");
const morgan = require('morgan');
const logger = require("./middleware/logger");

const { addUser, getUsersInRoom, getUser, removeUser } = require("./routes/chats/users");
const { MessageStore } = require("./routes/chats");

const cluster = require('node:cluster');
const totalCPUs = require('node:os').cpus().length;
const process = require('node:process');

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
  
} else {
    startExpress();
}

function startExpress() {
	// Import the routes
	const auth = "./routes/auth/",
	posts = "./routes/posts/",
	users = "./routes/users/",
	search = "./routes/search/",
	chat = "./routes/chats/",
	admin = "./routes/admin/",
	ads = "./routes/advertisements/"


	const app = express();
	const server = http.createServer(app, {
		origin: '*'
	});
	const io = socketio(server, { transports : ['websocket', 'polling', 'flashsocket'] });
	const messageStore = new MessageStore();


    app.use(morgan(':url :method :remote-addr - :remote-user :referrer', { stream: logger.stream }));

	// Webhook receiver for Stripe payments
	app.use("/webhooks", require("./routes/advertisements/start/paid"));

	app.use(cors())
	app.use(express.json());
	app.use(bodyParser.urlencoded({ extended: true }));  
	app.use('/images', express.static('uploads'))
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});


	/*

		Authentication

		/auth/			- To check if a user is logged in
		/auth/login		- Logging in
		/auth/register	- Creating an account

	*/
	app.use("/auth/", require(auth + "index"));
	app.use("/auth/login", require(auth + "login"));
	app.use("/auth/register", require(auth + "register"));

	/*

		Posts

		/posts/				- GET the posts of a user by id or username
		/posts/post			- POST/GET/PATCH/DELETE a post
		/posts/feed			- GET a list of user's friend's posts
		/posts/trending		- GET popular posts
		/posts/like			- GET/POST/DELETE liking of posts
		/posts/comment		- GET/POST/DELETE comments
		/posts/view			- POST a new view of a post
		
	*/
	app.use("/posts/", require(posts + "user-posts"));
	app.use("/posts/post", require(posts + "posts"));
	app.use("/posts/feed", require(posts + "feed"));
	app.use("/posts/trending", require(posts + "trending"));
	app.use("/posts/like", require(posts + "like"));
	app.use("/posts/comment", require(posts + "comments"));
	app.use("/posts/view", require(posts + "view"));

	/*

		Users

		/users/				- GET/DELETE user
		/users/likes		- GET likes from user
		/users/profile		- GET/PATCH profile
		/users/password		- PATCH new password
		/users/email		- PATCH new email
		/users/friends		- GET/GET/POST/DELETE friends

	*/
	app.use("/users", require(users + "index"));
	app.use("/users/likes", require(users + "likes"));
	app.use("/users/profile", require(users + "profile"));
	app.use("/users/password", require(users + "change-password"));
	app.use("/users/email", require(users + "change-email"));
	app.use("/users/friends", require(users + "friends"));

	/*

		Search

		/search		- GET search for users

	*/
	app.use("/search", require(search + "searchbar"));

	/*

		Chat

		/chat			- POST create new chat
		/chat/all		- GET chats

	*/
	app.use("/chat", require(chat + "create"));
	app.use("/chat/all", require(chat + "get-chats"));

	/*

		Advertisements

		/advertisements/			- POST start a payment process for an advertisement
		/advertisements/			- GET the ads from a user
		/advertisements/active		- GET all the active ads
		/advertisements/view		- POST a new view for an ad

	*/
	app.use("/advertisements", require(ads + "start/create-payment"));
	app.use("/advertisements", require(ads + "from-user"));
	app.use("/advertisements/active", require(ads + "active"));
	app.use("/advertisements/view", require(ads + "view"));

	/*

		Admin

		/admin/					- GET check if an admin is logged in
		/admin/analytics		- GET the analytics for the dashboard
		/admin/users			- DELETE an user
		/admin/posts			- GET all users
		/admin/posts			- DELETE a post
		/admin/posts/search		- GET search posts from a user
	*/
	app.use("/admin/", require(admin + "index"));
	app.use("/admin/analytics", require(admin + "analytics"));
	app.use("/admin/users", require(admin + "users/remove"));
	app.use("/admin/posts", require(admin + "posts/get-all"));
	app.use("/admin/posts", require(admin + "posts/remove"));
	app.use("/admin/posts/search", require(admin + "posts/get"));


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
						db.query("SELECT tblchatrooms.*, tblusers.username, tblusers.profile_image FROM tblchatrooms, tblusers, tblchatmembers Member1, tblchatmembers Member2 WHERE tblusers.user_id = Member1.user_id AND Member1.chatroom_id = tblchatrooms.chatroom_id AND tblchatrooms.chatroom_id = Member2.chatroom_id AND Member2.user_id = ? AND Member1.user_id != ? AND tblchatrooms.chatroom_id = ? GROUP BY tblchatrooms.chatroom_id", [user_id, user_id, chatroom], async(err, result) => {
							if(result.length > 0){
								const { error, user } = addUser({ id: user_id, name: result[0].username, chatroom });
			
								if(error) return callback(error);
							
								socket.join(user.chatroom);
			
								const messages = await findMessagesForChat(user.chatroom)
			
								io.to(user.chatroom).emit('roomData', { chatroom: user.chatroom, users: getUsersInRoom(user.chatroom), messages: messages });
							
								callback();
							} else {							
								return callback({success: false, message: "Error: not in room"});
							}
						})					
					}
				})	
			}			
		});

		

		socket.on('sendMessage', ({user_id, chatroom, message}, callback) => {		
			db.query("SELECT tblchatrooms.*, tblusers.username, tblusers.profile_image FROM tblchatrooms, tblusers, tblchatmembers Member1, tblchatmembers Member2 WHERE tblusers.user_id = Member1.user_id AND Member1.chatroom_id = tblchatrooms.chatroom_id AND tblchatrooms.chatroom_id = Member2.chatroom_id AND Member2.user_id = ? AND Member1.user_id != ? AND tblchatrooms.chatroom_id = ? GROUP BY tblchatrooms.chatroom_id", [user_id, user_id, chatroom], async(err, result) => {
				if(result.length > 0){
					const user = getUser(user_id);
				
					io.to(user.chatroom).emit('message', { user_id: user.id, user: user.name, text: message });
					messageStore.saveMessage({ from: user.id, fromUsername: user.name, text: message, to: chatroom });

					callback();
				}
			})
		});

		socket.on('leave', ({user_id}) => {
			const user = removeUser(user_id);

			if(user) {
				io.to(user.chatroom).emit('message', { user: 'Admin', text: `${user.name} has left.` });
				io.to(user.chatroom).emit('roomData', { chatroom: user.chatroom, users: getUsersInRoom(user.chatroom)});
			}
		})
	});
	
	/*

		Algorithms

	*/
	const trending_algorithm = require("./services/trending_algorithm/index");





	// Start server
	server.listen(4000, '10.43.36.26', () => {
		console.log("API has been started on port 4000!");
	})
}