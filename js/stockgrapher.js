// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 80, left: 70},
    width = 700 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
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
var svgMain = d3.select("#graphDiv")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
var svg = svgMain.append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

function arrayfn(fn, data, attr) {
    return fn(data, function(d) {
        return fn(d, function(a) {
            return a[attr];
        });
    });
}

var now = new Date();
var yrago = new Date().setFullYear(now.getFullYear()-1);
x.domain([yrago, now]);
y.domain([0, 400]);

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

// now add titles to the axes
svg.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ "-50" +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .text("Stock Price");

// Get the data
function refresh(data) {
    // Scale the range of the data
    x.domain([arrayfn(d3.min,data,"date"), arrayfn(d3.max,data,"date")]);
    y.domain([0, arrayfn(d3.max,data,"close")]);

    // Update
    svg.select(".yaxis")
        .transition().duration(1000).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(yAxis);

    var lines = svg.selectAll(".line").data(data).attr("class","line");
    lines.transition().duration(1000)
        .attr("d", valueline);

};

function addNewStockGraph(data, curData, abbr) {
    var color = $("#"+abbr+"Group").attr("graphColor");
    // Add the new path.
    svg.append("path")
        .attr("class", "line")
        .attr("id", abbr+"Line")
        .attr("d", valueline(curData))
        .style("stroke", color)
        .on("mouseover", function() {
            console.log("path!");
            d3.select(this).style("stroke-width", 3)
        })
        .on("mouseout", function() {
            d3.select(this).style("stroke-width", 2)
        })
        .on("click", function() {
            reloadNews(abbr);
        });

    // Add indv focus
    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("id", abbr+"Focus")
        .style("display","none");
        //.style("display", "none");
    focus.append("circle")
        .attr("r", 3)
        .attr("fill",color)
        .attr("stroke",color);
    focus.append("text")
       .attr("x", 9)
       .attr("dy", ".35em");

    refresh(data);
}

function removeStockGraph(data, abbr) {
    console.log("exec");
    d3.select("#"+abbr+"Line").remove();
    d3.select("#"+abbr+"Focus").remove();
    refresh(data);
}
