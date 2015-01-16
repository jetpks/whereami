(function() {
  "use strict";

  var endpoint = 'http://' + location.hostname + '/api'
    ;

  function draw() {
    var mapOpts = {
            center: new google.maps.LatLng(30,-50)
          , zoom: 2
        }
      , map = new google.maps.Map(document.getElementById("map-canvas"), mapOpts)
      ;

  }

  function show_status(status) {
    $('#status').prepend('<h2>' + status + '</h2>');
  }

  function show_error(error) {
    $('#error').prepend('<h2>' + error + '</h2>');
  }

  function lock_until_ready(callback) {
    if(!window.maps_are_ready) {
      setTimeout(function() { lock_until_ready(callback); }, 10);
      return;
    }
    callback();
  }

  function bootstrap() {
    if(! "geolocation" in navigator) {
      show_error("No geolocation api available. Unable to update.");
      return;
    }
    show_status("Initializing!");
    lock_until_ready(draw);
  }

  $(document).ready(bootstrap);
}());
