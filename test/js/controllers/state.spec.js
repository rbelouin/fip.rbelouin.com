import test from "tape";
import _ from "lodash";
import Bacon from "baconjs";

import {
  getState
} from "../../../src/js/controllers/state.js";

import getSongController from "../../../src/js/controllers/song.js";

test("The State controller should provide a state property", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  };

  const location = {
    host: "host"
  };

  const history = {
    pushState: function(x, y, path) {
    }
  };

  const Storage = {
    songs: [{
      id: "ONE",
      spotify: null,
      spotifyId: null,
      favorite: true
    },{
      id: "TWO",
      spotify: "2",
      spotifyId: "2",
      favorite: true
    }],
    sync: function() {
      return {
        get: function() {
          return Bacon.constant(Storage.songs);
        },
        set: function(songs) {
          Storage.songs = songs;
          return Bacon.constant();
        }
      };
    }
  };

  const Spotify = {
    user: {
      id: "42",
      display_name: "FORTY TWO"
    },
    playlist: {
      id: "43",
      name: "FORTY THREE"
    },
    songs: [{
      id: "2",
      spotify: "2",
      spotifyId: "2",
      favorite: true
    },{
      id: "3",
      spotify: "3",
      spotifyId: "3",
      favorite: true
    }],
    search: function(song) {
      const res = {
        "ONE": null,
        "TWO": "2",
        "THREE": "3",
        "FOUR": "4",
        "FIVE": "5"
      };

      return Bacon.constant(!res[song.id] ? null : {
        href: res[song.id],
        id: res[song.id]
      });
    },
    getUser: function(token) {
      return Bacon.constant(token ? Spotify.user : null);
    },
    getOrCreatePlaylist: function(token, userId, name) {
      return Bacon.constant(Spotify.playlist);
    },
    sync: function() {
      return {
        get: function() {
          return Bacon.constant(Spotify.songs);
        },
        set: function(songs) {
          Spotify.songs = songs;
          return Bacon.constant();
        }
      };
    }
  };

  const s_radio1 = new Bacon.Bus();
  const s_radio2 = new Bacon.Bus();

  const radios = ["radio1", "radio2"];
  const Fip = {
    fetchFipRadios: function(url, _radios) {
      t.deepEqual(_radios, radios);

      return {
        radio1: s_radio1,
        radio2: s_radio2
      };
    }
  };

  const favBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();

  const TokenController = {
    getTokenProperty: function(history, syncBus) {
      return Bacon.constant(token);
    }
  };

  const SongController = getSongController(Storage, Spotify, Fip, location, radios);

  const UIController = {
    getLoadProperty: function() {
      return Bacon.constant(true);
    },
    getPaneStatus: function() {
      return Bacon.constant(false);
    },
    getPlayerPosition: function() {
      return Bacon.constant(false);
    }
  };

  const state = getState(TokenController, SongController, UIController, history, favBus, syncBus);

  const p_user = state.user.fold([], (acc, ev) => acc.concat([ev]));
  const p_radios = state.radios.fold([], (acc, ev) => acc.concat([ev]));
  const p_favs = state.favSongs.fold([], (acc, ev) => acc.concat([ev]));

  Bacon.combineAsArray([p_user, p_radios, p_favs]).subscribe(ev => {
    t.ok(ev.hasValue());

    const [user, radios, favSongs] = ev.value();

    t.deepEqual(user, [Spotify.user]);

    t.deepEqual(radios, [{
      radio1: {
        nowPlaying: {
          type: "loading"
        },
        pastSongs: []
      },
      radio2: {
        nowPlaying: {
          type: "loading"
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      },
      radio2: {
        nowPlaying: {
          type: "loading"
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      },
      radio2: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FIVE",
            spotify: "5",
            spotifyId: "5",
            favorite: false
          }
        },
        pastSongs: [{
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        }]
      },
      radio2: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FIVE",
            spotify: "5",
            spotifyId: "5",
            favorite: false
          }
        },
        pastSongs: [{
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: true
          }
        }]
      },
      radio2: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: true
          }
        },
        pastSongs: []
      }
    }]);

    t.deepEqual(favSongs, [
      [{
        id: "ONE",
        spotify: null,
        spotifyId: null,
        favorite: true
      },{
        id: "TWO",
        spotify: "2",
        spotifyId: "2",
        favorite: true
      },{
        id: "3",
        spotify: "3",
        spotifyId: "3",
        favorite: true
      }],
      [{
        id: "ONE",
        spotify: null,
        spotifyId: null,
        favorite: true
      },{
        id: "3",
        spotify: "3",
        spotifyId: "3",
        favorite: true
      }],
      [{
        id: "ONE",
        spotify: null,
        spotifyId: null,
        favorite: true
      },{
        id: "3",
        spotify: "3",
        spotifyId: "3",
        favorite: true
      },{
        id: "FOUR",
        spotify: "4",
        spotifyId: "4",
        favorite: true
      }]
    ]);

    t.deepEqual(Storage.songs, [{
      id: "ONE",
      spotify: null,
      spotifyId: null,
      favorite: true
    },{
      id: "3",
      spotify: "3",
      spotifyId: "3",
      favorite: true
    },{
      id: "FOUR",
      spotify: "4",
      spotifyId: "4",
      favorite: true
    }]);

    t.deepEqual(Spotify.songs, [{
      id: "ONE",
      spotify: null,
      spotifyId: null,
      favorite: true
    },{
      id: "3",
      spotify: "3",
      spotifyId: "3",
      favorite: true
    },{
      id: "FOUR",
      spotify: "4",
      spotifyId: "4",
      favorite: true
    }]);

    t.end();

    return Bacon.noMore;
  });

  s_radio1.push({
    type: "song",
    song: {
      id: "FOUR"
    }
  });

  s_radio2.push({
    type: "song",
    song: {
      id: "FOUR"
    }
  });

  favBus.push({
    type: "remove",
    song: {
      id: "TWO",
      spotify: "2",
      spotifyId: "2",
      favorite: true
    }
  });

  s_radio1.push({
    type: "song",
    song: {
      id: "FIVE"
    }
  });

  favBus.push({
    type: "add",
    song: {
      id: "FOUR",
      spotify: "4",
      spotifyId: "4",
      favorite: false
    }
  });

  s_radio1.end();
  s_radio2.end();
  favBus.end();
  syncBus.end();
});

