const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const utilities = require('./utilities.js');

const server = http.createServer(app);
// Pass a http.Server instance to the listen method
const io = require('socket.io').listen(server);

// Log messages
const processArgs = utilities.processArgs();
const env = processArgs.env || 'dev';
const port = env === 'prod' ? 80 : 3000;

// The server should start listening
console.log('Server is running on port:', port);
server.listen(port);

// Register the index route of your app that returns the HTML file
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));
app.use(express.static(path.join(__dirname, 'public')));

// Handle connection
io.on('connection', function (socket) {
    // prayer event
    socket.on('prayer', function(msg) {
        socket.broadcast.emit('prayer', msg);
    });
    // comment box event
    socket.on('comments', function(msg) {
        socket.broadcast.emit('comments', msg);
    });
});
