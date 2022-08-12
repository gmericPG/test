
    var margin = { top: 50, right: 70, bottom: 50, left: 120};
    var width = 1500;
    var height = 1500;
    var padding = 0;
    var iconSize = 60;
    var leftPadding = 0; // 0 if no loopbacks, 65+ otherwise
    var rightPadding = 5 // 5 if no loopbacks; 95+ otherwise

    // let data = ft1;
    let data = data2;
    var sankey = d3.sankeyCircular()
      .nodeWidth(iconSize/2 + 1)
      .nodePadding(padding) //note that this will be overridden by nodePaddingRatio
     .nodePaddingRatio(0.85)
      .size([width, (height - 0) ])
      .nodeId(function (d) {
        return d.name;
      })
      .nodeAlign(d3.sankeyRight)
      //.nodeAlign(d3.sankeyLeft)
      //.nodeAlign(d3.sankeyJustify)
      //.nodeAlign(d3.sankeyCenter)
      //TODO IMPORTANT: WAS SANKEYLEFT, SWITCHED TO RIGHT AND REMOVED TEST NODES
      .iterations(100)
      .circularLinkGap(10)
      .sortNodes("col")

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

var x = d3.scalePoint()
    .domain(["","", "", "", "", "", "", "", "", "", ""]) //CHANGED WAS AXIS NAMES        // This is what is written on the Axis: from 0 to 100
    .range([iconSize/4, width - iconSize/5 - leftPadding - rightPadding])
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // .range([100, 800]);       // This is where the axis is placed: from 100 px to 800px


// Draw the axis
  svg.append("g")
  .attr("transform", "translate(" + (margin.left + leftPadding)  + "," + (height + margin.top/2 - 20) + ")")
//  .attr("transform", xform)      // This controls the vertical position of the Axis
    .attr("stroke-width", 4)
    .attr("stroke-opacity", 0) //CHANGED, WAS 1

  .call(d3.axisTop(x)
      .tickSize(height))
      .select(".domain").remove();

    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + (margin.top - padding ) + ")")

    var linkG = g.append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.2)
      .selectAll("path");

    var nodeG = g.append("g")
      .attr("class", "nodes")
      .attr("font-family", "sans-serif")
//      .attr("font-size", 11)
      .selectAll("g");

    //run the Sankey + circular over the data
    let sankeyData = sankey(data);
    let sankeyNodes = sankeyData.nodes;
    let sankeyLinks = sankeyData.links;
    // let sankeyGlobal = sankeyData.base;

    let depthExtent = d3.extent(sankeyNodes, function (d) {
      return d.depth;
    });


//    var nodeColour = d3.scaleSequential(d3.interpolateCool)
    var nodeColour = d3.scaleOrdinal(d3.schemeGreens[9])
    .domain([0,width]);

    var node = nodeG.data(sankeyNodes)
      .enter()
      .append("g");

      node.append("rect")
        .attr("class", "base")
        .attr("x", function (d) {
          return d.x0 + iconSize/8 + 1;
        })
        .attr("y", function (d) { return (d.y0 + d.y1) / 2 - iconSize/4 - 2 ; })
        .attr("height", iconSize/2.2 + 14 )
        .attr("width", "12")
        .style("fill", "white")
        .style("opacity", 1)

    node.append("text")
      .attr("x", function (d) { return (d.x0 + d.x1) / 2 - 0; })
      .attr("y", function (d) { return (d.y0 + d.y1)/2 + iconSize/3 })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function (d) {
                  if(d.label)
                      return d.label;
                  else
                      return d.name;
              });

    // node.append("title")
    //   .text(function (d) { return d.name + "\n" + (d.value); });

// var imgUrl = ""
// if (function (d) { return d.type; } == "android" )
//     {
//     imgUrl = "https://res.cloudinary.com/segment-cx/image/upload/v1579790180/Data%20Flow/android.svg"
//     } else {
//       imgUrl = "http://placehold.it/200x200"
//     }

//

    node.append("image")
