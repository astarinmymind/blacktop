const express = require('express');
const app = express();
import Game = require('./game');

/*
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.dev.js');

app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
} else {
    app.use(express.static('dist'));
}

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);
*/

const http = require('http').createServer(app);
const socketIO = require('socket.io');
const io = socketIO(http);
//const io = socketIO(server);

let gameRooms = [];


io.on('connection', function (socket) {
    console.log('A player connected: ' + socket.id);

    // TODO: option for creating game or searching for game
    // when joining, make users enter name
    // currently, adds player to most recently created game
    // probably belongs in a different file

    /*
    socket.on('join', function (playerName: string) {
        let game: Game;
        if (gameRooms.length === 0) {
            game = new Game(io, gameRooms.length());
            addtoDatabase(game);
            gameRooms.push(game);
        } else {
            game = gameRooms[gameRooms.length - 1];
        }
        game.connect(socket, playerName);
    })
    */

    socket.on('disconnect', function () {
        console.log('A player disconnected: ' + socket.id);
    });
    
    //socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    //socket.on(Constants.MSG_TYPES.INPUT, handleInput);
    //socket.on('disconnect', onDisconnect);
});

http.listen(3000, function () {
    console.log('Server started!');
});

module.exports = {
    app,
    http,
    io
};

