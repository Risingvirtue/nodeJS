var socket;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); 
var mouseDown =  false;
var mousePos = {};
var preMousePos = {x: -1, y:-1};
var r = 20;
var color = "blue";
var rect = canvas.getBoundingClientRect();
var noDraw = true;
var erase = false;
var currPen = 1;
var currEraser = 1;
var size = ["xs", "sm", "md", "lg"];
var color;
var name;
var animals = ["Rabbit", "Jellyfish", "Panda", "Deer", "Lobster", "Tiger", "Raccoon", "Shark", "Dolphin", "Hedgehog",
"Cat", "Dog", "Hamster", "Piglet", "Octopus", "Derp", "Derpette", "Koala", "Kangaroo"];
var inMemCanvas = document.getElementById('memCanvas');
var inMemCtx = inMemCanvas.getContext('2d');
var list = [];
var currIndex = 0;

$(document).ready(function() {
	fitToContainer(canvas);
	//fill to white
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	socket = io.connect('http://localhost:3000');
	//socket = io.connect('http://18.221.234.35');
	//listening to server
	socket.on('mouse', draw);
	socket.on('dot', dotDraw);
	socket.on('send', reSend);
	socket.on('join', addList);
	socket.on('selfJoin', addSelf);
	socket.on('leave', rmList);
	socket.on('nameInfo', addList);
	socket.on('clear', receiveClear);
	$(window).resize(function() {
		fitToContainer(canvas);
	});
	//initiate active pen and size
	$("#pencil").toggleClass("select");
	$("#smPen").toggleClass("selectSize");
	$("#smEraser").toggleClass("selectSize");
	$("#up").css('visibility', 'hidden');
	$("#down").css('visibility', 'hidden');
});


function fitToContainer(canvas){
	inMemCanvas.width = canvas.width;
    inMemCanvas.height = canvas.height;
    inMemCtx.drawImage(canvas, 0, 0);
	// Make it visually fill the positioned parent
	canvas.style.width ='100%';
	canvas.style.height='100%';
	// ...then set the internal size to match
	canvas.width  = canvas.offsetWidth;
	
	canvas.height = canvas.offsetHeight;
	canvas.height = Math.floor($(window).height() * 2 / 3);
	
    ctx.drawImage(inMemCanvas, 0, 0, canvas.width, canvas.height);
	$("#text").css("height", Math.floor($(window).height() * 8 / 15));
	$("#message").css("height", Math.floor($(window).height() * 2 / 15));
	$("#names").css("height", Math.floor($(window).height() / 3));
	$(".name").css("height", Math.floor($(window).height() / 30));
	$(".arrow").css("height", Math.floor($(window).height() / 30));
	changeGame();
	
}

function changeGame() {
	$(".game").css('width', canvas.width);
	$(".game").css('height', canvas.height / 6);
	$(".well").css('height', canvas.height / 6);
	$(".title").css('font-size', canvas.width / 20);
	$(".time").css('height', canvas.height / 5);
	$(".time").css('width', canvas.height / 5);
}

function receiveClear() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.fillRect(0,0, canvas.width, canvas.height);
}
function canvasClear() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.fillRect(0,0, canvas.width, canvas.height);
	var data = {};
	socket.emit('clear', data);
}
function switchPen(s) {
	$("#" + size[currPen] + "Pen").toggleClass("selectSize");
	$("#" + size[s] + "Pen").toggleClass("selectSize");
	currPen = s;
}

function switchEraser(s) {
	$("#" + size[currEraser] + "Eraser").toggleClass("selectSize");
	$("#" + size[s] + "Eraser").toggleClass("selectSize");
	currEraser = s;
	currEraser = s;
}

//when a person joins the room: adds name and icon to chat
function join() {
	fitToContainer(canvas);
	var n = $("#name").val();
	if (n == "") {
		name = animals[Math.floor(Math.random() * animals.length)];
	} else {
		name = n;
	}
	var icon = icons[Math.floor(Math.random() * icons.length)];
	var data = {icon: icon, name: name};
	socket.emit('join', data);
	$('.modal').css('display', 'none');
	noDraw = false;
	$("#message").focus();
}

function addList(data) {
	list.push(data);
	display();
	
}

function addSelf(data) {
	list.unshift(data);
	display();
}

//shows sockets that are present (up to 4)
function display() {
	
	if (noDraw) {
		$("#row0").css("color", "black");
	} else {
		$("#row0").css("color", "#6A5ACD");
	}
	for (var i =0; i < 4; i++) {
		var index = i;
		if (i != 0) {
			index = i + currIndex;
		}
		
		if (index < list.length) {
			changeName(i, list[index].icon, list[index].name);
			
		} else {
			$("#row" + index).css("visibility", "hidden"); 
		}
	}
	buttonVisible();
}
//helper function to display names
function changeName(i, icon, name) {
	$("#row" + i).css("visibility", "visible");
	$("#icon" + i).removeClass();
	$("#icon" + i).addClass("fa");
	$("#icon" + i).addClass(icon);
	$("#name" + i).html(name);
}


