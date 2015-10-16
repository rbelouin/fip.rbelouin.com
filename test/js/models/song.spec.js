var test = require("tape");
var _ = require("lodash");
var Bacon = require("baconjs");
var SongModel = require("../../../src/js/models/song.js");

var SONG_DURATION = 1000;

var songs = require("../data.js").songs;

var withMock = function(test) {
  return function(t) {
    var favorites = require("../data.js").favorites;

    var fetchCurrent = SongModel.fetchCurrent;
    var getFavorites = SongModel.getFavorites;
    var setFavorites = SongModel.setFavorites;

    var p_song = Bacon.sequentially(SONG_DURATION, songs).toProperty();
    p_song.onValue();

    SongModel.fetchCurrent = function(url) {
      return p_song.take(1);
    };

    SongModel.getFavorites = function() {
      return favorites;
    };

    SongModel.setFavorites = function(fs) {
      favorites = fs;
    };

    test(t);
  };
};

test("SongModel.fetch fetches songs correctly", withMock(function(t) {
  var p_songs = SongModel.fetch("url", SONG_DURATION / 10)
    .takeUntil(Bacon.later((songs.length + 1) * SONG_DURATION))
    .last();

  p_songs.onValue(function(ss) {
    t.deepEqual(ss.reverse(), _.map(songs, function(song) {
      return _.extend({}, song, {
        favorite: SongModel.isFavorite(song)
      });
    }));
    t.end();
  });
}));

test("SongModel should manage favorite songs correctly", withMock(function(t) {
  SongModel.addFavorite(songs[1]);
  t.deepEqual(_.sortBy([songs[0].id, songs[1].id, songs[2].id]), SongModel.getFavorites());

  SongModel.removeFavorite(songs[0]);
  t.deepEqual(_.sortBy([songs[1].id, songs[2].id]), SongModel.getFavorites());

  t.end();
}));

test("SongModel should add a favorite via a bus call", withMock(function(t) {
  SongModel.favStream.take(1).onValue(function(ev) {
    t.equal(ev.type, "added");
    t.equal(ev.song, songs[1].id);
    t.deepEqual(_.sortBy([songs[0].id, songs[1].id, songs[2].id]), SongModel.getFavorites());
    t.end();
  });

  SongModel.favBus.push({
    type: "add",
    song: songs[1]
  });
}));

test("SongModel should remove a favorite via a bus call", withMock(function(t) {
  SongModel.favStream.take(1).onValue(function(ev) {
    t.equal(ev.type, "removed");
    t.equal(ev.song, songs[0].id);
    t.deepEqual([songs[2].id], SongModel.getFavorites());
    t.end();
  });

  SongModel.favBus.push({
    type: "remove",
    song: songs[0]
  });
}));
