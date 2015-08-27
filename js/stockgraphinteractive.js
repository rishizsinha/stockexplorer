// var dispatch = d3.dispatch('legendClick', 'legendMouseover', 'legendMouseout');

function graphPosX(obj) {
  return d3.mouse(obj)[0]-margin.left;
}  
function graphPosY(obj) {
  return d3.mouse(obj)[1]-margin.top;
}

// add a 'hover' line that we'll show as a user moves their mouse (or finger)
// so we can use it to show detailed values of each line
hoverLineGroup = svg.append("svg:g")
          .attr("class", "hover-line");
// add the line to the group
hoverLine = hoverLineGroup
  .append("svg:line")
    .attr("x1", 10).attr("x2", 10) // vertical line so same value on each
    .attr("y1", 0).attr("y2", height); // top to bottom  
// hide it by default
hoverLine.classed("hide", true);

var handleMouseOverGraph = function(obj) {  
  var mouseX = graphPosX(obj);
  var mouseY = graphPosY(obj);
  if(mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    // show the hover line
    hoverLine.classed("hide", false);
    // set position of hoverLine
    hoverLine.attr("x1", mouseX).attr("x2", mouseX)

    d3.selectAll("g.focus")
      .style("display",null);
    moveFocii(obj);
    tip.show;
    //displayValueLabelsForPositionX(mouseX)
    // user is interacting
    userCurrentlyInteracting = true;
    currentUserPositionX = mouseX;
  } else {
    // proactively act as if we've left the area since we're out of the bounds we want
    handleMouseOutGraph(obj)
  }
}
var handleMouseOutGraph = function(obj) { 
  // hide the hover-line
  hoverLine.classed("hide", true);
  d3.selectAll("g.focus")
    .style("display","none");
  tip.hide;
  // user is no longer interacting
  userCurrentlyInteracting = false;
  currentUserPositionX = -1;
}

d3.select("#graphDiv")
    .on("mouseover", function() { 
        handleMouseOverGraph(this);
    })
    .on("mousemove", function() { 
        handleMouseOverGraph(this);
    })
    .on("mouseout", function() {
      handleMouseOutGraph(this);
    });
d3.select("path")
  .on("mouseover", function() {
    console.log("path!");
  })

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .attr('id','tooltips')
  .offset([20, 0])
  .html(function(d) {
    console.log('TRYING');
    return d.date;
  })
svg.call(tip);

var bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };

function getMouseDate(obj, data) {
  var x0 = x.invert(graphPosX(obj)),
      i = bisectDate(data, x0),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  return d;
}

function moveFocii(obj) {
  d3.selectAll("g.focus")
    .each(function() {
      var abbrid = $(this).attr("id"),
          abbr = abbrid.slice(0,abbrid.length-5);
      var d = getMouseDate(obj, cachedData[cachedNames.indexOf(abbr)]);
      $(this).attr("transform",
          "translate(" + x(d.date) + "," +
            y(d.close) + ")");
    }) 
}