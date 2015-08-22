
function xDomData(u) {
	console.log("--- CROSS DOMAIN CALL ---")
	var proxy = '../php/ba-simple-proxy.php',
		url = proxy + "?url=" + u;
	console.log("url called: " + url);
	var d;
	// if ( /mode=native/.test(url)) {
	// 	console.log("here");
	// 	d = $.get(url, function(data){
	// 		return data.responseText;
	// 	});
	// } else {
	$.ajax({
		url:url,
		type:"POST",
		async:false}).done( function(data){
		//t = JSON.stringify(data, null, 2);
		$("#test").text(JSON.stringify(data.contents, null, 2));
		d = JSON.stringify(data.contents, null, 2)
	});
	// }
	return d;
}

$.ajaxSetup({ cache: false });

$("#stockCheck").click(function() {
	var symbol = "http%3A%2F%2Fwww.google.com%2Ffinance%2Fhistorical%3Foutput%3Dcsv%26q%3D"+$("#stockInput").val()+"&full_headers=1&full_status=1";
	var data = xDomData(symbol);
	console.log(data);
	var jsondata = d3.csv.parse(data);
	console.log(d3.csv.parse(data));
	console.log(d3.csv.parse("Year,Make,Model,Length\n1997,Ford,E350,2.34\n2000,Mercury,Cougar,2.3\n"));

});



