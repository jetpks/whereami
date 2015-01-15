(function() {
  "use strict";

  function get_location() {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
    });
  }

  function show_error(error) {
    // TODO implement.

  }

  function bootstrap() {
    if(! "geolocation" in navigator) {
      show_error("No geolocation api available. Unable to update.");
    }
    get_location();
    setTimeout(get_location, 5000);
  }
  $(document).ready(bootstrap);
}());
