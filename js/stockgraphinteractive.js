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
  // user is no longer interacting
  userCurrentlyInteracting = false;
  currentUserPositionX = -1;
}

d3.select("#graphDiv")
    .on("mouseover", function() { 
        handleMouseOverGraph(this);
        mousemove(this);
    })
    .on("mousemove", function() { 
        handleMouseOverGraph(this);
        mousemove(this);
    })
    .on("mouseout", function() {
      handleMouseOutGraph(this);
    });


// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .attr('id','tooltips')
//   .offset([20, 0])
//   .html(function(d) {
//     console.log('TRYING');
//     return "<strong>Frequency:</strong> <span style='color:red'>" + d.close + "</span>";
//   })
// svg.call(tip);

// Hover line. 
// var hoverLineGroup = svg.append("g")
//                     .attr("class", "hover-line");
// var hoverLine = hoverLineGroup.append("line")
//                     .attr("id","hoverLine")
//                     .attr("x1", 10).attr("x2", 10) 
//                     .attr("y1", 0).attr("y2", height);
//                     //.style("display", "none");

var bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };

var focus = svg.append("g")
    .attr("class", "focus");
    //.style("display", "none");
focus.append("circle")
    .attr("r", 4);
focus.append("text")
   .attr("x", 9)
   .attr("dy", ".35em");

// d3.select("#graphDiv")
//     .on("mouseover", function() { 
//         focus.style("display", null);
//         hoverLine.attr("x1", hoverLineCalc(this)).attr("x2", hoverLineCalc(this));
//         hoverLine.style("display", null);
//         $("#tooltips").show();
//     })
//     .on("mouseover",tip.show)
//     .on("mouseout",tip.hide)
//     .on("mouseout", function() { 
//         focus.style("display", "none"); 
//         hoverLine.style("display","none");
//         $("#tooltips").hide();
//     })
//     .on("mousemove", function() {
//         mousemove(this);
//         hoverLine.attr("x1", hoverLineCalc(this)).attr("x2", hoverLineCalc(this));
//     });

function mousemove(obj) {
    var x0 = x.invert(graphPosX(obj)),
        i = bisectDate(cachedData[0], x0),
        d0 = cachedData[0][i - 1],
        d1 = cachedData[0][i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    console.log("d0: "+d0.date+"\nd1: "+d1.date+"\nd: "+d.date);
    focus.select("circle")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                y(d.close) + ")");
}
