import _ from "lodash";
import Bacon from "baconjs";

import {
  searchOnSpotify,
  getFipSongLists,
  getSpotifyPrint,
  getSyncs,
  getFavoriteSongs,
  setFavoriteSongs,
  updateFavSongs,
  getFavSongsStream,
  mergeFavsAndSongs
} from "../../../src/js/controllers/song.js";

test("The Song controller should be able to search a song on spotify and add the ID to the song instance", function(done) {
  const Spotify = {
    search: function(song, token) {
      const responses = {
        TWO: {
          id: "2",
          href: "https://open.spotify.com/2"
        },
        THREE: {
          id: "3",
          href: "https://open.spotify.com/3"
        }
      };

      return Bacon.constant(
        token && responses[song.id] ? responses[song.id] : null
      );
    }
  };

  const songs = [
    {
      id: "ONE"
    },
    {
      id: "TWO"
    },
    {
      id: "THREE"
    }
  ];

  Bacon.zipAsArray(songs.map(_.partial(searchOnSpotify, Spotify))).subscribe(
    function(ev) {
      expect(ev.hasValue()).toBeTruthy();

      expect(ev.value()).toStrictEqual([
        {
          id: "ONE",
          spotify: null,
          spotifyId: null
        },
        {
          id: "TWO",
          spotify: "https://open.spotify.com/2",
          spotifyId: "2"
        },
        {
          id: "THREE",
          spotify: "https://open.spotify.com/3",
          spotifyId: "3"
        }
      ]);

      done();

      return Bacon.noMore;
    }
  );
});

test("The Song controller should be able to get the songs FIP is playing", function(done) {
  const Spotify = {
    search: function(song, token) {
      const responses = {
        TWO: {
          id: "2",
          href: "https://open.spotify.com/2"
        },
        THREE: {
          id: "3",
          href: "https://open.spotify.com/3"
        }
      };

      return Bacon.constant(responses[song.id] || null);
    }
  };

  const Fip = {
    fetchFipRadios: function(url, radios) {
      expect(url).toStrictEqual("/api/ws");
      expect(radios).toStrictEqual(["radio1", "radio2"]);

      return {
        radio1: Bacon.fromArray([
          {
            type: "song",
            song: {
              id: "ONE"
            }
          },
          {
            type: "song",
            song: {
              id: "TWO"
            }
          }
        ]),
        radio2: Bacon.fromArray([
          {
            type: "song",
            song: {
              id: "THREE"
            }
          },
          {
            type: "other",
            song: {
              id: "FOUR"
            }
          }
        ])
      };
    }
  };

  const wsPath = "/api/ws";

  const p_token = Bacon.constant({
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  });

  const data = getFipSongLists(
    Fip,
    Spotify,
    wsPath,
    ["radio1", "radio2"],
    p_token
  );

  const p_radio1 = data.radio1.fold([], (items, item) => items.concat([item]));

  const p_radio2 = data.radio2.fold([], (items, item) => items.concat([item]));

  Bacon.zipAsArray([p_radio1, p_radio2]).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();

    const [radio1, radio2] = ev.value();

    expect(radio1).toStrictEqual([
      [],
      [
        {
          type: "song",
          song: {
            id: "ONE",
            spotify: null,
            spotifyId: null
          }
        }
      ],
      [
        {
          type: "song",
          song: {
            id: "TWO",
            spotify: "https://open.spotify.com/2",
            spotifyId: "2"
          }
        },
        {
          type: "song",
          song: {
            id: "ONE",
            spotify: null,
            spotifyId: null
          }
        }
      ]
    ]);

    expect(radio2).toStrictEqual([
      [],
      [
        {
          type: "song",
          song: {
            id: "THREE",
            spotify: "https://open.spotify.com/3",
            spotifyId: "3"
          }
        }
      ],
      [
        {
          type: "other",
          song: {
            id: "FOUR",
            spotify: null,
            spotifyId: null
          }
        },
        {
          type: "song",
          song: {
            id: "THREE",
            spotify: "https://open.spotify.com/3",
            spotifyId: "3"
          }
        }
      ]
    ]);

    done();

    return Bacon.noMore;
  });
});

