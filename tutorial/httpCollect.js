var http = require('http');
var body = "";
http.get(process.argv[2], function(response) {
	response.on("data", function(data) {
		body += data;
	});
	response.on("end", function(data) {
		console.log(body.length);
		console.log(body);
	});
	
	
});