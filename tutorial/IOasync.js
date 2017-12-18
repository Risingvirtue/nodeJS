var fs = require('fs');

fs.readdir(process.argv[2], function callback(err, data){
	
	if (!err) {
		var buffer = data;
		var str = buffer.toString();
		var arr = str.split("\n");
		console.log(arr.length- 1);
	}
});


