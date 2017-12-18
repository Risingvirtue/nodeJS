//dynamically edit html
var express = require('express');
var path = require('path');
var app = express();
//sets pug as a template

app.set('view engine', 'pug');
app.set('views', process.argv[3]);

app.get('/home', function(req, res) {
	
    res.render('index', {date: new Date().toDateString()});
});

app.listen(process.argv[2]);