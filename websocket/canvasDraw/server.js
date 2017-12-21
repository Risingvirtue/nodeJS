var colors = ["#FFC0CB", "#DC143C", "#FFFACD", "#00FF00", "#008000", "#87CEEB",
"#00008B", "#FF00FF", "#F0F8FF", "#C0C0C0"];
var colorNum = [0,1,2,3,4,5,6,7,8,9];

var express = require('express');

var app = express();

var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var s = [];
function newConnection(socket) {
	console.log('New Connection: ' + socket.id);
	s.push(socket);
	console.log(s);
	socket.on('mouse', mouseMsg);
	//socket.emit('color', color());
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
	}
	
	socket.on('dot', dotMsg);
	
	function dotMsg(data) {
		socket.broadcast.emit('dot', data);
	}
	
	socket.on('send', myMsg);
	
	function myMsg(data) {
		socket.broadcast.emit('send', data);
	}
}

function color() {
	var index = Math.floor(Math.random() * colorNum.length);
	var colorAnswer = colors[index];
	colorNum.splice(index, 1);
	return colorAnswer;
}