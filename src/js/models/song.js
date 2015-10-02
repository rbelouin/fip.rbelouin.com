var _ = require("lodash");
var Bacon = require("baconjs");

var SongModel = module.exports;

/*
 * Fetch the song currently played
 * Return a Bacon property
 */
SongModel.fetchCurrent = function(url) {
  var p_response = fetch(url).then(function(res) {
    return res.ok ? res.json() : Promise.reject();
  });

  var p_song = p_response.then(function(json) {
    return {
      id: json.current.song.id,
      title: json.current.song.titre,
      artist: json.current.song.interpreteMorceau,
      startTime: json.current.song.startTime
    };
  });

  return Bacon.fromPromise(p_song).toProperty();
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
