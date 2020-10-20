const req = new XMLHttpRequest();
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function(){
  const json = JSON.parse(req.responseText);
  document.getElementsByClassName('message')[0].innerHTML = JSON.stringify(json);
};
req.onload = function(){

    const w = 900;
    const h = 900;
    const padding = 60;

    // Data
    json = JSON.parse(req.responseText)
    dataset = json.data

    // Scales
    const xScale = d3.scaleTime()
                     .domain([new Date(dataset[0][0]),new Date(dataset[dataset.length - 1][0])])
                     .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])
                     .range([h - padding, padding]);

    // Svg graph
    const svg = d3.select("body")
                      .append("svg")
                      .attr("width", w)
                      .attr("height", h)
                      .style("padding", padding);

    // Axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);;

    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .attr("id","x-axis")
       .call(xAxis);

    svg.append("g")
       .attr("transform", "translate("+padding+",0)")
       .attr("id","y-axis")
       .call(yAxis);

    //
    var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")


    var mouseover = function(d) {
    tooltip
          .style("opacity", 1)
    }
    var mousemove = function(d) {
    console.log(d.screenX)
    tooltip.html("Date: " + d.target.__data__[0]+"<br>Price: "+d.target.__data__[1])
        .style("left", (d.screenX-50) + "px")
        .style("top", (h-50)+"px")
    }
    var mouseleave = function(d) {
    tooltip.style("opacity", 0)
    }

    // Rect for each value
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("data-date",(d)=> d[0])
        .attr("data-gdp",(d)=> d[1])
        .attr("x",(d)=>xScale(new Date(d[0])))
        .attr("y",(d)=>yScale(d[1]))
        .attr("width", 4)
        .attr("height", (d)=> h-padding-yScale(d[1]))
        .attr("class","bar")
        .append("title")
        .text((d) => d[0]+"\n"+d[1])


    svg.selectAll("rect")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


}

