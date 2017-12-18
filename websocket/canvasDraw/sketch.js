var socket;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); 
var mouseDown =  false;
var mousePos = {};
var preMousePos = {x: -1, y:-1};
var r = 20;
var color = "white";
$(document).ready(function() {
	ctx.fillRect(0,0, canvas.width, canvas.height);
	socket = io.connect('http://localhost:3000');
	socket.on('mouse', otherDraw);
	
});

function otherDraw(data) {
	
	ctx.beginPath();
	ctx.strokeStyle = 'red';
	
	ctx.moveTo(data.x1, data.y1);
	ctx.lineCap = 'round';
	ctx.lineWidth = 10;
	ctx.lineTo(data.x2, data.y2);
	ctx.stroke();
	ctx.closePath();
}
document.body.addEventListener("mousedown", function (e) {
	mouseDown = true;
	mousePos.x = e.pageX;
	mousePos.y = e.pageY;
	
});

document.body.addEventListener("mouseup", function (e) {
	mouseDown = false;
	
});

document.body.addEventListener("mousemove", function (e) {
	//console.log(mousePos);
	if (mouseDown) {
		var data = {x1: mousePos.x, y1: mousePos.y, x2: e.x, y2: e.y};
		socket.emit('mouse', data);
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.moveTo(mousePos.x, mousePos.y);
		ctx.lineCap = 'round';
		ctx.lineWidth = 10;
		ctx.lineTo(e.pageX, e.pageY);
		ctx.stroke();
		ctx.closePath();
		mousePos.x = e.pageX; mousePos.y = e.pageY;
	}
	
	
});

