(function() {
  "use strict";

  var endpoint = "http://whereami.analog.sh/api/update"
    ;

  function post_data(lat, long, city, state, country, airport, callback) {
    $.post(endpoint, {
        latitude: lat
      , longitude: long
      , city: city
      , state: state
      , country: country
      , airport: airport
    }, function(data, status, xhr) {
      console.log('data:', data);
      console.log('status:', status);
    });

  }

  function get_airport(lat, long, callback) {
    //TODO implement
  }

  function get_citydata(lat, long, callback) {

  }

  function get_location(callback) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
    });
  }

  function show_status(status) {
    // TODO implement.
  }

  function show_error(error) {
    // TODO implement.
  }

  function bootstrap() {
    if(! "geolocation" in navigator) {
      show_error("No geolocation api available. Unable to update.");
    }
    get_location();
  }
  $(document).ready(bootstrap);
}());
