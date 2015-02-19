/*globals L, cartodb: true */

var SURVEYID = '6acc7f20-a31e-11e3-b7cb-3f5b125a9d0e';
var styles = "Map { background-color: rgba(0,0,0,0); }#localdata {  [GEOMETRY = LineString] {    line-width: 2;    [zoom >= 15] {      line-width: 5;    }    [zoom >= 16] {      line-width: 7;    }    [zoom >= 18] {      line-width: 9;    }    line-color: <%= color %>;    line-opacity: 1;  }  [GEOMETRY = Polygon],[GEOMETRY = MultiPolygon] {    [zoom >= 14] {      line-color: <%= color %>;      line-width:0.5;      line-opacity:0.5;    }    polygon-fill: <%= color %>;    polygon-opacity:1;  }  [GEOMETRY=Point] {    marker-line-width: 1;    marker-width: <% if (pointSize !== undefined) { %> <%= pointSize * 2 / 3%> <% } else { %> 12 <% }%>;    [zoom >= 16] {      marker-line-width: 2;      marker-width: <% if (pointSize !== undefined) { %> <%= pointSize %> <% } else { %> 18 <% }%>;    }    marker-type: ellipse;    marker-line-color: <%= color %>;    marker-fill: <%= color %>;    marker-fill-opacity: 0.9;    marker-line-opacity: 1;  }}";

var simpleStyles = (function (template) {
  return function (options) {
    return template(_.defaults(options, { pointSize: 18 }));
  };
}(_.template(styles)));


$(function(){

  L.mapbox.accessToken = 'pk.eyJ1IjoibWF0dGgiLCJhIjoicGFzV1ZkWSJ9.KeK3hKmM52XpUEHHx_F8NQ';
  var map = L.mapbox.map('map', 'matth.l8e9ppm3', {
    maxZoom: 16
  }).setView([41.6278, -83.6265], 13);

  map.addControl(L.mapbox.geocoderControl('mapbox.places'));

  var layerDef = {
    query: {},
    select: {},
    styles: simpleStyles({ color: '#cbc8c7', pointSize: '12' })
  };

  $.ajax({
    url: 'https://app.localdata.com/tiles/surveys/' + SURVEYID + '/tile.json',
    type: 'POST',
    dataType: 'json',
    cache: false,
    contentType: 'application/json',
    data: JSON.stringify(layerDef)
  }).done(function(tilejson) {
    var tileLayer = L.tileLayer('https:' + tilejson.tiles[0]).addTo(map);
    console.log("Got tj", tilejson, tilejson.tiles[0], map, tileLayer);
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log("Error fetching tilejson", jqXHR, textStatus, errorThrown);
  });

});
