const tileWidth = 50,
      tileHeight = 50;

const tilesURI = '/tiles/all',
      tilesStitchURI = '/tiles/stitch',
      tilesSplitURI = '/tiles/split';

const minMax = (data, prop, func) => data.reduce((min_max, t) => (func == 'max') ? Math.max(min_max, t[prop]) : Math.min(min_max, t[prop]), data[0][prop]);

const getBody = () => {
  let selected = tiles.filter(t => t.selected);
  if (selected.length === 0) {
    return null;
  }
  let xMax = minMax(selected, 'x', 'max'),
      xMin = minMax(selected, 'x', 'min'),
      yMax = minMax(selected, 'y', 'max'),
      yMin = minMax(selected, 'y', 'min'),
      width = (xMax - xMin)+1,
      height = (yMax - yMin)+1;
  let body = {
    size: { xMax, xMin, yMax, yMin, width, height },
    tiles: selected
  };
  return body;
};

const stitch = () => {
  let body = getBody();
  if (body !== null) {
    d3.request(tilesStitchURI)
    .header("Content-type", "application/json; charset=UTF-8")
    .post(JSON.stringify(body), (r) => {console.log(r);});
  } else {
    console.log('No tiles selected.');
  }
};

const split = () => {
  let body = getBody();
  if (body !== null) {
    d3.request(tilesSplitURI)
    .header("Content-type", "application/json; charset=UTF-8")
    .post(JSON.stringify(body), (r) => {console.log(r);});
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
    .call(adjustTickLabels,'x',tileWidth/2); // Eesh. Revisit.
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

let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

let zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[width*-1, height*-1], [width, height]])
    .on("zoom", zoomed);

let x = d3.scaleLinear()
    .domain([-1, width + 1])
    .range([-1, width + 1]);

let y = d3.scaleLinear()
    .domain([-1, height + 1])
    .range([-1, height + 1]);

let xAxis = d3.axisBottom(x)
    .ticks((width + 2) / (height + 2) * 10)
    .tickSize(height)
    .tickPadding(8 - height)
.tickFormat(function(d){return d/50+'k';});

let yAxis = d3.axisRight(y)
    .ticks(10)
    .tickSize(width)
    .tickPadding(8 - width)
.tickFormat(function(d){return d/50+'k';});

let [tiles, tile, tileImg, tileText, gX, gY] = [[],null,null,null,null,null];

loadTiles = (t) => {

  tiles = t;

  tile = svg
    .selectAll("tile")
    .data(t)
    .enter().append("g")
    .attr("class", "tile")
    .on("click", function(d){
      d.selected = !d.selected;
      let style = (d.selected) ?
        "outline: 3px solid red; outline-offset:-3px;" : "outline:0;";
        d3.select(this).attr("style", style);
    });

  tileImg = tile.append('image')
      .attr("xlink:href", (d) => d.url)
      .attr("width", 50)
      .attr("height", 50)
      .attr("x", (d) => {return d.x*50;})
      .attr("y", (d) => {return (d.y+1)*-50;});

  tileText = tile.append('text')
      .attr("class", "tile")
      .attr("x", (d) => {return (d.x*50)+15;})
      .attr("y", (d) => {return ((d.y+1)*-50)+30;})
    .text((d) => `${d.x},${d.y}`);

  gX = svg.append("g")
      .attr("class", "axis axis--x")
      .call(xAxis)
      .call(adjustTickLabels,'x',tileWidth/2);

  gY = svg.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)
      .call(adjustTickLabels,'y',tileHeight/2);

  d3.select(".reset").on("click", resetted);
  d3.select(".stitch").on("click", stitch);
  d3.select(".split").on("click", split);

  svg.call(zoom);
};

d3.select(window).on("load", () => {
  d3.json(tilesURI, (t) => loadTiles(t));
});

$(document).on("click","#upload-btn",function(e){
  e.preventDefault();
  var formData = new FormData(this);
  //formData.append('tiles', [{x: 123, y:4343}, {x: 4554, y: 54353}]);
  $.ajax({
      url: $('#upload-form').attr('action'),
      type: 'POST',
      data: formData,
      success: function(response) { console.log(response); },
      contentType: false,
      processData: false,
      cache: false
  });
  return false;
});
