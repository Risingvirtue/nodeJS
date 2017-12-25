
$(document).ready(function() {
	socket.on('start', startGame);
	socket.on('startDraw', startDraw);
	socket.on('time', update);
	socket.on('updateWord', updateWord);
	socket.on('correct', correct);
});

function initiateGame() {
	socket.emit('start');
}

function generateBlank(word) {
	var str = "";
	for (var i =0; i < word.length; i++) {
		str += "_"
		if (i < word.length -1) {
			str += " ";
		}
	}
	return str;
}

//handle timer
function startGame(data) {
	drawing = false;
	correct = false;
	var str = generateBlank(data.word);
	$("#word").html(str);
	changeDraw(data.num);
	//console.log(data);
	console.log(data.num, list);
	display();
}

function startDraw(data) {
	drawing = true;
	$("#word").html(data.word);
	changeDraw(data.num);
	//console.log(data);
	console.log(data.num, list);
	display();
}

function changeDraw(num) {
	for (p of list) {
		if (p.num == num) {
			p.draw = true;
		} else {
			p.draw = false;
		}
	}
	
}


function update(data) {
	//console.log(data);
	$('#time').html(data.currTime);
	var percent = Math.floor(100 * data.currTime / data.maxTime);
	var gradient = 'linear-gradient(white ' + (100 - percent) + "%, #DC143C " + 0 + "%)";
	$('.time').css('background', gradient);
}

function updateWord(data) {
	if (!drawing && !correct) {
		var blanks = $("#word").html();
		blanks = blanks.substr(0, data.index * 2) + data.letter + blanks.substr(data.index * 2 + 1);
		$("#word").html(blanks);
	}
}

function correct(data) {
	$("#word").html(data.word);
	correct = true;
}
