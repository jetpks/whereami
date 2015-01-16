(function() {
  "use strict";

  var endpoint = 'http://' + location.hostname + '/api'
    , map
    ;

  function draw() {
    var mapOpts = {
            center: new google.maps.LatLng(30,-40)
          , zoom: 2
        }
      ;
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOpts);
    get_locs();
  }

  function add_to_list(loc, callback) {
    $('#loclist').append('<li>' + loc['city'] + ', ' + loc['state'] + ', ' + loc['country'] + '</li>');
    callback();
  }

  function set_marker(loc, callback) {
    var latlng = new google.maps.LatLng(loc['latitude'], loc['longitude'])
      , marker = new google.maps.Marker({
            position: latlng
          , title: loc['city'] + ', ' + loc['state'] + ', ' + loc['country']
        })
      ;
      marker.setMap(map);
      add_to_list(loc, callback);
  }

  function get_locs() {
    $.get(endpoint + '/last/0', function(data, status, xhr) {
      if(status != "success") {
        show_error("Problem getting locations.");
        console.error('status:', status, 'data:', data);
        return;
      }
      async.each(data, set_marker, function(err) {

      });
    });
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
