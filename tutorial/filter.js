var fs = require('fs');
var mymodule = require('./module.js');
//console.log(process.argv[2]);
var dir = process.argv[2];
var filterStr = process.argv[3];
mymodule(dir, filterStr, function(err,list) {
	if  (err) {
		console.log('err');
	} else {
		var match = process.argv[3];
		var m = match.length;
		var correct = [];
		for (var i =0; i < list.length; i++) {
			var l = list[i].length;
			var substring = list[i].slice(l-m-1, l);
			if (substring == "." + match) {
				console.log(list[i]);
			}
		}
	}
});
