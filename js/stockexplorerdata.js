function xDomData(u) {
	var proxy = 'php/ba-simple-proxy.php',
		url = proxy + "?url=" + u;

	console.log(url);
	var d;
	// if ( /mode=native/.test(url)) {
		console.log("here");
		d = $.get(url, function(data){
			return data;
		});
	// } else {
	// 	console.log("there");
	// 	d = $.getJSON(url, function(data){
	// 		return JSON.stringify(data, null, 2);
	// 	});
	// }
	return d;
}

$.ajaxSetup({ cache: false });

$("#stockCheck").click(function() {
	var data = [];
	var symbol = "http://www.google.com/finance/historical?output=csv&q="+$("#stockInput").val();
	console.log(symbol);
	data = xDomData(symbol);
	console.log(data);
});



