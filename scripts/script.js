var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
  ajaxRequest = new XMLHttpRequest(),
  query = '';


var APP_ID = 'gavPqgol9yAUUGHAWL0d';
var APP_CODE = 'gavPqgol9yAUUGHAWL0d';


function autoCompleteListener(textBox, event) {
  if (query != textBox.value){
    if (textBox.value.length >= 1) {

      var params = '?' +
      'query=' + encodeURIComponent(textBox.value) +
      '&beginHighLight=' + encodeURIComponent('<mark>') +
      '&endHighLight=' + encodeURIComponent('</mark') +
      '&maxresults=5' +
      '&app_id=' + APP_ID +
      '%app_code=' + APP_CODE;
      ajaxRequest.open('GET', AUTOCOMPLETION_URL + params);
      ajaxRequest.send();
    }
  }
  query = textBox.value;
}

var platform = new H.service.Platform({
  'app_id': APP_ID,
  'app_code': APP_CODE
});

function onAutoCompleteSuccess(){
	
}

$(document).ready(function() {
  console.log("XD")
	// Obtain the default map types from the platform object:
	var defaultLayers = platform.createDefaultLayers();

	// Instantiate (and display) a map object:
	var map = new H.Map(
	  document.getElementById('mapContainer'),
	  defaultLayers.normal.map,
	  {
	    zoom: 10,
	    center: { lat: 52.5, lng: 13.4 }
	  });


	var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
	var ui = H.ui.UI.createDefault(map, defaultLayers);

});

$("#form-control").keyup(function() {
	autocompleteListener($("#form-control"), keyup)
});

ajaxRequest.addEventListener("load", onAutoCompleteSuccess);
