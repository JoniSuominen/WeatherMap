var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
  ajaxRequest = new XMLHttpRequest(),
  query = '';

var APP_ID = 'gavPqgol9yAUUGHAWL0d';
var APP_CODE = 'KwDM1mSbmqqKQ5b30YldpQ';

function configure() {
  $("#q").typeahead({
    highlight: false,
    minLength: 1,
  },
  {
    display: function(suggestion) {return null;},
    limit: 10,
    source: autoCompleteListener,
    templates: {
      suggestion: Handlebars.compile(
        "<div>" +
        "  {{ label }} " +
        "</div>"
      )
    }
  });
}

function autoCompleteListener(query, syncResults, asyncResults) {
  console.log(query)
      let parameters = {
        query: encodeURIComponent(query),
        beginHighLight: encodeURIComponent('</mark'),
        maxresults: 5,
        app_id: APP_ID,
        app_code: APP_CODE
      };
      $.getJSON(AUTOCOMPLETION_URL, parameters, function(data, textStatus, jqXHR) {
        console.log((data.suggestions)  )
        asyncResults(data.suggestions);
      });
/*
      var params = '?' +
      'query=' + encodeURIComponent(textBox.value) +
      '&beginHighLight=' + encodeURIComponent('<mark>') +
      '&endHighLight=' + encodeURIComponent('</mark') +
      '&maxresults=5' +
      '&app_id=' + APP_ID +
      '%app_code=' + APP_CODE;
      ajaxRequest.open('GET', AUTOCOMPLETION_URL + params);
      ajaxRequest.send();
    */


}


var platform = new H.service.Platform({
  'app_id': APP_ID,
  'app_code': APP_CODE
});

function onAutoCompleteSuccess(){
  clearOldSuggestions();
  addSuggestionsToPanel(ajaxRequest.response);
  addSuggestionsToMap(ajaxRequest.response);
}

function addSuggestionsToPanel(response) {

}

function onAutoCompleteFailed() {
  alert("Whoops");
}

$(document).ready(function() {
	// Obtain the default map types from the platform object:
	var defaultLayers = platform.createDefaultLayers();

	// Instantiate (and display) a map object:
	var map = new H.Map(
	  document.getElementById('map'),
	  defaultLayers.normal.map,
	  {
	    zoom: 10,
	    center: { lat: 52.5, lng: 13.4 }
	  });
    var group = new H.map.Group();

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    var ui = H.ui.UI.createDefault(map, defaultLayers);
    map.addObject(group);
});

$(function() {
  configure();
});


ajaxRequest.addEventListener("load", onAutoCompleteSuccess);
ajaxRequest.addEventListener("error", onAutoCompleteFailed);
ajaxRequest.responseType = "json";
