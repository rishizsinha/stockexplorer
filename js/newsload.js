
var company, working;
function reloadNews(abbr) {
	var //date = getMouseDate(d3.select("#graphDiv"), cachedData[cachedNames.indexOf(abbr)]),
		qurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22"+abbr+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
	$.ajax({
		dataType: "json",
		url: qurl,
		success: function(data) {
			company = data.query.results.quote["Name"];
		},
		async: false
	});
	$("#newsDiv").html("<h2>"+company+" in the news:");
	$.ajax({
		type: "POST",
		url: "py/datamanip.py",
		success: function(data) {
			console.log(data);
			working = data;
		},
		async: false
	})
	console.log(working);

}
