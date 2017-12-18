//dynamically edit html
var express = require('express');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended:false}));

app.post('/form', function(req, res) {
//have to send back request
   res.send(req.body.str.split('').reverse().join(''));
});

app.listen(process.argv[2]);