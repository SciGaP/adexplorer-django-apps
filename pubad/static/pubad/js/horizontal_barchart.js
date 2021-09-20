//a capitalize function
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//define a function to show detailed informtion aside
function ShowTips(svg, name, pub_count, CurrGene) {
  svg.selectAll(".tooltip_onside_tips").remove();
  svg.append("text")
       .attr("fill", "black")
       .attr("class", "tooltip_onside")
       .style("font-weight", "bold")
       .style("font-size", "22")
       .attr("transform","translate(980,120)")
       .text(name.capitalize())
       .append('svg:tspan')
       .attr('x', -50)
       .attr('dy', 40)
       .style("font-size", "19")
       .attr('fill', 'black')
       .text("No. of Publications related to "+CurrGene+": ")
       .append('svg:tspan')
       .attr('x', 60)
       .attr('dy', 35)
       .style("font-size", "22")
       .attr('fill', 'red')
       .text(pub_count);

}
function NoShowTips(svg, info) {
  svg.selectAll(".tooltip_onside").remove();
  svg.append("text")
	   .attr("fill", "#3960ba")
	   .attr("class", "tooltip_onside_tips")
	   .style("font-weight", "bold")
	   .style("font-size", "20")
	   .attr("transform","translate(960,130)")
	   .text("Move your mouse to bars.");

}


//horizontal barchar main fucntion
function horizontalBarChart (CountData, TargetDiv, TitleName, CurrGene) {
	var svg = d3.select(TargetDiv)
				.append("div")
				.classed("svg-container", true)//container class to make it responsive
				.append('svg')
				//responsive SVG needs these 2 attributes and no width and height attr
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "-200 -40 1500 430")
				//class to make it responsive
				.classed("svg-content-responsive", true); 

	var size = d3.select(TargetDiv),
		margin = {top: 20, right: 40, bottom: 30, left: 40},
		width = +size.node().getBoundingClientRect().width - margin.left - margin.right,
		height = +size.node().getBoundingClientRect().height - margin.top - margin.bottom;

	var y = d3.scaleBand()
			  .rangeRound([350, 0])
			  .padding(0.1);

	var x = d3.scaleLinear()
			  .rangeRound([0, 800]);

	  // format the data
	  CountData.forEach(function(d) {
		d.pub_count = +d.pub_count;
		d.name = d.name.capitalize();
	  });

	  // Scale the range of the data in the domains
	  x.domain([0, d3.max(CountData, function(d){ return d.pub_count; })])
	  y.domain(CountData.map(function(d) { return d.name; }));

	  // add the x Axis
	  svg.append("g")
		  .attr("transform", "translate(0," + 350 + ")")
		  .attr("class", "horizontalbar-x-axis")
		  .call(d3.axisBottom(x).ticks(10).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-350]));

	  // append the rectangles for the bar chart
	  svg.selectAll(".bar")
		  .data(CountData)
		.enter().append("rect")
		  .attr("class", "horizontalbar")
		  //.attr("x", function(d) { return x(d.sales); })
		  .attr("width", 0 )
		  .attr("y", function(d) { return y(d.name); })
		  .attr("height", y.bandwidth())
		  .attr("fill", "#994d00")
		  .on("mouseover", function(d) { return ShowTips(svg, d.name, d.pub_count, CurrGene);})
		  .on("mouseout", function(d){return NoShowTips(svg, d.pub_count);})
		  .on("click",function(d){
			  window.open(d.pubmed_url, '_blank')});

	  // add the y Axis
	  svg.append("g")
		  .attr("class", "horizontalbar-y-axis")
		  .call(d3.axisLeft(y));

	  //add x axis label
	  svg.append("g").append("text")
					 .attr("fill", "black")//set the fill here
					 .style("font-weight", "bold")
					 .attr("transform","translate(350,390)")
					 .text("Publication Count");
	  //add a transition effect
	  svg.selectAll("rect")
		 .data(CountData)
		 .transition()
		 .duration(1000)
		 .attr("width", function(d) {return x(d.pub_count); } );

	  //add a box to show location of tool tip
	  //tooltip box
	  svg.append("rect")
		 .attr("width", 450)
		 .attr("height", 250 )
		 .attr("stroke-width", "3" )
		 .attr("stroke", "#8e8784" )
		 .attr("fill", "none" )
		 .attr("transform","translate(850,20)");
	  //lower notification box
	  //svg.append("rect")
		// .attr("width", 300 )
		 //.attr("height", 100 )
		 //.attr("fill", "#becad1" )
		 //.attr("transform","translate(1050,300)");
	  //add a title to the toolbar box
	  svg.append("text")
		   .attr("fill", "black")
		   .attr("class", "tooltip_onside_title")
		   .style("font-weight", "bold")
		   .style("font-size", "27")
		   .attr("transform","translate(980,60)")
		   .text("Detail Information")
	  //add a tip to tell users to move mouse to bars
	  svg.append("text")
		   .attr("fill", "#3960ba")
		   .attr("class", "tooltip_onside_tips")
		   .style("font-weight", "bold")
		   .style("font-size", "20")
		   .attr("transform","translate(960,130)")
		   .text("Move your mouse to bars.");
	  //add a notification to users that they can click the bar to access publications that 
	  //were counted, this will open a new window and show PubMed website
	  svg.append("text")
		   .attr("fill", "#e83535")
		   .style("font-size", "18")
		   .attr("transform","translate(900,310)")
		   .attr("id","textWarning"+TitleName)
		   .text("You can click on bars to open a new window ")
		   .append('svg:tspan')
		   .attr('x', 0)
		   .attr('dy', 20)
		   .style("font-size", "19")
		   .attr('fill', '#e83535')
		   .text("showing all publications recorded for these")
		   .append('svg:tspan')
		   .attr('x', 0)
		   .attr('dy', 20)
		   .style("font-size", "19")
		   .attr('fill', '#e83535')
		   .text(TitleName + " on PubMed.");
		   
	  //add a title to the chart
		 svg.append("text")
			.attr("x", 400)             
			.attr("y", 0 - (margin.top))
			.attr("text-anchor", "middle")  
			.style("font-size", "20px") 
			.text("Publication By "+TitleName);  	 
}


