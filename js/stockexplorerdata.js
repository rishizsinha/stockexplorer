function xDomData(u) {
	var proxy = 'php/ba-simple-proxy.php',
		url = proxy + "?" + u;

	if ( /mode=native/.test(url)) {
		$.get(url, function(data){
			return data;
		});
	} else {
		$.getJSON(url, function(data){
			return JSON.stringify(data, null, 2);
		});
	}
}

$.ajaxSetup({ cache: false });

$("#stockCheck").click(function() {
	var data = [];
	var symbol = "http://www.google.com/finance/historical?output=csv&q="+$("#stockInput").val();
	console.log(symbol);
	data = xDomData(symbol);
	// d3.csv(symbol,function(csv){
	// 	data = csv;
	// });
	console.log(data);
});



