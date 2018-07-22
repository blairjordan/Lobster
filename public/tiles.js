const tileWidth = 50,
      tileHeight = 50;

const minMax = (data, prop, func) => data.reduce((min_max, t) => (func == 'max') ? Math.max(min_max, t[prop]) : Math.min(min_max, t[prop]), data[0][prop]);

const make = () => {
  let selected = tiles.filter(t => t.selected);
  if (selected.length > 0) {
    let xMax = minMax(selected, 'x', 'max'),
        xMin = minMax(selected, 'x', 'min'),
        yMax = minMax(selected, 'y', 'max'),
        yMin = minMax(selected, 'y', 'min'),
        width = (xMax - xMin)+1,
        height = (yMax - yMin)+1;
    
    let exp = {
      size: { xMax, xMin, yMax, yMin, width, height },
      tiles: selected
    };
    console.log(JSON.stringify(exp));
  } else {
    console.log('No tiles selected.');
  }
};

const resetted = () => {
  svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
};

const zoomed = () => {
  tile.attr("transform", d3.event.transform);
  gX.call(xAxis.scale(d3.event.transform.rescaleX(x)))
    .call(adjustTickLabels,'x',tileWidth/2);
  gY.call(yAxis.scale(d3.event.transform.rescaleY(y)))
    .call(adjustTickLabels,'y',tileHeight/2);
  //console.log(d3.event.transform.scale());
};

const adjustTickLabels = (selection, axis, padding) => {
    let transform = (axis === 'x') ? `${padding},0` : `0,${padding}`;
    selection
      .selectAll('.tick text')
      .attr('transform', `translate(${transform})`);
};

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[width*-1, height*-1], [width, height]])
    .on("zoom", zoomed);

var x = d3.scaleLinear()
    .domain([-1, width + 1])
    .range([-1, width + 1]);

var y = d3.scaleLinear()
    .domain([-1, height + 1])
    .range([-1, height + 1]);

var xAxis = d3.axisBottom(x)
    .ticks((width + 2) / (height + 2) * 10)
    .tickSize(height)
    .tickPadding(8 - height)
.tickFormat(function(d){return d/50+'k';});

var yAxis = d3.axisRight(y)
    .ticks(10)
    .tickSize(width)
    .tickPadding(8 - width)
.tickFormat(function(d){return d/50+'k';});

let demoImg = 'http://labs.pegleg.com.au/images/grid_1K.png';
let tiles = [
  {i: 0, x: 0, y: 0, url: demoImg, selected: false},
  {i: 1, x: 4, y: 4, url: demoImg, selected: false},
  {i: 2, x: 6, y: 8, url: demoImg, selected: false},
  {i: 3, x: 7, y: 3, url: demoImg, selected: false},
  {i: 4, x: 3, y: 5, url: demoImg, selected: false},
  {i: 5, x: 8, y: 6, url: demoImg, selected: false},
  {i: 6, x: 6, y: 8, url: demoImg, selected: false},
  {i: 5, x: 4, y: -3, url: demoImg, selected: false},
  {i: 8, x: -4, y: -2, url: demoImg, selected: false},
  {i: 9, x: -1, y: 1, url: demoImg, selected: false},
  {i: 10, x: 1, y: -1, url: demoImg, selected: false},
  {i: 11, x: 1, y: 1, url: demoImg, selected: false},
  {i: 12, x: -1, y: -1, url: demoImg, selected: false}
];
  
  let tile = svg
    .selectAll("tile")
    .data(tiles)
    .enter().append("g")
    .attr("class", "tile")
    .on("click", function(d){
      d.selected = !d.selected;
      let style = (d.selected) ?
        "outline: 3px solid red; outline-offset:-3px;" : "outline:0;"
        d3.select(this).attr("style", style);
    });

let tileImg = tile.append('image')
    .attr("xlink:href", (d) => d.url)
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", (d) => {return d.x*50;})
    .attr("y", (d) => {return (d.y+1)*-50;});

tile.append('text')
    .attr("class", "tile")
    .attr("x", (d) => {return (d.x*50)+15;})
    .attr("y", (d) => {return ((d.y+1)*-50)+30;})
    .text((d) => `${d.x},${d.y}`);

var gX = svg.append("g")
    .attr("class", "axis axis--x")
    .call(xAxis)
    .call(adjustTickLabels,'x',tileWidth/2);

var gY = svg.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis)
    .call(adjustTickLabels,'y',tileHeight/2);;

d3.select(".reset").on("click", resetted);
d3.select(".make").on("click", make);

svg.call(zoom);
