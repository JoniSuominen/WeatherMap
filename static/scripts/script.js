let AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
ajaxRequest = new XMLHttpRequest(),
query = '';

let APP_ID = 'gavPqgol9yAUUGHAWL0d';
let APP_CODE = 'KwDM1mSbmqqKQ5b30YldpQ';
let map;
let group;
let ui;
let bubble;

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

// when the user selects a location from the dropdown menu
$("#q").on("typeahead:selected", function(eventObject, suggestion, name) {
    let geocodingParams = {
      searchText: suggestion.label
    }
    
    geocoder.geocode(geocodingParams, onResult, function(e) {
      alert(e);
    });
});


}

// invocated upon user clicking a search result
let onResult = function(result) {
  clearBubbles();

  let locations = result.Response.View[0].Result
  let loc1 = locations[0];

  let parameters = {
    lat: loc1.Location.DisplayPosition.Latitude,
    lon: loc1.Location.DisplayPosition.Longitude
  };

  // centers the map
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

// queries the back-end for weather data
function getWeather(parameters, callback) {
$.getJSON("/weather", parameters, function(weather, textStatus, jqXHR) {
    callback(weather);
})

}

// adds a marker
function addMarkerToGroup(group, coordinate, html) {
let marker = new H.map.Marker(coordinate);
// add custom data to the marker
marker.setData(html);
group.addObject(marker);
}

// configure the info bubble to show the locations' weather data
function addInfoBubble(loc1, weather) {

map.addObject(group);

// open the info bubble upon clicking it
group.addEventListener('tap', function(evt) {
  bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
    content: evt.target.getData()
  });


  ui.addBubble(bubble);
}, false);



let context = loc1.Location.Address.Label;
let temp =  Math.round(weather.list[0].main.temp);
let code = weather.list[0].weather[0].id;
let icon = '<i class ="wi wi-owm-' + code + '"></i>';
let html = "<div class='row'> <div class='column'>" +  icon + "</div>" + "<div class=' column'><p class='infotext'> " + context + ", " + temp  +  "  °C" + " </p> </div>" + "</div>";

addMarkerToGroup(group, {lat: loc1.Location.DisplayPosition.Latitude,
lng :loc1.Location.DisplayPosition.Longitude},
html
);
}

// queries Here Maps API for cities based on user input thus far
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


let platform = new H.service.Platform({
  useCIT: true,
'app_id': APP_ID,
'app_code': APP_CODE,
useHTTPS : true
});

let geocoder = platform.getGeocodingService();

$(document).ready(function() {
// Obtain the default map types from the platform object:
let defaultLayers = platform.createDefaultLayers();


// Instantiate (and display) a map object:
map = new H.Map(
  document.getElementById('map'),
  defaultLayers.normal.map,
  {
    zoom: 10,
    center: { lat: 52.5, lng: 13.4 }
  });
  group = new H.map.Group();

  let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
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
