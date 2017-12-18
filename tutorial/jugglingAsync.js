var http = require('http');
var body = ["","",""];
var count = 0;
function httpGet(index) {
	http.get(process.argv[index + 2], function(response) {
		response.on("data", function(data) {
			body[index] += data;
		
		});
		response.on("end", function(data) {
			count++;
			if (count == 3) {
				printResults();
			}
		});
	});
}

for (var i=0; i< 3; i++) {
	httpGet(i);
}

function printResults() {
	for (var i = 0; i< body.length; i++) {
	console.log(body[i]);
	}
}