//              .attr("xlink:href", function(d) { return d.icon; })
//      .attr("xlink:href", imgUrl)
      .attr("xlink:href", function(d) {
                if(d.type)
                    return urlCode[d.type];
                else
                    return "http://placehold.it/200x200";
            })

      .attr("x", function (d) { return (d.x0 + d.x1) / 2 - iconSize/4; })
      .attr("y", function (d) { return (d.y0 + d.y1) / 2 - iconSize/4 })
      .attr("width", iconSize/2 )
      .attr("height", iconSize/2 );


      node.append("rect")
      .attr("class", "target")
        .attr("x", function (d) {
          return d.x0;
        })
        .attr("y", function (d) { return (d.y0 + d.y1) / 2 - iconSize/4 - 3; })
//        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("height", iconSize/2 + 12)
        .attr("width", iconSize + 12)
//        .attr("width", function (d) { return d.x1 - d.x0; })
        .style("fill", function (d) { return nodeColour(d.x0); })
//        .style("opacity", 0.5)
        .style("opacity", 0)
        .attr("target","_blank")
        .on("click", function(d){
            if(d.workspace){
                window.open("https://app.segment.com/" + d.workspace + "/" + d.sd + "/" + d.slug )
              } else {}
            })
        .on("mouseover", function (d) {
          let thisName = d.name;
          node.selectAll(".base")
          .style("opacity", 1)

          node.selectAll("image")
            .style("opacity", function (d) {
              return highlightNodes(d, thisName)
            })
          node.selectAll(".target")
          .style("opacity", 0)
          .style("cursor", function(d) {
                    if(d.workspace)
                        return "pointer";
                    else
                        return "arrow";
                })

          d3.selectAll(".sankey-link")
            .style("opacity", function (l) {
              return l.source.name == thisName || l.target.name == thisName ? 1 : 0.2;
            })

            d3.selectAll(".g-arrow")
              .style("opacity", function (l) {
                return l.source.name == thisName || l.target.name == thisName ? 1 : 0.2;
              })

          node.selectAll("text")
            .style("opacity", function (d) {
              return highlightNodes(d, thisName)
            })
        })
        .on("mouseout", function (d) {
//          d3.selectAll("rect").style("opacity", 0.5);
          d3.selectAll(".base").style("opacity", 1);
          d3.selectAll(".sankey-link").style("opacity", 0.7);
          d3.selectAll("text").style("opacity", 1);
          d3.selectAll("image").style("opacity", 1);
          d3.selectAll(".target").style("opacity", 0);
          d3.selectAll(".g-arrow").style("opacity", 1);
        })

        // function log(sel,msg) {
        //   console.log(msg,sel);
        // }

    var link = linkG.data(sankeyLinks)
      .enter()
      .append("g")

    link.append("path")
      .attr("class", "sankey-link")
      .attr("d", function(link){
        return link.path;
      })
      .style("stroke-width", function (d) { return Math.max(1, d.width ); })
      .style("opacity", 0.7)
      .style("stroke", function (link, i) {
        return link.circular ? "red" : "black"
      })

    // link.append("title")
    //   .text(function (d) {
    //     return d.source.name + " → " + d.target.name + "\n Index: " + (d.index);
    //   });

      let arrows = pathArrows()
      	.arrowLength(15)
    		.gapLength(200)
      	.arrowHeadSize(4)
      	.path(function(link){ return link.path })

  		 var arrowsG = linkG.data(sankeyLinks)
        .enter()
        .append("g")
        .attr("class", "g-arrow")
        .call(arrows)


    function highlightNodes(node, name) {

      let opacity = 0.3

      if (node.name == name) {
        opacity = 1;
      }
      node.sourceLinks.forEach(function (link) {
        if (link.target.name == name) {
          opacity = 1;
        };
      })
      node.targetLinks.forEach(function (link) {
        if (link.source.name == name) {
          opacity = 1;
        };
      })

      return opacity;
    }


    function dragmove(d) {
        var rectY = d3.select(this).select(".target").attr("y");
          d.y0 = d.y0 + d3.event.dy;
          var yTranslate = d.y0 - rectY;
          d3.select(this).attr("transform",
              "translate(0" + "," + (yTranslate) + ")");
              sankeyCircular.update(graph);
    link.attr("d",d3.sankeyLinkHorizontal());
  }
