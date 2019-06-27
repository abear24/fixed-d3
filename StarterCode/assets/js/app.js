// @TODO: YOUR CODE HERE!
//run python -m http.server 8080/8000

//frame svg space
var svgWidth = 960;
var svgHeight = 500;

//set margins for the svg above
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//set width and height for svg
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create svg var
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//append svg and create chartgroup
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var toolTip= d3.select("body").append("div")
    .attr("class","toolTip");

//importing data from csv file 
d3.csv("../assets/data/data.csv").then(function(data,err) {
    

// Parse and Loop through the data
    data.forEach(function(data){
		data.poverty = +data.poverty;
		data.healthcare = +data.healthcare;
	});
	 
// Create x and y axis and then respective scales
		
		var xLinearScale = d3.scaleLinear()
		.domain([8.5,d3.max(data, d => d.poverty)])
		.range([0, width]);

		var yLinearScale = d3.scaleLinear()
		.domain([0,d3.max(data, d => d.healthcare)])
		.range([height, 0]);

		var bottomAxis = d3.axisBottom(xLinearScale);
	    var leftAxis = d3.axisLeft(yLinearScale);
		
		chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	   chartGroup.append("g")
        .call(leftAxis);

	  //Create circless
		
	  var circlesGroup = chartGroup.selectAll("circle")
	  .data(data)
	  .enter()
	  .append("circle")
	  .attr("cx", d => xLinearScale(d.poverty))
	  .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("stroke","black")
      .attr("stroke-width","1");
      
	 
      //append text to circles
     var circlesText =  chartGroup.selectAll(".statetext")
       .data(data)
       .enter()
       .append("text")
	   .attr("x", d => xLinearScale(d.poverty))
	   .attr("y", d => yLinearScale(d.healthcare))
       .attr("dy", ".35em")
       .style("font-size","10px")
       .style("text-anchor","middle")
       .text(d=> d["abbr"])
       .classed("stateText",true);
        
    var toolTip = d3.tip()
       .attr("class", "tooltip")
       .offset([80, -60])
       .html(function(d) {
            return (`<strong> Poverty:${d.state}</strong><br>Healthcare: ${d.healthcare}`);
       })


    
	//create mouseover event
	circlesGroup.on("mouseover", function(data) {
		toolTip.show(data,this);
	})
	// onmouseout event
	.on("mouseout", function(data) {
		toolTip.hide(data);
	});

    circlesGroup.call(toolTip);

	// Create axes labels
	chartGroup.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - margin.left + 40)
	.attr("x", 0 - (height / 2))
	.attr("dy", "1em")
	.attr("class", "axisText")
    .text("Healthcare %");

	chartGroup.append("text")
	.attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
	.attr("class", "axisText")
	.text("Poverty %");

    })	
