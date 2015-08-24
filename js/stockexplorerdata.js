var cachedDataObj = [];
var cachedData = [];
var cachedNames = [];

function xDomData(u) {
	// set url for ajax call
	var proxy = '../php/ba-simple-proxy.php',
		url = proxy + "?url=" + u;
	// perform ajax call and store data when completed
	var stockdata;
	$.ajax({
		url:url,
		type:"POST",
		async:false})
	.done( function(data){
		stockdata = data.contents
	});
	// return success result
	return stockdata;
}

var abbr, symbol, data, jsondata;
function dataGet() {
	abbr = $("#stockInput").val();
	symbol = "http%3A%2F%2Fwww.google.com%2Ffinance%2Fhistorical%3Foutput%3Dcsv%26q%3D"+abbr+"&full_headers=1&full_status=1";
	data = xDomData(symbol).replace("Date","Time");
	jsondata = d3.csv.parse(data, function(d){
		var parseDate = d3.time.format("%d-%b-%y").parse;
		return {
		    date: parseDate(d[Object.keys(d)[0]]), // convert "Year" column to Date
		    high: +d.High,
		    low: +d.Low,
		    open: +d.Open, // convert "Length" column to number
		    close: +d.Close
		}
	});
	cachedData.push(jsondata);
	cachedNames.push(abbr);
	// console.log(cachedData);
	stockGraph(cachedData,jsondata);
	$("#enteredStocks").append("<div class=stockOption>"+abbr+"</div>");
}


$.ajaxSetup({ cache: false });

$("#stockCheck").click(dataGet);
$("#stockCheck").on('keydown', dataGet);



