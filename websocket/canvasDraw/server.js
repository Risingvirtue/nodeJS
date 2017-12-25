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

var words = require('./node_modules/names/words.js');
var s = [];
var num = 0;
var currTime = 60;
var maxTime = 60;
var currWord;
var revealedIndex = [];
var currPlayer;
var playerList = [];
var playerIndexes = [];
var inProgress = false;
var numCorrect = 0;
function newConnection(socket) {
	console.log('New Connection: ' + socket.id);
	for (d of s) {
		if ('name' in d) {
			var data = {icon: d.icon, name: d.name, num: d.num};
			socket.emit('nameInfo', data);
		}
	}
	s.push({socket: socket, id: socket.id, num: num});
	console.log(s.length);
	num += 1;
	socket.on('join', joinMsg);
	
	function joinMsg(data) {
		for (d of s) {
			if (d.id == socket.id) {
				d.name = data.name;
				d.icon = data.icon;
				data.num = d.num;
			}
		}
		data.color = "#9370DB";
		socket.broadcast.emit('join', data);
		socket.emit('selfJoin', data);
	}
	
	socket.on('disconnect', remove);
	
	function remove() {
		for (d of s) {
			if (d.id == socket.id) {
				var data = {num: d.num};
				socket.broadcast.emit('leave', data);
				s.splice(s.indexOf(d), 1);
				console.log('number left in server" ', s.length);
				return;
			}
		}
	}

	socket.on('start', initiate);
	
	function initiate() {
		if (inProgress) {
			return;
		}
		inProgress = true;
		console.log('initiate');
		currTime = maxTime;
		playerList = [];
		playerIndexes = [];
		revealedIndex = [];
		for (var i =0; i < s.length; i++) {
			playerList.push({socket: s[i].socket, id: s[i].id,num: s[i].num});
			playerIndexes.push(i);
		}
		startRound();
	}
	
	function startRound() {
		var randPlayer = Math.floor(Math.random() * playerIndexes.length);
		playerIndexes.splice(randPlayer, 1);
		currPlayer = playerList[randPlayer].socket;
		var playerNum = playerList[randPlayer].num;
		currWord = words.word();
		var data = {word: currWord, num: playerNum};
		currPlayer.broadcast.emit('start', data);
		currPlayer.emit('startDraw', data);
		console.log(currWord);
		interval = setInterval(update, 1000);
	}
	function update() {
		currTime -= 1;
		var data = {currTime: currTime, maxTime: maxTime};
		io.sockets.emit('time', data);
		if (currTime == 30) {
			var index = Math.floor(Math.random() * currWord.length);
			revealedIndex.push(index);
			var d = {index: index, letter: currWord[index]};
			//console.log(d);
			io.sockets.emit('updateWord', d);
		} else if (currTime == 15) {
			var list = [];
			for(var i = 0; i < currWord.length; i++) {
				if (!revealedIndex.includes(i)) {
					list.push(i);
				}
			}
			var index = Math.floor(Math.random() * list.length);
			var d = {index: index, letter: currWord[index]};
			io.sockets.emit('updateWord', d);
		}
		if (currTime == 0) {
			clearInterval(interval);
			currTime = maxTime;
			inProgress = false;
		}
	}

	socket.on('mouse', mouseMsg);
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
		
	}
	
	socket.on('dot', dotMsg);
	
	function dotMsg(data) {
		socket.broadcast.emit('dot', data);
	}
	
	socket.on('send', myMsg);
	
	function myMsg(data) {
		if (data.message == currWord) {
			if (socket.id != currPlayer) {
				
				var d = {word: currWord};
				socket.emit('correct', d);
			}
		} else {
			io.sockets.emit('send', data);
		}
		
	}
	socket.on('clear', clear);
	
	function clear(data) {
		socket.broadcast.emit('clear', data);
	}
}
function color() {
	var index = Math.floor(Math.random() * colorNum.length);
	var colorAnswer = colors[index];
	colorNum.splice(index, 1);
	return colorAnswer;
}

function isCorrect(id) {
	for (
}