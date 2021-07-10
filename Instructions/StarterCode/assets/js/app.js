// Svg container
var svgWidth = window.innerWidth - 250;
var svgHeight = window.innerHeight;

// Margins
var margin = {
    top: 50,
    right: 50,
    bottom: 120,
    left: 120
};

// Chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create svg container
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .classed("chart", true);

// Shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import csv file
d3.csv("assets/data/data.csv").then(function(censusData) {
    data = fetch("data.csv")
    //console.log(censusData);

    // Parse data
    censusData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healtcare = +data.healtcare;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.poverty) *0.8,
        d3.max(censusData , d => d.poverty) *1.2
        ])
        .range([0,width])
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.max(censusData, d => d.healtcare) *0.8,
        d3.min(censusData , d => d.healtcare) *1.2
        ])
        .range([0,height])

// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healtcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var circleText = chartGroup.selectAll(null).data(censusData).enter().append("text");

circleText
    .classed("stateText", true)
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healtcare))
    .attr("font-size", (8));

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(d => (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healtcare}`));
    
    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("Poverty (%)");

  }).catch(function(error) {
    console.log(error);
  });



