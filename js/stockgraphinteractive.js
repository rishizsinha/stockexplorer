// var dispatch = d3.dispatch('legendClick', 'legendMouseover', 'legendMouseout');
var dynamic = true;

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

var curDate;
var handleMouseOverGraph = function(obj) {  
  var mouseX = graphPosX(obj);
  var mouseY = graphPosY(obj);
  if(mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (dynamic) {
      // show the hover line
      hoverLine.classed("hide", false);
      // set position of hoverLine
      hoverLine.attr("x1", mouseX).attr("x2", mouseX)

      d3.selectAll("g.focus")
        .style("display",null);
      moveFocii(obj);
      // tip.show(obj);
      curDate = getMouseDate(obj);
      $("#dateHeading").text("Date: "+curDate.toDateString());
      //displayValueLabelsForPositionX(mouseX)
      // user is interacting
      currentUserPositionX = mouseX;
    }
  } else {
    if (dynamic) {
      // proactively act as if we've left the area since we're out of the bounds we want
      handleMouseOutGraph(obj);
    }  
  }  
}
var handleMouseOutGraph = function(obj) { 
  // hide the hover-line
  if (dynamic) {
    hoverLine.classed("hide", true);
    d3.selectAll("g.focus")
      .style("display","none");
    // tip.hide();
    // user is no longer interacting
    currentUserPositionX = -1;
  }
}

d3.select("#graphDiv")
  .on("mouseover", function() {
    dynamic = true;;
  })
  .on("mousemove", function() { 
      handleMouseOverGraph(this);
  })
  .on("mouseout", function() {
    handleMouseOutGraph(this);
  })
  .on("click", function() {
    dynamic = false;
  });



var bisectDate = d3.bisector(function(d) { return d}).left,
    bisectDateObj = d3.bisector(function(d) { return d.date}).left;

function getMouseDate(obj) {
  var x0 = x.invert(graphPosX(obj)),
      i = bisectDate(timedomain, x0),
      d0 = timedomain[i - 1],
      d1 = timedomain[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  return d;
}

function getMouseDateObj(obj, data) {
  var x0 = x.invert(graphPosX(obj));
      i = bisectDateObj(data, x0);
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  return d;
}

function getDateInfo(x0, data) {
  var i = bisectDateObj(data, x0);
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  return d;
}

function moveFocii(obj) {
  d3.selectAll("g.focus")
    .each(function() {
      var abbrid = $(this).attr("id"),
          abbr = abbrid.slice(0,abbrid.length-5),
          base = getMouseDateObj(obj, chooseData()[cachedNames.indexOf(abbr)])
          inter0 = getDateInfo(base.date, cachedData[cachedNames.indexOf(abbr)]),
          inter1 = getDateInfo(base.date, cachedData1[cachedNames.indexOf(abbr)]),
          inter2 = getDateInfo(base.date, cachedData2[cachedNames.indexOf(abbr)]);
      if (curMode == "$") {
        $(this).attr("transform",
          "translate(" + x(inter0.date) + "," +
            y(inter0.close) + ")");
      } else if (curMode == "%") {
        $(this).attr("transform",
          "translate(" + x(inter1.date) + "," +
            y(inter1.change) + ")");
      } else {
        $(this).attr("transform",
          "translate(" + x(inter2.date) + "," +
            y(inter2.change) + ")");
      }
      $("#"+abbr+"curPrice").html("$"+inter0.close);
      if (inter1.change > 0) {
        $("#"+abbr+"PercChange").html("+"+inter1.change.toFixed(2)+"%").css("color","green");
      } else if (inter1.change < 0) {
        $("#"+abbr+"PercChange").html(inter1.change.toFixed(2)+"%").css("color","red");
      } else {
         $("#"+abbr+"PercChange").html("0%").css("color","black")
      }
      if (inter2.change > 0) {
        $("#"+abbr+"Delta").html("+"+inter2.change.toFixed(2)+"%").css("color","green");
      } else if (inter1.change < 0) {
        $("#"+abbr+"Delta").html(inter2.change.toFixed(2)+"%").css("color","red");
      } else {
         $("#"+abbr+"Delta").html("0%").css("color","black")
      }
    }) 
}