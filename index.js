const io = require("socket.io")(3490, {
	cors: {
		origin: "localhost:3000",
	},
});

io.on("connection", (socket) => {
	console.log("user connected");
});
