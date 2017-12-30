//dynamically edit html
var express = require('express');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
console.log('listening on port 3000');

app.get('/', function(req, res) {
//have to send back request
   console.log(req.params[0]);
   res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/*', function(req, res) {
//have to send back request
   var d = new Date(req.params[0]);
   if (d.toDateString()=='Invalid Date') {
	    res.send({"unix": null, "natural": null});
   } else {
	   res.send({"unix": Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), "natural": convertMonth(d.getMonth()) + " " + d.getDate() + ", " + d.getFullYear()});
   }
  
});

function convertMonth(num) {
	switch (num) {
		case 0: 
			return 'January';
		case 1:
			return 'Feburary';
		case 2:
			return 'March';
		case 3:
			return 'April';
		case 4:
			return 'May';
		case 5:
			return 'June';
		case 6:
			return 'July';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'October';
		case 10:
			return 'November';
		case 11:
			return 'December';
	}
}
app.listen('3000');