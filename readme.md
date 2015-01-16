# Where the hell am i?

A simple api based application to get and set your current location from your
smart phone.

## Deployment

0. Create a mysql database with the provided `schema.sql`.
0. Copy `config-sample.yml` to `config.yml` and update it with the appropriate
database information.
0. Use Passenger to deploy the rack app. The vhost's document root should point
at the `public` directory.

## Some notes about the config:

### mysql
This section is pretty self explanatory.

### map
You need a google maps api key to do the [reverse geocoding](https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding). To get a maps api key, follow [these directions](https://developers.google.com/maps/documentation/javascript/tutorial#api_key).

### secret
To update the location, you need to provide a get parameter to `update.html` by
the name of `s`. That will get passed up to the api, and validate against the
`key` variable in this section. If it's a match, the post will be accepted,
otherwise, it'll return `400: bad request`.

Authentication was done this way because it allows a user to place a bookmark
(with the get parameter in place) on the home screen of their phone, and just
tap it, rather than entering a cumbersome username and password combo.

The url should look something like this: `http://your-url-here.tld/update.html?s=secret-key-goes-here`
