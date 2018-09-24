var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
ajaxRequest = new XMLHttpRequest(),
query = '';

var APP_ID = 'gavPqgol9yAUUGHAWL0d';
var APP_CODE = 'KwDM1mSbmqqKQ5b30YldpQ';
var map;
var group;
var ui;
var bubble;

console.log("lol");

// configures the typeahead-plugin for autocomplete

function configure() {
$("#q").typeahead({
  highlight: false,
  minLength: 1,
  autoselect: true,
},
{
  display: function(suggestion) {return null;},
  limit: 10,
  source: autoCompleteSuggestions,
  templates: {
    suggestion: Handlebars.compile(
      "<div>" +
      "  {{ label }} " +
      "</div>"
    )
  }
});

$("#q").on("typeahead:selected", function(eventObject, suggestion, name) {
    var geocodingParams = {
      searchText: suggestion.label
    }
    geocoder.geocode(geocodingParams, onResult, function(e) {
      alert(e);
    });
});


}

// invocated upon user clicking a search result
var onResult = function(result) {
  clearBubbles();

  var locations = result.Response.View[0].Result,
  position, marker;
  var loc1 = locations[0];

  let parameters = {
    lat: loc1.Location.DisplayPosition.Latitude,
    lon: loc1.Location.DisplayPosition.Longitude
  };

  map.setCenter({
    lat: parameters.lat,
    lng: parameters.lon
  });

  getWeather(parameters, function(data) {
    addInfoBubble(loc1, data);
  })

}



// clears bubbles after new bubble has opened
function clearBubbles() {
  if (group.getObjects.length > 0) {
    group.removeAll();
  }
  if (bubble) {
    bubble.close();
  }
}


function getWeather(parameters, callback) {
$.getJSON("http://127.0.0.1:5000/weather", parameters, function(weather, textStatus, jqXHR) {
    callback(weather);
})

}

function addMarkerToGroup(group, coordinate, html) {
var marker = new H.map.Marker(coordinate);
// add custom data to the marker
marker.setData(html);
group.addObject(marker);
}

function addInfoBubble(loc1, weather) {

map.addObject(group);

group.addEventListener('tap', function(evt) {
  bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
    content: evt.target.getData()
  });


  ui.addBubble(bubble);
}, false);



var context = loc1.Location.Address.Label;
var temp =  weather.list[0].main.temp;
var code = weather.list[0].weather[0].id;
var icon = '<i class ="wi wi-owm-' + code + '"></i>';
var html = "<div class='row'> <div class='column'>" +  icon + "</div>" + "<div class='column'> " + context + ", " + temp  +  "C" + "</div>" + "</div>";

addMarkerToGroup(group, {lat: loc1.Location.DisplayPosition.Latitude,
lng :loc1.Location.DisplayPosition.Longitude},
html
);
}

function autoCompleteSuggestions(query, syncResults, asyncResults) {
    let parameters = {
      query: encodeURIComponent(query),
      beginHighLight: encodeURIComponent('</mark'),
      maxresults: 5,
      app_id: APP_ID,
      app_code: APP_CODE
    };
    $.getJSON(AUTOCOMPLETION_URL, parameters, function(data, textStatus, jqXHR) {
      asyncResults(data.suggestions);
    });
}


var platform = new H.service.Platform({
  useCIT: true,
'app_id': APP_ID,
'app_code': APP_CODE,
useHTTPS : true
});

var geocoder = platform.getGeocodingService();

$(document).ready(function() {
// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();


// Instantiate (and display) a map object:
map = new H.Map(
  document.getElementById('map'),
  defaultLayers.normal.map,
  {
    zoom: 10,
    center: { lat: 52.5, lng: 13.4 }
  });
  group = new H.map.Group();

  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  ui = H.ui.UI.createDefault(map, defaultLayers);
  map.addObject(group);

  document.addEventListener("contextmenu", function(event) {
    event.returnValue = true;
    event.stopPropagation && event.stopPropagation();
}, true);
});

$(function() {
configure();
});
