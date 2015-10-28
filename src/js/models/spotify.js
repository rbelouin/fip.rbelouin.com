var _ = require("lodash");
var Bacon = require("baconjs");

var SpotifyModel = module.exports;

SpotifyModel.getUser = function(access_token) {
  return Bacon.fromBinder(function(sink) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        var ok = xhr.status >= 200 && xhr.status < 300;
        sink(ok ? JSON.parse(xhr.responseText) : new Bacon.Error(JSON.parse(xhr.responseText)));
        sink(new Bacon.End());
      }
    };

    xhr.open("GET", "https://api.spotify.com/v1/me");
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.send();

    return function() {
      xhr.abort();
    };
  });
};