//handles what the up and down arrows do
function buttonVisible() {
	if (list.length < 5) {
		$("#up").css('visibility', 'hidden');
		$("#down").css('visibility', 'hidden');
	} else {
		$("#down").css('visibility', 'visible');
		$("#up").css('visibility', 'visible');
		if (currIndex > 0) {
			$("#up").css("color", "#eee");
		} else {
			$("#up").css("color", "black");
		}
		if (currIndex + 4 < list.length) {
			$("#down").css("color", "#eee");
			
		} else {
			$("#down").css("color", "black");
		}
	}
}
//run when a button is pressed
function up() {
	currIndex = Math.max(0, currIndex - 1);
	display();
}
function down() {
	currIndex = Math.min(list.length - 4, currIndex + 1);
	display();
}


//run when someone disconnects- removes their name from chat
function rmList(data) {
	for (s of list) {
		if (s.num == data.num) {
			list.splice(list.indexOf(s),1);
		}
	}
	display();
}

//sends messages
function send() {
	var message = $("#message").val();
	message = message.split('\n').join('');
	if (message != "") {
		$("#text").val($("#text").val() + name + ": " + message + "\n");
		var m = document.getElementById('text');
		m.scrollTop = m.scrollHeight;
		$("#message").val("");
		var data = {name: name, message: message};
		socket.emit('send', data);
	}
}

function reSend(data) {
	$("#text").val($("#text").val() + data.name + ": " + data.message + "\n");
}

//draws dots when mousedown
function dotDraw(data) {
	if (erase) {
		data.color = "white";
	}
	ctx.beginPath();
	var x = convert(data.x, canvas.width);
	var y = convert(data.y, canvas.height);
	ctx.arc(x, y, data.width / 2, 0, Math.PI * 2);
	ctx.fillStyle= data.color;
	ctx.fill();
	ctx.closePath();
}

//draws a line from one location to another
function draw(data) {
	ctx.beginPath();
	ctx.strokeStyle = data.color;
	var x1 = convert(data.x1, canvas.width); var y1 = convert(data.y1, canvas.height);
	var x2 = convert(data.x2, canvas.width); var y2 = convert(data.y2, canvas.height); 
	ctx.moveTo(x1, y1);
	ctx.lineCap = 'round';
	ctx.lineWidth = data.width;
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}
//helper function for resizing
function convert(x, length) {
	return Math.floor(x * length);
}
document.body.addEventListener("mousedown", function (e) {
	mouseDown = true;
	var rect = canvas.getBoundingClientRect();
	var x = Math.round((e.clientX-rect.left)/(rect.right-rect.left) * canvas.width);
    var y = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top) * canvas.height);
	var c = $("#canvas").offset();
	console.log(e.pageX - c.left, x);
	mousePos.x = x;
	mousePos.y = y;
	if (mousePos.x < 0 || mousePos.x > canvas.width || mousePos.y < 0 || mousePos.y > canvas.height) {
		return;
	}
	//console.log(mousePos.x, mousePos.y);
	var width = (currPen + 1) * 5; 
	var data = {x: mousePos.x / canvas.width, y: mousePos.y / canvas.height, width: width, color: color, erase: erase};
	dotDraw(data);
		
});

document.body.addEventListener("mouseup", function (e) {
	mouseDown = false;
	
});

document.body.addEventListener("mousemove", function (e) {
	if (noDraw) {
		return;
	}
	var c = $("#canvas").offset();
	//console.log(e.pageX - offset.left);
	var rect = canvas.getBoundingClientRect();
	var eX = Math.round((e.clientX-rect.left) / (rect.right-rect.left) * canvas.width);
    var eY = Math.round((e.clientY-rect.top) / (rect.bottom-rect.top) * canvas.height);
	if (mouseDown && !erase) {
		var width = (currPen + 1) * 5; 
		var data = {x1: mousePos.x / canvas.width, y1: mousePos.y / canvas.height, 
					x2: eX/canvas.width, y2: eY/canvas.height, color: color, width: width, erase: false};
		draw(data);
		socket.emit('mouse', data);
		
		mousePos.x = eX; mousePos.y = eY;
	} else if (mouseDown && erase) {
		var width = (currEraser + 1) * 5; 
		var data = {x1: mousePos.x / canvas.width, y1: mousePos.y / canvas.height, 
					x2: eX/canvas.width, y2: eY/canvas.height, color: "white", width: width, erase: true};
		socket.emit('mouse', data);
		draw(data);
		mousePos.x = eX; mousePos.y = eY;
	}
});
//listeners for pen and eraser
$("#pencilButton").click(function() {
	if (erase) {
		erase = false;
		$("#pencil").toggleClass("select");
		$("#eraser").toggleClass("select");
		$(".eraserSize").css("visibility", "hidden");
	} else {
		var visible = $(".pencilSize").css("visibility");
		if (visible == "visible") {
			$(".pencilSize").css("visibility", "hidden");
		} else {
			$(".pencilSize").css("visibility", "visible");
			$(".eraserSize").css("visibility", "hidden");
		}
	}	
});
	
$("#eraserButton").click(function() {
	if (!erase) {
		erase = true;
		$("#pencil").toggleClass("select");
		$("#eraser").toggleClass("select");
		$(".pencilSize").css("visibility", "hidden");
	} else {
		var visible = $(".eraserSize").css("visibility");
		if (visible == "visible") {
			$(".eraserSize").css("visibility", "hidden");
			
		} else {
			$(".eraserSize").css("visibility", "visible");
			$(".pencilSize").css("visibility", "hidden");
		}
	}	
});

document.body.addEventListener("keyup", function (e) {
	var keyCode = e.keyCode;
	if (keyCode == '13') {
		if (noDraw) {
			join();
		} else {
			send();
		}
	}
});
