var cachedDataObj = [],
	cachedData = [],
	cachedNames = [],
	removedData = [],
	removedNames = [];

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

function stockToggle(abbr) {
	return function() {
		if ($(this).hasClass("btn-success")) {
			removeData(abbr);
			$(this).removeClass("btn-success").addClass("btn-danger");

		} else {
			addData(abbr);
			$(this).removeClass("btn-danger").addClass("btn-success");
		}
	};
}

var abbr, symbol, data, jsondata;
function dataGet() {
	abbr = $("#stockInput").val().toUpperCase();
	symbol = "http%3A%2F%2Fwww.google.com%2Ffinance%2Fhistorical%3Foutput%3Dcsv%26q%3D"+abbr+"&full_headers=1&full_status=1";
	data = xDomData(symbol).replace("Date","Time");
	jsondata = d3.csv.parse(data, function(d){
		var parseDate = d3.time.format("%d-%b-%y").parse;
		return {
		    date: parseDate(d[Object.keys(d)[0]]), // convert "Year" column to Date
		    high: +d.High,
		    low: +d.Low,
		    open: +d.Open, // convert "Length" column to number
		    close: +d.Close,
		    stock: abbr
		}
	});
	cachedData.push(jsondata);
	cachedNames.push(abbr);
	stockGraph(cachedData,jsondata);
	$("#enteredStocks").append(//"<div class='col-md-2' id="+abbr+"Label>"+abbr+"</div>");
		"<button type='button' class='col-md-2 btn btn-success' id="+abbr+"Label>"+abbr+"</button>");
	$("#"+abbr+"Label").click(stockToggle(abbr));
}

function removeData(abbr) {
	console.log("remove activated for "+abbr);
	var ind = cachedNames.indexOf(abbr);
	if (ind > -1) {
		removedData.push(cachedData[ind]);
		removedNames.push(cachedNames[ind]);
	    cachedNames.splice(ind, 1);
	    cachedData.splice(ind,1);
	} else {
		console.log(abbr+" not found");
	}
}

function addData(abbr) {
	console.log("add activated for "+abbr);
	var ind = removedNames.indexOf(abbr);
	if (ind > -1) {
		cachedData.push(removedData[ind]);
		cachedNames.push(removedNames[ind]);
	    removedNames.splice(ind, 1);
	    removedData.splice(ind,1);
	} else {
		console.log(abbr+" not found");
	}
}


$.ajaxSetup({ cache: false });

$("#stockCheck").click(dataGet);
$("#stockCheck").on('keydown', dataGet);



