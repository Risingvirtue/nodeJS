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
$(document).ready(function() {	
	ctx.stroke();
	socket = io.connect('http://18.221.234.35');
	socket.on('mouse', draw);
	socket.on('dot', dotDraw);
	//socket.on('color', determineColor);
	socket.on('send', reSend);
	$("#pencil").toggleClass("select");
	$("#smPen").toggleClass("selectSize");
	$("#smEraser").toggleClass("selectSize");
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

	$(window).resize(function() {
		rect = canvas.getBoundingClientRect();
		colorRect =  colorCanvas.getBoundingClientRect();
	});
});

function determineColor(c) {
	color = c;
}


function dotDraw(data) {
	ctx.beginPath();
	ctx.arc(data.x, data.y, data.width/2, 0, Math.PI * 2);
	ctx.fillStyle= data.color;
	ctx.fill();
	ctx.closePath();
}

function draw(data) {
	ctx.beginPath();
	ctx.strokeStyle = data.color;
	ctx.moveTo(data.x1, data.y1);
	ctx.lineCap = 'round';
	ctx.lineWidth = data.width;
	ctx.lineTo(data.x2, data.y2);
	ctx.stroke();
	ctx.closePath();
}

function join() {
	var n = $("#name").val();
	if (n == "") {
		name = animals[Math.floor(Math.random() * animals.length)];
	} else {
		name = n;
	}
	$('.modal').css('display', 'none');
	
	noDraw = false;
	$("#message").focus();
	
	
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
	

}

function send() {
	var message = $("#message").val();
	message = message.split('\n').join('');
	if (message != "") {
		$("#text").val($("#text").val() + name + ": " + message + "\n");
		$("#message").val("");
		var data = {name: name, message: message};
		socket.emit('send', data);
	}
	
}

function reSend(data) {
	$("#text").val($("#text").val() + data.name + ": " + data.message + "\n");
}

document.body.addEventListener("mousedown", function (e) {
	mouseDown = true;
	//var x = colorRect.left;
	//console.log(e.pageX);
	mousePos.x = e.pageX - rect.left;
	mousePos.y = e.pageY - rect.top;
	var data = {x: mousePos.x, y: mousePos.y};
	if (erase) {
		data.color =  "white";
		data.width = (currEraser + 1) * 5;
	} else {
		data.color = color;
		data.width = (currPen + 1) * 5;
	}
	
	dotDraw(data);
	
	socket.emit('dot', data);
	
	
});

document.body.addEventListener("mouseup", function (e) {
	mouseDown = false;
	
});

document.body.addEventListener("mousemove", function (e) {
	if (noDraw) {
		return;
	}
	//console.log(mousePos);
	eX = e.pageX - rect.left;
	eY = e.pageY - rect.top;
	if (mouseDown && !erase) {
		var width = (currPen + 1) * 5; 
		var data = {x1: mousePos.x, y1: mousePos.y, x2: eX, y2: eY, color: color, width: width, erase: false};
		draw(data);
		socket.emit('mouse', data);
		
		mousePos.x = eX; mousePos.y = eY;
	} else if (mouseDown && erase) {
		var width = (currEraser + 1) * 5; 
		var data = {x1: mousePos.x, y1: mousePos.y, x2: eX, y2: eY, color: "white", width: width, erase: true};
		socket.emit('mouse', data);
		draw(data);
		mousePos.x = eX; mousePos.y = eY;
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

