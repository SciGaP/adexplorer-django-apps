var pub_by_year_plot = function(data) {
    //if (error) throw error;

    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 500 + ")")
        .call(d3.axisBottom(x));

    g.append("g")
      	.attr("class", "axis axis--y")
      	.call(d3.axisLeft(y).ticks(10).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-900]))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.9em")
        .attr("text-anchor", "end")
        .attr("fill", "#49545b")
        .attr("font-size", "20px")
        .text("No. of Publications");

    g.selectAll(".bar")
      	.data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.year); })
        .attr("y", function(d) { return y(0); })
        .attr("width", x.bandwidth())
        //.attr("height", function(d) { return height - y(d.count); })
        .attr("height", function(d) { return 0; })
        .attr("fill", "#666666")
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("Year " + (d.year) + ": " + (d.count));
        })
    	.on("mouseout", function(d){ tooltip.style("display", "none");})
	    .on("click",function(d){
		    window.open(d.pubmed_url, '_blank')});
    g.selectAll("rect")
	 .data(data)
	 .transition()
	 .duration(1000)
	 //.attr("height", function(d) { return 0; });
	 .attr("height", function(d) { return 500-y(d.count)})
	 .attr("y", function(d) { return y(d.count); });
	 g.append("text")
        .attr("x", 450)             
        .attr("y", -10)
        .attr("text-anchor", "middle")  
        .style("font-size", "30px") 
        .text("Dementia Related Publication Trend");  	 
    }
