import _ from "lodash";
import Bacon from "baconjs";

import {
  host,
  getAuthorization,
  fetchAndFollow,
  search,
  requestToken,
  refreshToken,
  getUser,
  getPlaylists,
  createPlaylist,
  getOrCreatePlaylist,
  getPlaylistTracks,
  setPlaylistTracks,
  sync
} from "../../../src/js/models/spotify.js";

test("Spotify.getAuthorization should return an Authorization header", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  expect(getAuthorization(token)).toStrictEqual("type access_token");

  done();
});

test("Spotify.getAuthorization should return an empty header if no access token is given", function(done) {
  const token = null;

  expect(getAuthorization(null)).toStrictEqual("");
  done();
});

test("Spotify.fetchAndFollow should concat and return all the items", function(done) {
  const url = "/api/songs";
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const responses = {
    "/api/songs": {
      items: [1, 2],
      next: "/api/songs?offset=2"
    },
    "/api/songs?offset=2": {
      items: [3, 4],
      next: "/api/songs?offset=4"
    },
    "/api/songs?offset=4": {
      items: [5, 6],
      next: null
    }
  };

  function send({ method, url, headers }) {
    expect(method).toStrictEqual("GET");
    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token)
    });

    return Bacon.once(
      responses[url] ||
        new Bacon.Error({
          error: "Not Found"
        })
    ).toProperty();
  }

  fetchAndFollow(send, token, url)
    .fold([], (responses, res) => responses.concat([res]))
    .subscribe(function(ev) {
      expect(ev.hasValue()).toBeTruthy();
      expect(ev.value()).toStrictEqual(_.values(responses));
      done();

      return Bacon.noMore;
    });
});

test("Spotify.search should return a song list", function(done) {
  const song = {
    title: "Title",
    artist: "Artist",
    album: "Album"
  };

  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const response = {
    tracks: {
      items: [
        {
          id: "abc1",
          external_urls: {
            spotify: "ABC1"
          }
        },
        {
          id: "abc2",
          external_urls: {
            spotify: "ABC2"
          }
        }
      ]
    }
  };

  function send({ method, url, headers }) {
    expect(url).toStrictEqual(
      host + "/search?type=track&q=track:Title+artist:Artist+album:Album"
    );
    expect(method).toStrictEqual("GET");
    expect(headers || new Map()).toStrictEqual({
      Authorization: getAuthorization(token)
    });

    return Bacon.constant(response);
  }

  search(send, song, token).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual({
      id: "abc1",
      href: "ABC1"
    });
    done();

    return Bacon.noMore;
  });
});

test("Spotify.requestToken should update the location href", function(done) {
  const l = {
    href: "http://fip.rbelouin.com/some-path"
  };

  const scope = ["a", "b", "c"];

  requestToken(l, scope);

  expect(l.href).toStrictEqual(
    "/api/login?redirect_uri=http%3A%2F%2Ffip.rbelouin.com%2Fsome-path&scope=a&scope=b&scope=c"
  );
  done();
});

test("Spotify.refreshToken should update the location href", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  };

  const l = {
    href: "http://fip.rbelouin.com/some-path"
  };

  refreshToken(l, token);

  expect(l.href).toStrictEqual(
    "/api/login?redirect_uri=http%3A%2F%2Ffip.rbelouin.com%2Fsome-path&refresh_token=refresh_token"
  );
  done();
});

test("Spotify.getUser should return the user data", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const user = {
    display_name: "Arthur Dent",
    id: "99238472119472937429924"
  };

  function send({ method, url, headers }) {
    expect(method).toStrictEqual("GET");
    expect(url).toStrictEqual(host + "/me");
    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token)
    });

    return Bacon.constant(user);
  }

  getUser(send, token).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(user);
    done();

    return Bacon.noMore;
  });
});

test("Spotify.getPlaylists should return the user playlists", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";

  const responses = {
    "https://api.spotify.com/v1/users/294729/playlists?limit=50": {
      items: _.range(0, 50),
      next:
        "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=50"
    },
    "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=50": {
      items: _.range(50, 100),
      next:
        "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=100"
    },
    "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=100": {
      items: _.range(100, 130),
      next: null
    }
  };

  function send({ method, url, headers }) {
    expect(method).toStrictEqual("GET");
    expect(typeof responses[url]).toStrictEqual("object");
    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token)
    });

    return Bacon.constant(responses[url]);
  }

  getPlaylists(send, token, userId).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(_.range(0, 130));
    done();

    return Bacon.noMore;
  });
});

test("Spotify.createPlaylist should create a playlist", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "29729";
  const name = "playlist";
  const isPublic = false;

  function send({ method, url, headers, body }) {
    expect(method).toStrictEqual("POST");
    expect(url).toStrictEqual(host + "/users/29729/playlists");

    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token),
      "Content-Type": "application/json"
    });

    expect(body).toStrictEqual(
      JSON.stringify({
        name: name,
        public: isPublic
      })
    );

    return Bacon.constant({
      id: "blablablabla",
      name: name,
      public: isPublic
    });
  }

  createPlaylist(send, token, userId, name, isPublic).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    done();

    return Bacon.noMore;
  });
});

