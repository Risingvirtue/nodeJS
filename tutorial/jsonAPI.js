//use response.end() to return response
//can use url.parse(request.url, true) to create a sudo dictionary
//can return {} for a sudo json file
var fs = require('fs');
var http = require('http');
var url = require('url');
var server = http.createServer(function callback(request, response){
	response.writeHead(200, { 'Content-Type': 'application/json' });
	
	var currUrl = url.parse(request.url, true);
	var answer = parseQuery(currUrl);
	
	response.end(JSON.stringify(answer));
		
	
});
server.listen(process.argv[2]);

function parseTime(time) {
	return {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds()
  }
}

function unixTime (time) {
	return {unixtime: time.getTime()};
}

function parseQuery(url) {
	switch(url.pathname) {
		case '/api/parsetime':
			return parseTime(new Date(url.query.iso));
			break;
		case "/api/unixtime":
			return unixTime(new Date(url.query.iso));
			
	}
	
}