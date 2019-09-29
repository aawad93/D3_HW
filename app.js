// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var newXScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    return newXScale
}
console.log('got this far 1')

var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {

    return (`<h1> ${d.state}</h1> <hr> <h5>Income: ${d.income}$</h5> <h5> Obesity: ${d[chosenXAxis]}%`);
  });
  console.log(toolTip)
svg.call(toolTip);

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(data) {
  populateGraph(data);
});

function populateGraph(data) {
  // if (err) throw err;
console.log(data)
  // parse data
  for (var i = 0; i < 51; i++) {
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  };
  console.log('got this far 7')
  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.income)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("g circlesGroup").data(data).enter();

  circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", 10)
    .attr("fill", "pink")
    .attr("opacity", ".5")
    .on("click", function(data) {
      toolTip.show(data, this)})
    .on("mousemove", function(data, index) {
      toolTip.hide(data)});
    console.log(circlesGroup)

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("% Population Obesity")

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Average Income");
    };
