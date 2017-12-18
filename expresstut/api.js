
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');

app.get("/books", function(req, res) {
	var sum = "";
	fs.readFile(process.argv[3], function(err, data) {
		var sum = JSON.parse(data);
		res.json(sum);
	});
	
	

});
app.listen(process.argv[2]);