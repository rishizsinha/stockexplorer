function symbLookup() {
	var data = [];
	var symbol = "http://www.google.com/finance/historical?output=csv&q="+$("#stockInput").val();
	console.log(symbol);
	d3.csv(symbol,function(csv){
		data = csv;
	});
	console.log(data);
}

$("#stockCheck").click(function() {
	symbLookup();
});

