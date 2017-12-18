var socket;

function setup() {
	var myCanvas = createCanvas(800, 800);
	myCanvas.parent('container');
	socket = io.connect('http://localhost:3000');
	socket.on('mouse', newDrawing);
	
}

function newDrawing(data) {
	noStroke();
	fill(255, 0, 122);
	ellipse(data.x, data.y, 50, 50);
}	

//animation
var x = 0;

function mouseDragged() {
	console.log("Sending" + mouseX +", " + mouseY);
	
	var data = {
		x:mouseX,
		y:mouseY
	}
	
	socket.emit('mouse', data);
	
	noStroke();
	fill(0);
	ellipse(mouseX, mouseY, 50, 50);
}
function draw() {
	//background(51);
		
	//x = x + 1;
}