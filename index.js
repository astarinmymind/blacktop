const express = require('express');
const http = require("http").createServer();
const options = {
	cors : true,
	origins:["http://127.0.0.1:3000"],
};
const app = express();
const socketIo = require("socket.io")(http, options);
const port = 5000;
//const index = require("./routes/index");

//app.use(index);

let interval;

const title = 'Dont Draw Card'

socketIo.on("connection", (socket) => {
	console.log("New Client connected");
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket), 100);
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		clearInterval(interval);
	});
	socket.on('ID', (id) => {
		console.log('id: ' + id);
	});
});

const getApiAndEmit = socket => {
	socket.emit("Title", title);
};

// start express server on port 5000
http.listen(port, () => console.log(`Listening on port ${port}`));