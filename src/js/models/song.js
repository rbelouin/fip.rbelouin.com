var _ = require("lodash");
var Bacon = require("baconjs");

var SongModel = module.exports;
var SpotifyModel = require("./spotify.js");

SongModel._wrapWebSocket = function(settings) {
  var socket = new WebSocket(settings.url);

  socket.onmessage = settings.onmessage;
  socket.onerror = settings.onerror;

  socket.onclose = function() {
    setTimeout(function() {
      SongModel._wrapWebSocket(settings);
    }, settings.interval);
  };

  return socket;
};

SongModel.fetch = function(url, interval) {
  var stream = Bacon.fromBinder(function(sink) {
    SongModel._wrapWebSocket({
      url: "ws://" + window.location.host + "/api/ws/songs",
      interval: interval,
      onmessage: function(message) {
        try {
          var data = JSON.parse(message.data);
          sink(data.type === "song" ? data.song : new Bacon.Error(data.error));
        }
        catch(e) {
          sink(new Bacon.Error(e));
        }
      },
      onerror: function(error) {
        sink(new Bacon.Error(error));
      }
    });

    return function() {};
  });

  var p_song = stream.skipDuplicates(function(song1, song2) {
    return song1.startTime >= song2.startTime;
  }).toProperty();

  return p_song
    .flatMapLatest(function(song) {
      var p_spotify = SpotifyModel.search(song).toProperty();
      return p_spotify.mapError(null).map(function(spotify) {
        return _.extend({}, song, {
          spotify: spotify && spotify.href,
          spotifyId: spotify && spotify.id
        });
      });
    })
    .scan([], function(songs, song) {
      return [song].concat(songs);
    })
    .flatMapLatest(function(songs) {
      var p_favorites = SongModel.favStream.map(SongModel.getFavorites)
                          .toProperty(SongModel.getFavorites());

      return p_favorites.map(function(favorites) {
        return _.map(songs, function(song) {
          return _.extend({}, song, {
            favorite: _.any(favorites, function(favSong) {
              return favSong.id === song.id;
            })
          });
        });
      });
    });
};

SongModel.getFavorites = function() {
  return JSON.parse(localStorage.favorites || "[]");
};

SongModel.setFavorites = function(favorites) {
  localStorage.favorites = JSON.stringify(_.map(favorites, function(song) {
    return _.extend({}, song, {
      favorite: true
    });
  }));
};

SongModel.isFavorite = function(song) {
  return _.any(SongModel.getFavorites(), function(favSong) {
    return favSong.id === song.id;
  });
};

SongModel.addFavorite = function(song) {
  if(!SongModel.isFavorite(song)) {
    SongModel.setFavorites(SongModel.getFavorites().concat([song]));
  }
};

SongModel.removeFavorite = function(song) {
  SongModel.setFavorites(_.reject(SongModel.getFavorites(), function(favSong) {
    return favSong.id === song.id
  }));
};

SongModel.favBus = new Bacon.Bus();

SongModel.favStream = SongModel.favBus.map(function(ev) {
  switch(ev.type) {
    case "add":
      SongModel.addFavorite(ev.song);
      return {type: "added", song: ev.song.id};
      break;
    case "remove":
      SongModel.removeFavorite(ev.song);
      return {type: "removed", song: ev.song.id};
      break;
    default:
      return new Bacon.Error("Unknown type: " + ev.type);
      break;
  }
});

SongModel.favSongs = SongModel.favStream.map(function() {
  return SongModel.getFavorites();
}).toProperty(SongModel.getFavorites());
