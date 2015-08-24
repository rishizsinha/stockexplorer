// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 60, left: 50},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time


// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .ticks(12)
    .scale(x);

var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .ticks(8)
    .scale(y);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
    
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "center")
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

function arrayfn(fn, data, attr) {
    return fn(data, function(d) {
        return fn(d, function(a) {
            return a[attr];
        });
    });
}

// for array of arrays
function nestFind(fn, data, attr) {
    var extremes = []
    for (var key in data) {
        extremes.push(arrayfn(fn,data[key],attr));
    }
    return fn(extremes); 
}

called = false;
// Get the data
function stockGraph(data,curData,abbr) {
    // Scale the range of the data
    x.domain([arrayfn(d3.min,data,"date"), arrayfn(d3.max,data,"date")]);
    y.domain([0, arrayfn(d3.max,data,"close")]);

    if (!called) {
        // Add the X Axis
        svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "yaxis")
            .call(yAxis);

        svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
              return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
        });
        
        called = true;
    }

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("id", abbr+"line")
        .attr("d", valueline(curData))
        .style("stroke", function(){
            return '#'+Math.floor(Math.random()*16777215).toString(16);
        });

    svg.select(".yaxis")
        .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(yAxis);

    var lines = svg.selectAll(".line").data(data).attr("class","line");
    lines.transition().duration(1000)
        .attr("d", valueline)
;

    // for (var s in data) {
    //     svg.append("path")
    //         .attr("class","line")
    //         .attr("d", valueline(data[s]));

    // }

};
