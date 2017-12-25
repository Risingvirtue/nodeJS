var list = [];
$(document).ready(function() {
	socket.on('send', reSend);
	socket.on('join', addList);
	socket.on('selfJoin', addSelf);
	socket.on('leave', rmList);
	socket.on('nameInfo', addList);
	$("#up").css('visibility', 'hidden');
	$("#down").css('visibility', 'hidden');
});

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
	data.score = 0;
	data.draw = false;
	list.push(data);
	display();
	
}

function addSelf(data) {
	data.score = 0;
	data.draw = false;
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
			var player = list[index];
			changeName(i, player.icon, player.name);
			$("#score" + i).html(player.score);
			$("#pencil" + i).removeClass();
			if (player.draw) {
				$("#pencil" + i).addClass('fa');
				$('#pencil' + i).addClass('fa-pencil');
			}
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
		var data = {name: name, message: message};
		socket.emit('send', data);
		$("#message").val("");
		
	}
}

function reSend(data) {
	$("#text").val($("#text").val() + data.name + ": " + data.message + "\n");
	var m = document.getElementById('text');
	m.scrollTop = m.scrollHeight;
}