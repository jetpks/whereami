(function() {
  "use strict";

  var endpoint = 'http://' + location.hostname + '/api'
    ;

  function load_mapsapi() {
    $.get(endpoint + '/mapkey', function(data, status, xhr) {
      var key
        , script = document.createElement("script")
        ;
      if(status != "success") {
        console.error(e, data, status, xhr);
        show_error('Unable to get maps api key.');
        return;
      }
      script.type = "text/javascript";
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + data["key"]
        + '&callback=all_loaded_tnks';
      $('head').append(script);
    });
  }

  function bootstrap() {
    window.maps_are_ready = false;
    if(! "geolocation" in navigator) {
      show_error("No geolocation api available. Unable to update.");
      return;
    }
    load_mapsapi();
  }

  $(document).ready(bootstrap);
}());

/* Hack to get around loading google maps js asynchronously. */
function all_loaded_tnks() {
  window.maps_are_ready = true;
}
