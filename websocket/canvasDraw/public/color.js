var range = [];
for (var i = 0; i< 30; i++) {
	var color = {r: 244, g: 65 + 6*i, b: 65}
	range.push(color);
}
for (var i = 0; i< 30; i++) {
	var color = {r: 244 - 6*i, g:244, b: 65}
	range.push(color);
}
for (var i = 0; i< 30; i++) {
	var color = {r: 65, g: 244, b: 65 + 6*i}
	range.push(color);
}
for (var i = 0; i< 30; i++) {
	var color = {r: 65, g: 244- 6*i, b: 244}
	range.push(color);
}
for (var i = 0; i< 30; i++) {
	var color = {r: 65 + 6*i, g: 65, b: 244}
	range.push(color);
}

for (var i = 0; i< 30; i++) {
	var color = {r: 244, g: 65, b: 244 - 6*i}
	range.push(color);
}
$(document).ready(function() {
	
	var val = $("#slider").val();
	color = "rgb(" + range[val].r + ", " + range[val].g + ", " + range[val].b + ")";
});


function changeColor() {
	var val = $("#slider").val();
	color = "rgb(" + range[val].r + ", " + range[val].g + ", " + range[val].b + ")";
	
}