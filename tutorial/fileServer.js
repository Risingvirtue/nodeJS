var fs = require('fs');
var http = require('http');

var server = http.createServer(function callback(request, response){
	response.writeHead(200, { 'content-type': 'text/plain' })
	var stream = fs.createReadStream(process.argv[3]).pipe(response);
});
server.listen(process.argv[2]);