(function() {
  "use strict";

  var endpoint = 'http://' + location.hostname + '/api'
    ;

  function post_data(lat, lng, city, state, country, airport) {
    var secret = get_url_param('s')
      ;
    show_status("Uploading data...");
    
    $.ajax({
        url: endpoint + '/update'
      , type: "POST"
      , data: {
          latitude: lat
        , longitude: lng
        , city: city
        , state: state
        , country: country
        , secret: secret
//        , airport: airport
        }
      , dataType: "text"
      , success: function(data, status, xhr) {
          show_status('Done!');
        }
      , error: function(xhr, status, err) {
          show_error(err);
          console.error(err);
        }
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
    show_status("Translating coordinates...");
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
      setTimeout(function() { lock_until_ready(callback); }, 10);
      return;
    }
    callback();
  }

  function get_location() {
    show_status("Acquiring current location...");
    navigator.geolocation.getCurrentPosition(function(position) {
      lock_until_ready(function() {
        show_status("Locked.");
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

  /* Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript */
  function get_url_param(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function show_status(status) {
    $('#status').prepend('<h2>' + status + '</h2>');
  }

  function show_error(error) {
    $('#error').prepend('<h2>' + error + '</h2>');
  }

  function bootstrap() {
    if(! "geolocation" in navigator) {
      show_error("No geolocation api available. Unable to update.");
      return;
    }
    show_status("Initializing!");
    get_location();
  }

  $(document).ready(bootstrap);
}());
