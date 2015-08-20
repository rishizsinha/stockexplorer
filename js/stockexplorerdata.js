function symbLookup() {
	var data = [];
	var symbol = "http://www.google.com/finance/historical?output=csv&q="+$("#stockInput").val();
	console.log(symbol);
	data = CORS(symbol);
	// d3.csv(symbol,function(csv){
	// 	data = csv;
	// });
	console.log(data);
}

function CORS(url) {
	function createCORSRequest(method, url) {
	  var xhr = new XMLHttpRequest();
	  if ("withCredentials" in xhr) {

	    // Check if the XMLHttpRequest object has a "withCredentials" property.
	    // "withCredentials" only exists on XMLHTTPRequest2 objects.
	    xhr.open(method, url, true);

	  } else if (typeof XDomainRequest != "undefined") {

	    // Otherwise, check if XDomainRequest.
	    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	    xhr = new XDomainRequest();
	    xhr.open(method, url);

	  } else {

	    // Otherwise, CORS is not supported by the browser.
	    xhr = null;

	  }
	  return xhr;
	}

	var xhr = createCORSRequest('GET', url);
	if (!xhr) {
	  throw new Error('CORS not supported');
	}

	return xhr;
}


$("#stockCheck").click(function() {
	symbLookup();
});

