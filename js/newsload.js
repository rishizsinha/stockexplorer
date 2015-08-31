
var company, searchTerm, working;
function reloadNews(abbr) {
	var date = $("#dateHeading").slice(6) ,
		qurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22"+abbr+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
	$.ajax({
		dataType: "json",
		url: qurl,
		success: function(data) {
			company = data.query.results.quote["Name"];
			if (company.indexOf(" Common Stock") > -1) {
				company = company.slice(0,company.indexOf(" Common Stock"));
			}
			searchTerm = company;

			if (searchTerm.indexOf("Company") > -1) {
				searchTerm = searchTerm.slice(0,searchTerm.indexOf("Company"));
			}
			if (searchTerm.indexOf(", Inc.") > -1) {
				searchTerm = searchTerm.slice(0,searchTerm.indexOf("Inc."));
			}
			if (searchTerm.indexOf("Inc.") > -1) {
				searchTerm = searchTerm.slice(0,searchTerm.indexOf("Inc."));
			}
			if (searchTerm.indexOf("Company") > -1) {
				searchTerm = searchTerm.slice(0,searchTerm.indexOf("Company"));
			}
			searchTerm = searchTerm.trim();
			console.log(company+" --> "+searchTerm);
		},
		async: false
	});
	$("#newsDiv").html("<h2>"+company+" on "+curDate.toDateString()+":");
	var daystart = curDate.getTime(),
		dayend = daystart + 86400000-1,
		surl = "https://access.alchemyapi.com/calls/data/GetNews?apikey=b20ea6fd88921067d21baae2352df2f72e062294&return=enriched.url.title&start="+daystart+"&end="+dayend+"&q.enriched.url.cleanedTitle="+encodeURI(searchTerm)+"&count=25&outputMode=json";
	console.log(daystart+","+dayend);
	console.log(surl);
	// $.ajax({
	// 	type: "POST",
	// 	url: surl,
	// 	success: function(data) {
	// 		console.log(data);
	// 		$("newsDiv").append(data);
	// 	},
	// 	async: false
	// })
	

}
