var fs = require('fs');
var http = require('http');
var map = require('through2-map');
var server = http.createServer(function callback(request, response){
	if (request.method === 'POST') {
		//response.writeHead(200, {'Content-Type': 'text/plain'});
		request.pipe(map(function (chunk) {
			return chunk.toString().toUpperCase();
		})).pipe(response);
	}
	
});
server.listen(process.argv[2]);