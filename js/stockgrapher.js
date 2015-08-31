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
    .ticks(12);
var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .ticks(8);
// Define the line
var valueline0 = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });
        // .interpolate("basic");
    valueline1 = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.change); });
        //.interpolate("bundle");
    mode = {"$":valueline0, "%":valueline1, "%%":valueline1};
    
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

var now = new Date(),
    yrago = new Date(now.getTime()-31556926000),
    sixmoago = new Date(now.getTime()-(2629743000*6)),
    moago = new Date(now.getTime()-2629743000),
    weekago = new Date(now.getTime()-604800000),
    beginFrame = yrago,
    timedomain = d3.time.day.range(beginFrame, now);
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
    .attr("id","ylabel")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ "-50" +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .text("Stock Price");

// Get the data
function refresh() {
    data = chooseData().map(function(e) {
        var f = e.filter(function(el) {
            return el.date > beginFrame;
        });
        var first = f[0];
        if (first.hasOwnProperty("close")) {
            while (f.length < e.length) {
                f.unshift({date:beginFrame, close:first.close});
            }
        } else if (first.hasOwnProperty("change")) {
            while (f.length < e.length) {
                f.unshift({date:beginFrame, change:first.change});
            }
        } else {
            console.log("um");
        }
        return f;
    });

    timedomain = d3.time.day.range(beginFrame, now);
    x.domain([beginFrame, now])

    svg.select(".xaxis")
        .transition().duration(1000).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(xAxis);
    svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
      .attr("transform", function(d) {
          return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
    });

    if (curMode == "$") {
        y.domain([0, arrayfn(d3.max,data,"close")]);
    } else if (curMode == "%" || curMode == "%%") {
        y.domain([arrayfn(d3.min,data,"change"),arrayfn(d3.max,data,"change")]);
    } else {
        console.log("um");
    }
    
    // Update
    svg.select(".yaxis")
        .transition().duration(1000).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(yAxis);

    var lines = svg.selectAll(".line").data(data).attr("class","line");
    lines.transition().duration(1000)
        .attr("d", mode[curMode]);

    d3.selectAll(".stockRow")
      .each(function() {
        var abbrid = $(this).attr("id"),
            abbr = abbrid.slice(0,abbrid.indexOf("Row"));
        d3.select("#"+abbr+"Row")
        .on("click",function() {
          reloadNews(abbr);
        })
        .on("mouseover", function() {
          d3.select("#"+abbr+"Line").style("stroke-width", 3.5);
        })
        .on("mouseout", function(){
          d3.select("#"+abbr+"Line").style("stroke-width", 2);
        });
      });
};

function addNewStockGraph(curData, abbr) {
    var color = $("#"+abbr+"Group").attr("graphColor");
    // Add the new path.
    svg.append("path")
        .attr("class", "line")
        .attr("id", abbr+"Line")
        .attr("d", mode[curMode](curData))
        .style("stroke", color);

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

    refresh();
}

function removeStockGraph(abbr) {
    d3.select("#"+abbr+"Line").remove();
    d3.select("#"+abbr+"Focus").remove();
    refresh();
}

/********************************************************
 *** PERCENT CHANGE SECTION
 ********************************************************/
curMode="$"
$("#relChangeMode").click(function() {
    curMode="%";
    $(this).addClass("active");
    $("#absPriceMode").removeClass("active");
    $("#change2Mode").removeClass("active");
    $("#ylabel").text("Percent Change");
    refresh();
});
$("#absPriceMode").click(function() {
    curMode="$";
    $(this).addClass("active");
    $("#relChangeMode").removeClass("active");
    $("#change2Mode").removeClass("active");
    $("#ylabel").text("Stock Price");
    refresh();
});
$("#change2Mode").click(function() {
    curMode="%%";
    $(this).addClass("active");
    $("#relChangeMode").removeClass("active");
    $("#absPriceMode").removeClass("active");
    $("#ylabel").text("Percent Percent Change");
    refresh();
})

/*********************************************************
 *** TIMEFRAME CHANGE SECTION
 *********************************************************/

$("#yearView").click(function() {
    beginFrame=yrago;
    refresh();
    $("#sixmoView").removeClass("active");
    $("#moView").removeClass("active");
    $("#weekView").removeClass("active");
    $(this).addClass("active");
});
$("#sixmoView").click(function() {
    beginFrame = sixmoago;
    refresh();
    $("#yearView").removeClass("active");
    $("#moView").removeClass("active");
    $("#weekView").removeClass("active");
    $(this).addClass("active");
});
$("#moView").click(function() {
    beginFrame = moago;
    refresh();
    $("#yearView").removeClass("active");
    $("#sixmoView").removeClass("active");
    $("#weekView").removeClass("active");
    $(this).addClass("active");
});
$("#weekView").click(function() {
    beginFrame = weekago;
    refresh();
    $("#yearView").removeClass("active");
    $("#sixmoView").removeClass("active");
    $("#moView").removeClass("active");
    $(this).addClass("active");
});