test('The Song controller should be able to get a spotify "print" (user, playlist and token data) of the user', function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  };

  const user = {
    id: "1",
    display_name: "1"
  };

  const playlist = {
    id: "2",
    name: "2"
  };

  const Spotify = {
    getUser: function(_token) {
      expect(_token).toStrictEqual(token);
      return Bacon.constant(user);
    },
    getOrCreatePlaylist: function(_token, userId, name) {
      expect(_token).toStrictEqual(token);
      expect(userId).toStrictEqual(user.id);
      expect(name).toStrictEqual("fipradio");
      return Bacon.constant(playlist);
    }
  };

  getSpotifyPrint(Spotify, token).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual({
      user: user,
      playlist: playlist,
      token: token
    });

    done();

    return Bacon.noMore;
  });
});

test("The Song controller should be able to get an object for each sync backend (localStorage and Spotify)", function(done) {
  const storageSync = {};
  const spotifySync = {};

  const print = {
    user: {
      id: "1",
      display_name: "1"
    },
    playlist: {
      id: "2",
      name: "2"
    },
    token: {
      access_token: "access_token",
      refresh_token: "refresh_token",
      expires_in: "expires_in",
      token_type: "type"
    }
  };

  const Storage = {
    sync: function(name) {
      expect(name).toStrictEqual("favorites");
      return storageSync;
    }
  };

  const Spotify = {
    sync: function(token, userId, playlistId) {
      expect(token).toStrictEqual(print.token);
      expect(userId).toStrictEqual(print.user.id);
      expect(playlistId).toStrictEqual(print.playlist.id);
      return spotifySync;
    }
  };

  expect(getSyncs(Storage, Spotify, print)).toStrictEqual([storageSync, spotifySync]);

  expect(getSyncs(Storage, Spotify, null)).toStrictEqual([storageSync]);

  done();
});

test("The Song controller should be able to get favorite songs from several sources", function(done) {
  const sync1 = {
    get: function() {
      return Bacon.constant([
        {
          id: "ONE",
          spotifyId: "1"
        },
        {
          id: "TWO",
          spotifyId: "2"
        },
        {
          id: "THREE",
          spotifyId: null
        }
      ]);
    }
  };

  const sync2 = {
    get: function() {
      return Bacon.constant([
        {
          id: "1",
          spotifyId: "1"
        },
        {
          id: "4",
          spotifyId: "4"
        }
      ]);
    }
  };

  getFavoriteSongs([sync1, sync2]).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual([
      {
        id: "ONE",
        spotifyId: "1"
      },
      {
        id: "TWO",
        spotifyId: "2"
      },
      {
        id: "THREE",
        spotifyId: null
      },
      {
        id: "4",
        spotifyId: "4"
      }
    ]);

    done();

    return Bacon.noMore;
  });
});

test("The Song controller should be able to send favorites to several destinations", function(done) {
  const sync1 = {
    songs: [],
    set: function(songs) {
      sync1.songs = songs;
      return Bacon.constant();
    }
  };

  const sync2 = {
    songs: [],
    set: function(songs) {
      sync2.songs = songs;
      return Bacon.constant();
    }
  };

  const songs = [
    {
      id: "ONE",
      spotifyId: "1"
    },
    {
      id: "TWO",
      spotifyId: "2"
    },
    {
      id: "THREE",
      spotifyId: null
    },
    {
      id: "4",
      spotifyId: "4"
    }
  ];

  setFavoriteSongs([sync1, sync2], songs).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();

    expect(sync1.songs).toStrictEqual(songs);
    expect(sync2.songs).toStrictEqual(songs);

    done();

    return Bacon.noMore;
  });
});

test("The Song controller should be able to update the favorite song list when it receives an event", function(done) {
  const favSongs1 = [
    {
      id: "1",
      favorite: true
    },
    {
      id: "2",
      favorite: true
    },
    {
      id: "3",
      favorite: true
    }
  ];

  const favSongs2 = updateFavSongs(favSongs1, {
    type: "add",
    song: { id: "4" }
  });

  const favSongs3 = updateFavSongs(favSongs2, {
    type: "add",
    song: { id: "4" }
  });

  const favSongs4 = updateFavSongs(favSongs3, {
    type: "remove",
    song: { id: "3" }
  });

  const favSongs5 = updateFavSongs(favSongs4, {
    type: "remove",
    song: { id: "3" }
  });

  expect(favSongs2).toStrictEqual([
    {
      id: "1",
      favorite: true
    },
    {
      id: "2",
      favorite: true
    },
    {
      id: "3",
      favorite: true
    },
    {
      id: "4",
      favorite: true
    }
  ]);

  expect(favSongs3).toStrictEqual([
    {
      id: "1",
      favorite: true
    },
    {
      id: "2",
      favorite: true
    },
    {
      id: "3",
      favorite: true
    },
    {
      id: "4",
      favorite: true
    }
  ]);

  expect(favSongs4).toStrictEqual([
    {
      id: "1",
      favorite: true
    },
    {
      id: "2",
      favorite: true
    },
    {
      id: "4",
      favorite: true
    }
  ]);

  expect(favSongs5).toStrictEqual([
    {
      id: "1",
      favorite: true
    },
    {
      id: "2",
      favorite: true
    },
    {
      id: "4",
      favorite: true
    }
  ]);

  done();
});

