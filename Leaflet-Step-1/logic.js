// Store our API endpoint inside queryUrl
// Use this one: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php and click on significant earthquakes past 30 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function

  console.log (data.features);

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    
    var place = feature.properties.place;
    var lon = feature.geometry.coordinates[0];
    var lat = feature.geometry.coordinates[1];
    var location = [lat,lon]
    var depth = feature.geometry.coordinates[2];
    
    console.log ("feature",feature);
    console.log (feature.properties.place);
    console.log (feature.geometry.coordinates[0]);
    console.log (feature.geometry.coordinates[1]);
    console.log (feature.geometry.coordinates[2]);
    console.log (location);
    console.log ("depth",depth);
    

    layer.bindPopup("<h3>" + feature.properties.place + 
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
      + "</h1> <hr> <h3>Depth: "+ (feature.geometry.coordinates[2]) + "</p>");

    function getColor(depth) {
      // Conditionals for colors
      if (depth > 90) {
        return "red";
      }
      else if (depth > 70) {
        return "yellow-orange";
      }
      else if (depth > 50) {
        return "orange";
      }
      else {
        return "green";
      }
  }

    
     // Add circles to map
      L.circle(location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: getColor(depth),
    // Adjust radius
      // radius: earthquakeData.depth * 1500
  })
  
  // ).bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h3>Depth: " + feature.geometry.coordinates[2] + "</h3>").addTo(myMap);

  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = new L.LayerGroup()
  L.geoJSON(earthquakeData, {
    pointTolayer: function (_, longLat){
    return L.circleMarker(longLat)
    } ,
    // onEachFeature: onEachFeature
  }).addTo(earthquakes);

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  earthquakes.addTo(myMap)

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);

 
}
