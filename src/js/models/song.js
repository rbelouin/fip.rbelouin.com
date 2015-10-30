var _ = require("lodash");
var Bacon = require("baconjs");

var SongModel = module.exports;

var send = function(verb, url, data) {
  return Bacon.fromBinder(function(sink) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        var ok = xhr.status >= 200 && xhr.status < 300;
        sink(ok ? JSON.parse(xhr.responseText) : new Bacon.Error());
        sink(new Bacon.End());
      }
    };

    xhr.open(verb, url);
    xhr.send(data);

    return function() {
      xhr.abort();
    };
  });
};

SongModel.fetchCurrent = function(url) {
  return send("GET", url);
};

SongModel.searchOnSpotify = function(song) {
  function search(query) {
    var p_result = send("GET", "https://api.spotify.com/v1/search?type=track&q=" + _.map(query, function(value, name) {
      return name + ":" + encodeURIComponent(value);
    }).join("+"));

    return p_result.map(function(result) {
      var firstItem = result && result.tracks.items[0];
      var href = firstItem && firstItem.external_urls.spotify;

      return firstItem && {
        href: href,
        id: firstItem.id
      };
    });
  }

  var query = {
    track: song.title,
    artist: song.artist,
    album: song.album
  };

  return search(query);
};

SongModel.fetch = function(url, interval) {
  var stream = Bacon.repeat(function(i) {
    return i == 0 ? SongModel.fetchCurrent(url) :
                    Bacon.later(interval, url).flatMap(SongModel.fetchCurrent);
  });

  var p_song = stream.skipDuplicates(function(song1, song2) {
    return song1.startTime >= song2.startTime;
  }).toProperty();

  return p_song
    .flatMapLatest(function(song) {
      var p_spotify = SongModel.searchOnSpotify(song).toProperty();
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
