var socket;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); 
var mouseDown =  false;
var mousePos = {};
var preMousePos = {x: -1, y:-1};
var r = 20;
var color = "blue";
var rect = canvas.getBoundingClientRect();
var noDraw = false;
var erase = false;
$(document).ready(function() {

	socket = io.connect('http://18.221.234.35');

	socket.on('mouse', otherDraw);
	$("#pencil").toggleClass("select");
	$("#pencil").click(function() {
		if (erase) {
			erase = false;
			$("#pencil").toggleClass("select");
			$("#eraser").toggleClass("select");
		}
	});
	
	$("#eraser").click(function() {
		if (!erase) {
			erase = true;
			$("#pencil").toggleClass("select");
			$("#eraser").toggleClass("select");
		}
	});
	
});

function otherDraw(data) {
	if (data.erase) {
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.moveTo(data.x1, data.y1);
		ctx.lineCap = 'round';
		ctx.lineWidth = 40;
		ctx.lineTo(data.x2, data.y2);
		ctx.stroke();
		ctx.closePath();
	} else {
		ctx.beginPath();
		ctx.strokeStyle = data.color;
		ctx.moveTo(data.x1, data.y1);
		ctx.lineCap = 'round';
		ctx.lineWidth = 10;
		ctx.lineTo(data.x2, data.y2);
		ctx.stroke();
		ctx.closePath();
	}
	
}
document.body.addEventListener("mousedown", function (e) {
	mouseDown = true;
	mousePos.x = e.pageX - rect.left;
	mousePos.y = e.pageY - rect.top;
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
		var data = {x1: mousePos.x, y1: mousePos.y, x2: eX, y2: eY, color: color, erase: false};
		socket.emit('mouse', data);
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.moveTo(mousePos.x, mousePos.y);
		ctx.lineCap = 'round';
		ctx.lineWidth = 10;
		ctx.lineTo(eX, eY);
		ctx.stroke();
		ctx.closePath();
		mousePos.x = eX; mousePos.y = eY;
	} else if (mouseDown && erase) {
		var data = {x1: mousePos.x, y1: mousePos.y, x2: eX, y2: eY, color: color, erase: true};
		socket.emit('mouse', data);
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.moveTo(mousePos.x, mousePos.y);
		ctx.lineCap = 'round';
		ctx.lineWidth = 40;
		ctx.lineTo(eX, eY);
		ctx.stroke();
		ctx.closePath();
		mousePos.x = eX; mousePos.y = eY;
	}
});
