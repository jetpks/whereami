(function() {
  "use strict";

  var endpoint = 'http://' + location.hostname + '/api'
    ;

  function post_data(lat, lng, city, state, country, airport) {
    $.post(endpoint + '/update', {
        latitude: lat
      , longitude: lng
      , city: city
      , state: state
      , country: country
//      , airport: airport
    }, function(data, status, xhr) {
      console.log('data:', data);
      console.log('status:', status);
      show_status('OK');
    });
  }

  function get_airport(lat, long, callback) {
    //TODO implement
  }

  function parse_googles_weird_shit(results, lat, lng) {
    var city
      , state
      , country
      ;
    async.each(results['address_components'], function(loc, next) {
      if(loc['types'][0] == 'locality') {
        city = loc['long_name'];
        next();
        return;
      }
      if(loc['types'][0] == 'administrative_area_level_1') {
        state = loc['long_name'];
        next();
        return;
      }
      if(loc['types'][0] == 'country') {
        country = loc['long_name'];
        next();
        return;
      }
      next();
      return;
    }, function(err) {
      post_data(lat,lng,city,state,country);
    });
  }
  
  function lock_until_ready(callback) {
    if(!window.maps_are_ready) {
      setTimeout(lock_until_ready, 10);
      return;
    }
    callback();
  }

  function get_location() {
    navigator.geolocation.getCurrentPosition(function(position) {
      lock_until_ready(function() {
        var geocoder = new google.maps.Geocoder()
          , latlng = new google.maps.LatLng(position['coords']['latitude'], position['coords']['longitude'])
          ;
        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if(status != google.maps.GeocoderStatus.OK) {
            show_error("Unable to geocode coordinates.");
            console.log(results, status);
            return;
          }
          parse_googles_weird_shit(results[0], position['coords']['latitude'], position['coords']['longitude']);
        });
      });
    });
  }

  function show_status(status) {
    // TODO implement.
  }

  function show_error(error) {
    // TODO implement.
  }

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
      window.maps_are_ready = false;
      script.type = "text/javascript";
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + data["key"]
        + '&callback=all_loaded_tnks';
      $('head').append(script);
      get_location();
    });
  }

  function bootstrap() {
    if(! "geolocation" in navigator) {
      show_error("No geolocation api available. Unable to update.");
      return;
    }
    load_mapsapi();
  }

  $(document).ready(bootstrap);
}());

function all_loaded_tnks() {
  window.maps_are_ready = true;
}
