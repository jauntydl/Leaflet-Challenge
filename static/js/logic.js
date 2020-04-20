var a_key = "pk.eyJ1IjoiamF1bnR5ZGwiLCJhIjoiY2s3bWlld2UxMDFvajNubnZyeDg1MWVjbCJ9.En_HWZMy-7GW-rMzQGEVZQ";

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Leaflet-Challenge HW by Davis Lee",
  maxZoom: 20,
  id: "mapbox.light",
  accessToken: a_key
});

var map = L.map("mapid", {
  center: [40, -92],
  zoom: 5
});

graymap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  function getStyle(data) {
    return {
      opacity: 0.6,
      fillOpacity: 0.6,
      fillColor: Color_by_magnitude(data.properties.mag),
      radius: Radius_by_magnitude(data.properties.mag),
      stroke: false,
      weight: 0.5
    };
  }

  function Color_by_magnitude(Mag) {
    switch (true) {
    case Mag > 5:
      return "darkred";
    case Mag > 4:
      return "red";
    case Mag > 3:
      return "orange";
    case Mag > 2:
      return "yellow";
    case Mag > 1:
      return "lightseagreen";
    default:
      return "green";
    }
  }

  function Radius_by_magnitude(Mag) {
    if (Mag === 0) {
      return 1;
    }
    else {
      return Mag * 4;
    }
  }


  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: getStyle,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  var legend = L.control({
    position: "topleft"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "green",
      "lightseagreen",
      "yellow",
      "orange",
      "red",
      "darkred"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(map);
});