test("The Song controller should be able to provide a property containing the favorite songs", function(done) {
  const songs1 = [
    {
      id: "ONE",
      spotifyId: null,
      favorite: true
    },
    {
      id: "TWO",
      spotifyId: "2",
      favorite: true
    }
  ];

  const songs2 = [
    {
      id: "2",
      spotifyId: "2",
      favorite: true
    },
    {
      id: "3",
      spotifyId: "3",
      favorite: true
    }
  ];

  const sync1 = {
    get: function() {
      return Bacon.constant(songs1);
    }
  };

  const sync2 = {
    get: function() {
      return Bacon.constant(songs2);
    }
  };

  const favBus = new Bacon.Bus();

  const s_favSongs = getFavSongsStream([sync1, sync2], favBus);

  s_favSongs
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      expect(ev.hasValue()).toBeTruthy();

      expect(ev.value()).toStrictEqual([
        [
          {
            id: "ONE",
            spotifyId: null,
            favorite: true
          },
          {
            id: "TWO",
            spotifyId: "2",
            favorite: true
          },
          {
            id: "3",
            spotifyId: "3",
            favorite: true
          }
        ],
        [
          {
            id: "ONE",
            spotifyId: null,
            favorite: true
          },
          {
            id: "TWO",
            spotifyId: "2",
            favorite: true
          },
          {
            id: "3",
            spotifyId: "3",
            favorite: true
          },
          {
            id: "4",
            spotifyId: "4",
            favorite: true
          }
        ],
        [
          {
            id: "ONE",
            spotifyId: null,
            favorite: true
          },
          {
            id: "TWO",
            spotifyId: "2",
            favorite: true
          },
          {
            id: "3",
            spotifyId: "3",
            favorite: true
          },
          {
            id: "4",
            spotifyId: "4",
            favorite: true
          }
        ],
        [
          {
            id: "ONE",
            spotifyId: null,
            favorite: true
          },
          {
            id: "TWO",
            spotifyId: "2",
            favorite: true
          },
          {
            id: "4",
            spotifyId: "4",
            favorite: true
          }
        ],
        [
          {
            id: "ONE",
            spotifyId: null,
            favorite: true
          },
          {
            id: "TWO",
            spotifyId: "2",
            favorite: true
          },
          {
            id: "4",
            spotifyId: "4",
            favorite: true
          }
        ]
      ]);

      done();

      return Bacon.noMore;
    });

  favBus.push({
    type: "add",
    song: {
      id: "4",
      spotifyId: "4",
      favorite: true
    }
  });

  favBus.push({
    type: "add",
    song: {
      id: "4",
      spotifyId: "4",
      favorite: true
    }
  });

  favBus.push({
    type: "remove",
    song: {
      id: "3",
      spotifyId: "3",
      favorite: true
    }
  });

  favBus.push({
    type: "remove",
    song: {
      id: "3",
      spotifyId: "3",
      favorite: true
    }
  });

  favBus.end();
});

test("The Song controller should fill the data model of the songs being played with a 'favorite' field", function(done) {
  const songs = [
    {
      type: "song",
      song: {
        id: "1"
      }
    },
    {
      type: "song",
      song: {
        id: "2"
      }
    },
    {
      type: "other",
      song: {
        id: "3"
      }
    },
    {
      type: "song",
      song: {
        id: "4"
      }
    }
  ];

  const favs = [
    {
      id: "1",
      favorite: true
    },
    {
      id: "4",
      favorite: true
    }
  ];

  expect(mergeFavsAndSongs(songs, favs)).toStrictEqual([
    {
      type: "song",
      song: {
        id: "1",
        favorite: true
      }
    },
    {
      type: "song",
      song: {
        id: "2",
        favorite: false
      }
    },
    {
      type: "other",
      song: {
        id: "3"
      }
    },
    {
      type: "song",
      song: {
        id: "4",
        favorite: true
      }
    }
  ]);

  done();
});
