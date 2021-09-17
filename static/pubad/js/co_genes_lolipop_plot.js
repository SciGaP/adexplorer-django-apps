

var loli_plot = function(data, target) {
	//define a svg area
	var svg_loli = d3.select(target)
					.append("div")
					.classed("svg-container", true)//container class to make it responsive
					.append('svg')
					//responsive SVG needs these 2 attributes and no width and height attr
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "-100 -80 900 600")
					//class to make it responsive
					.classed("svg-content-responsive", true); 

	// set the dimensions and margins of the graph
	var size = d3.select(target),
		margin_loli = {top: 10, right: 30, bottom: 40, left: 0},
		width_loli = +size.node().getBoundingClientRect().width - margin_loli.left - margin_loli.right,
		height_loli = +size.node().getBoundingClientRect().height - margin_loli.top - margin_loli.bottom;


  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d.count; })])
    .rangeRound([0, 700]);
  svg_loli.append("g")
    .attr("transform", "translate(0,450)")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-15,0)rotate(-45)")
      .style("text-anchor", "end")
      .attr("dy", "1.5em")
      .attr("style", "font-size:1.2em;");

// Y axis
var y = d3.scaleBand()
  .rangeRound([ 0, 450 ])
  .domain(data.map(function(d) { return d.gene_name; }))
  .padding(1);
svg_loli.append("g")
  .attr("class", "loli-y-axis")
  .attr("font-size", "15")
  .call(d3.axisLeft(y));

// Lines
svg_loli.selectAll("loliline")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d.count); })
    .attr("x2", x(0))
    .attr("y1", function(d) { return y(d.gene_name); })
    .attr("y2", function(d) { return y(d.gene_name); })
    .attr("stroke", "grey");

// Circles
svg_loli.selectAll("lolicircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.count); })
    .attr("cy", function(d) { return y(d.gene_name); })
    .attr("r", "6")
    .style("fill", "#ac7339")
    .attr("stroke", "black");
svg_loli.selectAll("loliline")
  .data(data)
  .enter()
  .append('text')
  .attr("x", function(d) { return x(d.count)+10; })
  .attr("y", function(d) { return y(d.gene_name)+5; })
  .text(function(d){ return d.count; })
  .attr("style", "font-size:12px;fill:black;");
svg_loli.append("text")
   .attr("x", 350)             
   .attr("y", -20)
   .attr("text-anchor", "middle")  
   .style("font-size", "20px") 
   .text("Gene Co-occurrence In Publications");
  	 
svg_loli.append("g").append("text")
               .attr("fill", "black")//set the fill here
               .style("font-weight", "bold")
               .style("font-size", "20px")
               .attr("transform","translate(300,500)")
               .text("Occurrence Count");


}
