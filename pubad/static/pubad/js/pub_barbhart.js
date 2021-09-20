var PubBarchart = function(CountData, TargetDiv, TitleName, CurrGene, kwMin, kwMax) {
	
	var canvas = d3.select(TargetDiv)
					.append("div")
					.classed("svg-container", true)//container class to make it responsive
					.append("svg")
					.attr("id", "keywords_barchart_svg")
					//responsive SVG needs these 2 attributes and no width and height attr
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "-50 130 1000 550")
					//class to make it responsive
					.classed("svg-content-responsive", true); 
					//.attr({'width':900,'height':550});
	
	var svg = d3.select("#keywords_barchart_svg");
  
	var tooltip = d3.select("body").append("div").attr("class", "toolTip");

	var x = d3.scaleBand().rangeRound([0, 900]).padding(0.3),
		y = d3.scaleLinear().rangeRound([330, 0]);


	var g = svg.append("g")
		.attr("transform", "translate(0,145)");
		//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//var celldataMin = kwMin - 0.05
	//var celldataMax = kwMax
	
	x.domain(CountData.map(function(d) { return d.name; }));
	y.domain([kwMin, kwMax]);

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + 330 + ")")
		.call(d3.axisBottom(x))
	  .selectAll("text")	
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-60)")
		.attr("text-transform", "capitalize")
		.attr("font-size","20px");

	g.append("g")
		.attr("class", "axis axis--y-correlation")
		.attr("font-size", "4px")
		.call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return d; }).tickSizeInner([-900]))
	  .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -40)
		.attr("dy", "0.9em")
		.attr("text-anchor", "end")
		.attr("fill", "#49545b")
		.attr("font-size", "18px")
		.text("No. of Publications");

	//set up bar colors
	var color1 = d3.scaleLinear()
	.range(["#994d00", "#ffa64d"])
	.domain([kwMax,0]);

	var color2 = d3.scaleLinear()
	.range(["#ffe6e6", "#ff5500"])
	.domain([0,kwMin]);

	var cs_exp_color = d3.scaleLinear()
	.range(["#DAE1E2", "#0B48F4"])
	.domain([kwMin,kwMax+1]);

	g.selectAll(".bar")
		.data(CountData)
	  .enter().append("rect")
		.attr("class", "distance_bar")
		.attr("id", function(d) { return d.name; })
		.attr("x", function(d) { return x(d.name); })
		.attr("y", function(d) { return (d.pub_count < 0 ? 335:335);})
		.attr("width", x.bandwidth())
		//.attr("height", function(d) { return height - y(d.count); })
		.attr("height", function(d) { return 0; })
		.attr("fill", function(d) { return (d.pub_count < 0 ? color2(d.pub_count):color1(d.pub_count)); })
		.on("mousemove", function(d){
			tooltip
			  .style("left", d3.event.pageX - 50 + "px")
			  .style("top", d3.event.pageY - 70 + "px")
			  .style("display", "inline-block")
			  .html((d.name.capitalize()) + ": " + (d.pub_count));

		})
		.on("mouseout", function(d){ 
			tooltip.style("display", "none");
		})
	    .on("click",function(d){
		    window.open(d.pubmed_url, '_blank')});
		
	g.selectAll("rect")
	 .data(CountData)
	 .transition()
	 .duration(1000)
	 //.attr("height", function(d) { return 0; });
	 .attr("height", function(d) { return Math.abs(y(d.pub_count) - 335);})
	 .attr("y", function(d) { return (d.pub_count < 0 ? y(0):y(d.pub_count)); });
	 g.append("text")
		.attr("x", 450)             
		.attr("y", 15)
		.attr("text-anchor", "middle")  
		.style("font-size", "20px") 
		.text(TitleName+" In Publications");  	 
    }
    
var PubBarchartCTD = function(CountData, TargetDiv, TitleName, CurrID, kwMin, kwMax) {
	
	var canvas = d3.select(TargetDiv)
					.append("div")
					.classed("svg-container", true)//container class to make it responsive
					.append("svg")
					.attr("id", "keywords_barchart_svg_ctd"+CurrID)
					//responsive SVG needs these 2 attributes and no width and height attr
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "-50 130 1000 630")
					//class to make it responsive
					.classed("svg-content-responsive", true); 
					//.attr({'width':900,'height':550});
	
	var svg = d3.select("#keywords_barchart_svg_ctd"+CurrID);
  
	var tooltip = d3.select("body").append("div").attr("class", "toolTip");

	var x = d3.scaleBand().rangeRound([0, 900]).padding(0.3),
		y = d3.scaleLinear().rangeRound([330, 0]);


	var g = svg.append("g")
		.attr("transform", "translate(0,145)");
		//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//var celldataMin = kwMin - 0.05
	//var celldataMax = kwMax
	
	x.domain(CountData.map(function(d) { return d.name; }));
	y.domain([kwMin, kwMax]);

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + 330 + ")")
		.call(d3.axisBottom(x))
	  .selectAll("text")	
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-60)")
		.attr("text-transform", "capitalize")
		.attr("font-size","20px");

	g.append("g")
		.attr("class", "axis axis--y-correlation")
		.attr("font-size", "4px")
		.call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return d; }).tickSizeInner([-900]))
	  .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -40)
		.attr("dy", "0.9em")
		.attr("text-anchor", "end")
		.attr("fill", "#49545b")
		.attr("font-size", "18px")
		.text("No. of Publications");

	//set up bar colors
	var color1 = d3.scaleLinear()
	.range(["#994d00", "#ffa64d"])
	.domain([kwMax,0]);

	var color2 = d3.scaleLinear()
	.range(["#ffe6e6", "#ff5500"])
	.domain([0,kwMin]);

	var cs_exp_color = d3.scaleLinear()
	.range(["#DAE1E2", "#0B48F4"])
	.domain([kwMin,kwMax+1]);

	g.selectAll(".bar")
		.data(CountData)
	  .enter().append("rect")
		.attr("class", "distance_bar")
		.attr("id", function(d) { return d.name; })
		.attr("x", function(d) { return x(d.name); })
		.attr("y", function(d) { return (d.pub_count < 0 ? 335:335);})
		.attr("width", x.bandwidth())
		//.attr("height", function(d) { return height - y(d.count); })
		.attr("height", function(d) { return 0; })
		.attr("fill", function(d) { return (d.pub_count < 0 ? color2(d.pub_count):color1(d.pub_count)); })
		.on("mousemove", function(d){
			tooltip
			  .style("left", d3.event.pageX - 50 + "px")
			  .style("top", d3.event.pageY - 70 + "px")
			  .style("display", "inline-block")
			  .html((d.name.capitalize()) + ": " + (d.pub_count));

		})
		.on("mouseout", function(d){ 
			tooltip.style("display", "none");
		})
	    .on("click",function(d){
		    window.open(d.pubmed_url, '_blank')});
		
	g.selectAll("rect")
	 .data(CountData)
	 .transition()
	 .duration(1000)
	 //.attr("height", function(d) { return 0; });
	 .attr("height", function(d) { return Math.abs(y(d.pub_count) - 335);})
	 .attr("y", function(d) { return (d.pub_count < 0 ? y(0):y(d.pub_count)); });
	 g.append("text")
		.attr("x", 450)             
		.attr("y", 15)
		.attr("text-anchor", "middle")  
		.style("font-size", "20px") 
		.text(TitleName+" In Publications");  	 
    }