test("Spotify.getOrCreatePlaylist should create a playlist when it does not already exists", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "29729";
  const name = "playlist";
  const playlist = {
    id: "blablablabla",
    name: name,
    public: false
  };

  function getPlaylists({ url, headers }) {
    expect(url).toStrictEqual(host + "/users/29729/playlists?limit=50");

    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token)
    });

    return Bacon.constant({
      items: [],
      next: null
    });
  }

  function createPlaylist({ url, headers, body }) {
    expect(url).toStrictEqual(host + "/users/29729/playlists");

    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token),
      "Content-Type": "application/json"
    });

    expect(body).toStrictEqual(
      JSON.stringify({
        name: name,
        public: false
      })
    );

    return Bacon.constant(playlist);
  }

  function send({ method, url, headers, body }) {
    switch (method) {
      case "GET":
        return getPlaylists({ url, headers });
      case "POST":
        return createPlaylist({ url, headers, body });
      default:
        throw new Error("The method should be GET or POST");
    }
  }

  getOrCreatePlaylist(send, token, userId, name).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(playlist);
    done();

    return Bacon.noMore;
  });
});

test("Spotify.getOrCreatePlaylist should not create a playlist when it already exists", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "29729";
  const name = "playlist";
  const playlist = {
    id: "blablablabla",
    name: name,
    public: false
  };

  function getPlaylists({ url, headers }) {
    expect(url).toStrictEqual(host + "/users/29729/playlists?limit=50");

    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token)
    });

    return Bacon.constant({
      items: [playlist],
      next: null
    });
  }

  function send({ method, url, headers, body }) {
    switch (method) {
      case "GET":
        return getPlaylists({ url, headers });
      case "POST":
        throw new Error("It should not create a playlist");
      default:
        throw new Error("The method should be GET or POST");
    }
  }

  getOrCreatePlaylist(send, token, userId, name).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(playlist);
    done();

    return Bacon.noMore;
  });
});

test("Spotify.getPlaylistTracks should return the tracks of a playlist", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";
  const playlistId = "9274920";

  const trackFromN = n => ({
    track: {
      id: n,
      name: n + "-title",
      artists: [{ name: n + "-artist" }],
      album: {
        name: n + "-album",
        images: [{ url: n + "-image" }]
      },
      external_urls: {
        spotify: n + "-spotify"
      }
    }
  });

  const songFromN = n => ({
    id: n,
    title: n + "-title",
    artist: n + "-artist",
    album: n + "-album",
    favorite: true,
    spotify: n + "-spotify",
    spotifyId: n,
    icons: {
      medium: n + "-image"
    }
  });

  const responses = {
    "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50": {
      items: _.range(0, 50).map(trackFromN),
      next:
        "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=50"
    },
    "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=50": {
      items: _.range(50, 100).map(trackFromN),
      next:
        "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=100"
    },
    "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=100": {
      items: _.range(100, 130).map(trackFromN),
      next: null
    }
  };

  function send({ method, url, headers }) {
    expect(method).toStrictEqual("GET");
    expect(typeof responses[url]).toStrictEqual("object");
    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token)
    });

    return Bacon.constant(responses[url]);
  }

  getPlaylistTracks(send, token, userId, playlistId).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(_.range(0, 130).map(songFromN));
    done();

    return Bacon.noMore;
  });
});

test("Spotify.setPlaylistTracks should update the track list of the playlist", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";
  const playlistId = "2983";
  const tracks = ["1", "2", "3"];

  function send({ method, url, headers, body }) {
    expect(method).toStrictEqual("PUT");
    expect(url).toStrictEqual(host + "/users/294729/playlists/2983/tracks");
    expect(headers).toStrictEqual({
      Authorization: getAuthorization(token),
      "Content-Type": "application/json"
    });

    expect(body).toStrictEqual(
      JSON.stringify({
        uris: ["spotify:track:1", "spotify:track:2", "spotify:track:3"]
      })
    );

    return Bacon.constant();
  }

  setPlaylistTracks(send, token, userId, playlistId, tracks).subscribe(function(
    ev
  ) {
    expect(ev.hasValue()).toBeTruthy();
    done();

    return Bacon.noMore;
  });
});

test("Spotify.sync should return a sync object", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";
  const playlistId = "2983";

  const trackFromN = n => ({
    track: {
      id: n,
      name: n + "-title",
      artists: [{ name: n + "-artist" }],
      album: {
        name: n + "-album",
        images: [{ url: n + "-image" }]
      },
      external_urls: {
        spotify: n + "-spotify"
      }
    }
  });

  const songFromN = n => ({
    id: n,
    title: n + "-title",
    artist: n + "-artist",
    album: n + "-album",
    favorite: true,
    spotify: n + "-spotify",
    spotifyId: n,
    icons: {
      medium: n + "-image"
    }
  });

  function getPlaylistTracks() {
    return Bacon.constant({
      items: _.range(0, 30).map(trackFromN),
      next: null
    });
  }

  function setPlaylistTracks(body) {
    expect(body).toStrictEqual(
      JSON.stringify({
        uris: ["spotify:track:1", "spotify:track:2", "spotify:track:3"]
      })
    );

    return Bacon.constant();
  }

  function send({ method, url, headers, body }) {
    switch (method) {
      case "GET":
        expect(url).toStrictEqual(
          host + "/users/294729/playlists/2983/tracks?limit=50"
        );
        expect(headers).toStrictEqual({
          Authorization: getAuthorization(token)
        });

        return getPlaylistTracks();
      case "PUT":
        expect(url).toStrictEqual(host + "/users/294729/playlists/2983/tracks");
        expect(headers).toStrictEqual({
          Authorization: getAuthorization(token),
          "Content-Type": "application/json"
        });
        return setPlaylistTracks(body);
      default:
        throw new Error("Invalid method: " + method);
    }
  }

  const s = sync(send, token, userId, playlistId);

  const p_get = s.get();
  const p_set = s.set(_.range(0, 4).map(songFromN));

  const property = Bacon.combineTemplate({
    p_get,
    p_set
  });

  property.subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual({
      p_get: _.range(0, 30).map(songFromN),
      p_set: undefined
    });

    done();

    return Bacon.noMore;
  });
});
