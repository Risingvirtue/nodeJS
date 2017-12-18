var net = require('net')
var server = net.createServer(function (socket) {
    var date = new Date();
	console.log(date.getMinutes());
	var str = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":"
date.getMinutes();
	socket.write(str);
	socket.end();
 })
 server.listen(process.argv[2]);