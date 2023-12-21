// set the dimensions and margins of the graph
var margin = { top: 20, right: 40, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%m-%d-%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3
  .line()
  .x(function (d) {
    return x(d.date);
  })
  .y(function (d) {
    return y0(d.close);
  });

// define the 2nd line
var valueline2 = d3
  .line()
  .curve(d3.curveStep)
  .x(function (d) {
    return x(d.date);
  })
  .y(function (d) {
    return y1(d.open);
  });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3
  .select("#bar")
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right} ${
      height + margin.top + margin.bottom
    }`
  )
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
export default function drawBar(type) {
  if (type === "tea") {
    d3.csv("../../data/tea-data.csv", _drawBar);
  } else if (type === "ucob") {
    d3.csv("../../data/ucob-data.csv", _drawBar);
  } else if (type === "dru") {
    d3.csv("../../data/dru-data.csv", _drawBar);
  } else if (type === "top") {
    d3.csv("../../data/top-data.csv", _drawBar);
  } else {
    d3.csv("../../data/data.csv", _drawBar);
  }
}

function _drawBar(error, data) {
  console.log("data: ", data);
  if (error) throw error;

  // format the data
  data.forEach(function (d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    d.open = +d.open;
  });

  // Scale the range of the data
  x.domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  );
  y0.domain([
    0,
    d3.max(data, function (d) {
      return Math.max(d.close);
    }),
  ]);
  y1.domain([
    0,
    d3.max(data, function (d) {
      return Math.max(d.open);
    }),
  ]);
  y2.domain([
    0,
    d3.max(data, function (d) {
      return Math.max(Math.log(d.open));
    }),
  ]);

  // Add the valueline path.
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path").data([data]).attr("class", "line").attr("d", valueline2);

  // Add the X Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y0 Axis
  svg.append("g").attr("class", "axisRed").call(d3.axisLeft(y0));

  // Add the Y1 Axis
  svg
    .append("g")
    .attr("class", "axisSteelBlue")
    .attr("transform", "translate( " + width + ", 0 )")
    .call(d3.axisRight(y1));

  var ordinal = d3
    .scaleOrdinal()
    .domain(["Session Duration (Hours)", "Wipes"])
    .range(["rgb(70, 130, 180)", "rgb(255, 0, 0)"]);

  svg
    .append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(20,390)");

  var legendOrdinal = d3
    .legendColor()
    .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
    .shapePadding(10)
    //use cellFilter to hide the "e" cell
    .cellFilter(function (d) {
      return d.label !== "e";
    })
    .scale(ordinal);

  svg.select(".legendOrdinal").call(legendOrdinal);
}
