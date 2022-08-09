const io = require("socket.io")(3490, {
	cors: {
		origin: "http://localhost:3000",
	},
});

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
	console.log("user connected");
	io.emit("welcome", "Welcome to the chat");

	// take userId and socketId from the client
	socket.on("addUser", (userId) => {
		addUser(userId, socket.id);

		io.emit("getUsers", users);
	});

	// send and get messages
	socket.on("sendMessage", ({ sentBy, receiverId, text }) => {
		const receiver = getUser(receiverId);
		io.to(receiver?.socketId).emit("getMessage", {
			sentBy,
			text,
		});
	});

	// when user disconnects
	socket.on("disconnect", () => {
		removeUser(socket.id);
		console.log("user disconnected");
		io.emit("getUsers", users);
	});
});