test("The State controller should provide a state property (even when if token is given)", function(t) {
  const token = null;

  const location = {
    host: "host"
  };

  const history = {
    pushState: function(x, y, path) {
    }
  };

  const Storage = {
    songs: [{
      id: "ONE",
      spotify: null,
      spotifyId: null,
      favorite: true
    },{
      id: "TWO",
      spotify: "2",
      spotifyId: "2",
      favorite: true
    }],
    sync: function() {
      return {
        get: function() {
          return Bacon.constant(Storage.songs);
        },
        set: function(songs) {
          Storage.songs = songs;
          return Bacon.constant();
        }
      };
    }
  };

  const Spotify = {
    user: {
      id: "42",
      display_name: "FORTY TWO"
    },
    playlist: {
      id: "43",
      name: "FORTY THREE"
    },
    songs: [{
      id: "2",
      spotify: "2",
      spotifyId: "2",
      favorite: true
    },{
      id: "3",
      spotify: "3",
      spotifyId: "3",
      favorite: true
    }],
    search: function(song) {
      const res = {
        "ONE": null,
        "TWO": "2",
        "THREE": "3",
        "FOUR": "4",
        "FIVE": "5"
      };

      return Bacon.constant(!res[song.id] ? null : {
        href: res[song.id],
        id: res[song.id]
      });
    },
    getUser: function(token) {
      return Bacon.constant(token ? Spotify.user : null);
    },
    getOrCreatePlaylist: function(token, userId, name) {
      return Bacon.constant(Spotify.playlist);
    },
    sync: function() {
      return {
        get: function() {
          return Bacon.constant(Spotify.songs);
        },
        set: function(songs) {
          Spotify.songs = songs;
          return Bacon.constant();
        }
      };
    }
  };

  const s_radio1 = new Bacon.Bus();
  const s_radio2 = new Bacon.Bus();

  const radios = ["radio1", "radio2"];
  const Fip = {
    fetchFipRadios: function(url, _radios) {
      t.deepEqual(_radios, radios);

      return {
        radio1: s_radio1,
        radio2: s_radio2
      };
    }
  };

  const favBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();

  const TokenController = {
    getTokenProperty: function(history, syncBus) {
      return Bacon.constant(token);
    }
  };

  const SongController = getSongController(Storage, Spotify, Fip, location, radios);

  const UIController = {
    getLoadProperty: function() {
      return Bacon.constant(true);
    },
    getPaneStatus: function() {
      return Bacon.constant(false);
    },
    getPlayerPosition: function() {
      return Bacon.constant(false);
    }
  };

  const state = getState(TokenController, SongController, UIController, history, favBus, syncBus);

  const p_user = state.user.fold([], (acc, ev) => acc.concat([ev]));
  const p_radios = state.radios.fold([], (acc, ev) => acc.concat([ev]));
  const p_favs = state.favSongs.fold([], (acc, ev) => acc.concat([ev]));

  Bacon.combineAsArray([p_user, p_radios, p_favs]).subscribe(ev => {
    t.ok(ev.hasValue());

    const [user, radios, favSongs] = ev.value();

    t.deepEqual(user, [null]);

    t.deepEqual(radios, [{
      radio1: {
        nowPlaying: {
          type: "loading"
        },
        pastSongs: []
      },
      radio2: {
        nowPlaying: {
          type: "loading"
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      },
      radio2: {
        nowPlaying: {
          type: "loading"
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      },
      radio2: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FIVE",
            spotify: "5",
            spotifyId: "5",
            favorite: false
          }
        },
        pastSongs: [{
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        }]
      },
      radio2: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: false
          }
        },
        pastSongs: []
      }
    },{
      radio1: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FIVE",
            spotify: "5",
            spotifyId: "5",
            favorite: false
          }
        },
        pastSongs: [{
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: true
          }
        }]
      },
      radio2: {
        nowPlaying: {
          type: "song",
          song: {
            id: "FOUR",
            spotify: "4",
            spotifyId: "4",
            favorite: true
          }
        },
        pastSongs: []
      }
    }]);

    t.deepEqual(favSongs, [
      [{
        id: "ONE",
        spotify: null,
        spotifyId: null,
        favorite: true
      },{
        id: "TWO",
        spotify: "2",
        spotifyId: "2",
        favorite: true
      }],
      [{
        id: "ONE",
        spotify: null,
        spotifyId: null,
        favorite: true
      }],
      [{
        id: "ONE",
        spotify: null,
        spotifyId: null,
        favorite: true
      },{
        id: "FOUR",
        spotify: "4",
        spotifyId: "4",
        favorite: true
      }]
    ]);

    t.deepEqual(Storage.songs, [{
      id: "ONE",
      spotify: null,
      spotifyId: null,
      favorite: true
    },{
      id: "FOUR",
      spotify: "4",
      spotifyId: "4",
      favorite: true
    }]);

    t.deepEqual(Spotify.songs, [{
      id: "2",
      spotify: "2",
      spotifyId: "2",
      favorite: true
    },{
      id: "3",
      spotify: "3",
      spotifyId: "3",
      favorite: true
    }]);

    t.end();

    return Bacon.noMore;
  });

  s_radio1.push({
    type: "song",
    song: {
      id: "FOUR"
    }
  });

  s_radio2.push({
    type: "song",
    song: {
      id: "FOUR"
    }
  });

  favBus.push({
    type: "remove",
    song: {
      id: "TWO",
      spotify: "2",
      spotifyId: "2",
      favorite: true
    }
  });

  s_radio1.push({
    type: "song",
    song: {
      id: "FIVE"
    }
  });

  favBus.push({
    type: "add",
    song: {
      id: "FOUR",
      spotify: "4",
      spotifyId: "4",
      favorite: false
    }
  });

  s_radio1.end();
  s_radio2.end();
  favBus.end();
  syncBus.end();
});
