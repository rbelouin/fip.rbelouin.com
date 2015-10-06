var _ = require("lodash");
var Bacon = require("baconjs");

var SongModel = module.exports;

/*
 * Fetch the song currently played
 * Return a Bacon property
 */
SongModel.fetchCurrent = function(url) {
  return Bacon.fromBinder(function(sink) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        var ok = xhr.status >= 200 && xhr.status < 300;
        sink(ok ? JSON.parse(xhr.responseText) : new Bacon.Error());
        sink(new Bacon.End());
      }
    };

    xhr.open("GET", url);
    xhr.send();

    return function() {
      xhr.abort();
    };
  });
};

SongModel.fetch = function(url, interval) {
  var stream = Bacon.repeat(function(i) {
    return i == 0 ? SongModel.fetchCurrent(url) :
                    Bacon.later(interval, url).flatMap(SongModel.fetchCurrent);
  });

  var p_song = stream.skipDuplicates(function(song1, song2) {
    return song1.startTime >= song2.startTime;
  }).toProperty();

  return p_song.scan([], function(songs, song) {
    return [song].concat(songs);
  });
};
