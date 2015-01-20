(function() {
  "use strict";

  var endpoint = 'http://' + location.hostname + '/api'
    , map
    , style = [{"stylers":[{"saturation":-100}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#0099dd"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#aadd55"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"on"}]},{}]
    ;

  function draw() {
    var mapOpts = {
            center: new google.maps.LatLng(30,-40)
          , zoom: 2
          , mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style' ] }
        }
      , styledMap = new google.maps.StyledMapType(style, {name: 'Locations of Me'})
      ;
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOpts);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
    get_locs();
  }

  function add_to_list(loc, callback) {
    parse_time(loc, function(time) {
      $('#loclist > ol').append('<li><span class="loctime">' + time + '</span><span class="locloc">' + loc['city'] + ', ' + loc['state'] + ', ' + loc['country'] + '</span></li>');
      
      callback();
    });
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

  function parse_time(raw, callback) {
    var date = new Date(0);
    date.setUTCSeconds(raw);
    callback(date.toString());
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
