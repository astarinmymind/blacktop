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

var SOCKET_LIST = {};

var LOBBY_LIST = {};

socketIo.on("connection", (socket) => {
	socket.id = Math.random() * 100;
	SOCKET_LIST[socket.id] = socket;
	console.log("New Client connected: " + 	socket.id);
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket), 100);
	socket.on("disconnect", () => {
		delete SOCKET_LIST[socket.id];
		console.log("Client disconnected: " +  socket.id);
		clearInterval(interval);
	});
	socket.on('ID', (id) => {
	for (var i in SOCKET_LIST)
	{
		var socket = SOCKET_LIST[i];
		console.log(socket.id);
	}
	});
	
	socket.on('makeLobby', (id) => {
		console.log(id);
		var players = {socket};
		LOBBY_LIST[id] = {id, players };
		for (var i in LOBBY_LIST)
		{
			console.log(LOBBY_LIST[i].id);
			for (var k in LOBBY_LIST[i].players)
			{
				console.log(LOBBY_LIST[i].players[k].id);
			}
			console.log('----------');
		}
	});
});

const getApiAndEmit = socket => {
	socket.emit("Title", title);
};

// start express server on port 5000
http.listen(port, () => console.log(`Listening on port ${port}`));