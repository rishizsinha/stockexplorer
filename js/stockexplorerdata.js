var cachedData = [],
	cachedNames = [],
	removedData = [],
	removedNames = [],
	cachedData1 = [],
	removedData1 = [],
	cachedData2 = [],
	removedData2 = [];

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
		if (data.status.http_code == 200) {
			stockdata = data.contents;
		} else {
			stockdata = 'error';
		}
		
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
	if (cachedNames.indexOf(abbr) > -1 || removedNames.indexOf(abbr) > -1) {
		return;
	}
	symbol = "http%3A%2F%2Fwww.google.com%2Ffinance%2Fhistorical%3Foutput%3Dcsv%26q%3D"+abbr+"&full_headers=1&full_status=1";
	var rawdata = xDomData(symbol);
	if (rawdata == "error") {
		return;
	}
	data = rawdata.replace("Date","Time");
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
	}).reverse();
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	var deriv1 = derivArray1(jsondata),
		deriv2 = derivArray2(deriv1);
	cachedData.push(jsondata);
	cachedData1.push(deriv1);
	cachedData2.push(deriv2);
	//console.log(deriv2);
	cachedNames.push(abbr);
	$("#enteredStocks").append("<div class='btn-group' graphColor="+color+" id="+abbr+"Group role='group'><button type='button' class='btn btn-default' id="+abbr+"Remove>X</button><button type='button' class='btn btn-success' id="+abbr+"Label>"+abbr+"</button></div>");
	addNewStockGraph(jsondata,abbr);
	$("#"+abbr+"Label").click(stockToggle(abbr));
	$("#"+abbr+"Remove").click(delData(abbr));
	$("#infoTable").append("<tr class='stockRow' data-href='#newsDiv' id='"+abbr+"Row'><td style='background-color:"+color+"'></td><td>"+abbr+"</td><td class='priceCell' id="+abbr+"curPrice>-</td><td id="+abbr+"PercChange>-</td><td id="+abbr+"Delta>-</td></tr>")
	d3.select("#"+abbr+"Row")
		.on("click",function() {
			reloadNews(abbr);
		})
		.on("mouseover", function() {
			d3.select("#"+abbr+"Line").style("stroke-width", 3);
		})
		.on("mouseout", function(){
			d3.select("#"+abbr+"Line").style("stroke-width", 2);
		});
}

$(".stockRow").click(function() {
	console.log("uhhuh");
    window.document.location = $(this).data("href");
});

function removeData(abbr) {
	var ind = cachedNames.indexOf(abbr);
	if (ind > -1) {
		removedData.push(cachedData[ind]);
		removedNames.push(cachedNames[ind]);
		removedData1.push(cachedData1[ind]);
		removedData2.push(cachedData2[ind]);
	    cachedNames.splice(ind, 1);
	    cachedData.splice(ind,1);
	    cachedData1.splice(ind,1);
	    cachedData2.splice(ind,1);
	} else {
		console.log(abbr+" not found");
	}
	$("#"+abbr+"Row").toggle();
	removeStockGraph(abbr);
}
function addData(abbr) {
	var ind = removedNames.indexOf(abbr);
	if (ind > -1) {
		cachedData.push(removedData[ind]);
		cachedData1.push(removedData1[ind]);
		cachedData2.push(removedData2[ind]);
		cachedNames.push(removedNames[ind]);
	    removedNames.splice(ind, 1);
	    removedData.splice(ind,1);
	    removedData1.splice(ind,1);
	    removedData2.splice(ind,1);
	} else {
		console.log(abbr+" not found");
	}
	$("#"+abbr+"Row").show();
	addNewStockGraph(chooseData()[cachedNames.indexOf(abbr)], abbr);
}
function delData(abbr) {
	return function() {
		var ind = cachedNames.indexOf(abbr);
		if (ind > -1) {
			cachedNames.splice(ind, 1);
	    	cachedData.splice(ind,1);
	    	cachedData1.splice(ind,1);
	    	cachedData2.splice(ind,1);
		} else {
			ind = removedNames.indexOf(abbr);
			removedNames.splice(ind, 1);
	    	removedData.splice(ind,1);
	    	removedData1.splice(ind,1);
	    	removedData2.splice(ind,1);
		}
		$("#"+abbr+"Group").remove()
		$("#"+abbr+"Row").remove();
		removeStockGraph(abbr);
	}
}


$.ajaxSetup({ cache: false });
$("#stockCheck").click(dataGet);
$("#stockInput").keyup(function(event){
    if(event.keyCode == 13){
        dataGet();
    }
});

function derivArray1(arr) {
	deriv = [];
	var objdate, objchange;
	for (i = 1; i < arr.length; i++) {
		objdate = arr[i].date,
		objchange = ((arr[i].close - arr[i-1].close)/arr[i-1].close) * 100
		deriv.push({date: objdate, change: objchange});
	}
	return deriv;
}
function derivArray2(arr) {
	deriv = [];
	var objdate, objchange;
	for (i = 1; i < arr.length; i++) {
		objdate = arr[i].date,
		objchange = arr[i].change - arr[i-1].change
		deriv.push({date: objdate, change: objchange});
	}
	return deriv;
}


function chooseData() {
	if (curMode == "$") {
		return cachedData;
	} else if (curMode == "%") {
		return cachedData1;
	} else if (curMode == "%%") {
		return cachedData2;
	}
}

