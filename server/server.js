var express = require('express');
var app = express();
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
var http = require('http').createServer(app);
var socketIO = require('socket.io');
var io = socketIO(http);
//const io = socketIO(server);
io.on('connection', function (socket) {
    console.log('A player connected: ' + socket.id);
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
//# sourceMappingURL=server.js.map