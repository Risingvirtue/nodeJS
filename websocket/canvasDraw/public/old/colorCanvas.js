var colorCanvas = document.getElementById('colorCanvas');
var colorCtx = colorCanvas.getContext('2d');
var pixelArr = [];
var colorRect =  colorCanvas.getBoundingClientRect();
$(document).ready(function() {
	fitToContainer(colorCanvas);
	drawCanvas(rgbColor);
	//drawRow(50, {r: 255, g: 255, b: 255}, {r: 38, g: 0, b: 255});
	$("#colorCanvas").click(function(e) {
		var x = e.pageX - colorRect.left;
		var y = e.pageY - colorRect.top;
		//console.log(y);
		//console.log(e.page);
	});
});

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function drawCanvas(color) {
	colorCtx.clearRect(0,0,colorCanvas.width, colorCanvas.height);
	var white = {r:255, g: 255, b: 255};
	var interval = 255 / colorCanvas.height;
	var diffStep = step(color, {r: 0, g: 0, b: 0}, colorCanvas.height);
	var currColor = {};
	for (var i = 0; i< colorCanvas.height; i++) {
		var x = Math.floor(255 - i*interval);
		var startColor = {r: x, g: x, b:x};	
		currColor.r = Math.floor(color.r - diffStep.r *i);
		currColor.g = Math.floor(color.g - diffStep.g *i);
		currColor.b = Math.floor(color.b - diffStep.b *i);
		drawRow(i, startColor, currColor);
	}
	
	//console.log(pixelArr);
}

function drawRow(height, startColor, endColor) {
	var diffStep = step(startColor, endColor, colorCanvas.width);
	//console.log(diffStep, colorCanvas.width);
	var pixelRow = [];
	for (var i = 0; i < colorCanvas.width; i++) {
		pixelRow.push({r: Math.floor(startColor.r - diffStep.r *i),
						g: Math.floor(startColor.g - diffStep.g *i),
						b: Math.floor(startColor.b - diffStep.b *i)});
		pixel(convertColor(pixelRow[pixelRow.length- 1]), i, height);
	}
	
	pixelArr.push(pixelRow);
}
function step(startColor, endColor, interval) {
	return {r: (startColor.r - endColor.r) / interval, g: (startColor.g- endColor.g) / interval,
					b: (startColor.b - endColor.b) / interval};
}



function pixel(color, x, y) {
	//console.log(color);
	colorCtx.beginPath();
	colorCtx.fillStyle = color;
	colorCtx.fillRect(x,y, 1, 1);
	colorCtx.closePath();
	
}

function convertColor (dict) {
	return "rgb(" + dict.r + ", " + dict.g + ", " + dict.b + ")";
}