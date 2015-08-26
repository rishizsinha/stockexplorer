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

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
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

function delData(abbr) {
	return function() {
		var ind = cachedNames.indexOf(abbr);
		if (ind > -1) {
			cachedNames.splice(ind, 1);
	    	cachedData.splice(ind,1);
		} else {
			ind = removedNames.indexOf(abbr);
			removedNames.splice(ind, 1);
	    	removedData.splice(ind,1);
		}
		$("#"+abbr+"Group").remove()
		removeStockGraph(cachedData, abbr);
	}
}

var abbr, symbol, data, jsondata;
function dataGet() {
	abbr = $("#stockInput").val().toUpperCase();
	if (cachedNames.indexOf(abbr) > -1 || removedNames.indexOf(abbr) > -1) {
		return;
	}
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
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	cachedData.push(jsondata);
	cachedNames.push(abbr);
	addNewStockGraph(cachedData,jsondata,abbr);
	$("#enteredStocks").append("<div class='btn-group' id="+abbr+"Group role='group'><button type='button' class='btn btn-default' id="+abbr+"Remove>X</button><button type='button' class='btn btn-success' id="+abbr+"Label>"+abbr+"</button></div>");
	$("#"+abbr+"Label").click(stockToggle(abbr));
	$("#"+abbr+"Remove").click(delData(abbr));
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
	removeStockGraph(cachedData, abbr);
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
	addNewStockGraph(cachedData, cachedData[cachedNames.indexOf(abbr)], abbr);
}


$.ajaxSetup({ cache: false });

$("#stockCheck").click(dataGet);
$("#stockCheck").on('keydown', dataGet);



