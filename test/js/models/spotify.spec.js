import test from "tape";
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

test("Spotify.getAuthorization should return an Authorization header", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  t.equal(
    getAuthorization(token),
    "type access_token",
    "Access token should be prefixed with Bearer"
  );

  t.end();
});

test("Spotify.getAuthorization should return an empty header if no access token is given", function(t) {
  const token = null;

  t.equal(getAuthorization(null), "", "Header should be empty");
  t.end();
});

test("Spotify.fetchAndFollow should concat and return all the items", function(t) {
  const url = "/api/songs";
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
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

  function send({method, url, headers}) {
    t.equal(method, "GET", "The method should be GET");
    t.deepEqual(headers, {
      "Authorization": getAuthorization(token)
    }, "The Authorization header must be valid");

    return Bacon.once(responses[url] || new Bacon.Error({
      error: "Not Found"
    })).toProperty();
  }

  fetchAndFollow(send, token, url)
    .fold([], (responses, res) => responses.concat([res]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue(), "The event should not be an error nor an end");
      t.deepEqual(ev.value(), _.values(responses));
      t.end();

      return Bacon.noMore;
    });
});

test("Spotify.search should return a song list", function(t) {
  const song = {
    title: "Title",
    artist: "Artist",
    album: "Album"
  };

  const response = {
    tracks: {
      items: [{
        id: "abc1",
        external_urls: {
          spotify: "ABC1"
        }
      },{
        id: "abc2",
        external_urls: {
          spotify: "ABC2"
        }
      }]
    }
  };

  function send({method, url, headers}) {
    t.equal(url, host + "/search?type=track&q=track:Title+artist:Artist+album:Album", "The URL should be correct");
    t.equal(method, "GET", "The method should be GET");
    t.deepEqual(headers || new Map(), new Map());

    return Bacon.constant(response);
  }

  search(send, song).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.deepEqual(ev.value(), {
      id: "abc1",
      href: "ABC1"
    }, "The returned value should be the first result of the response");
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.requestToken should update the location href", function(t) {
  const l = {
    href: "http://fip.rbelouin.com/some-path"
  };

  const scope = ["a", "b", "c"];

  requestToken(l, scope);

  t.equal(l.href, "/api/login?redirect_uri=http%3A%2F%2Ffip.rbelouin.com%2Fsome-path&scope=a&scope=b&scope=c");
  t.end();
});

test("Spotify.refreshToken should update the location href", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  };

  const l = {
    href: "http://fip.rbelouin.com/some-path"
  };

  refreshToken(l, token);

  t.equal(l.href, "/api/login?redirect_uri=http%3A%2F%2Ffip.rbelouin.com%2Fsome-path&refresh_token=refresh_token");
  t.end();
});

test("Spotify.getUser should return the user data", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const user = {
    "display_name" : "Arthur Dent",
    "id" : "99238472119472937429924"
  };

  function send({method, url, headers}) {
    t.equal(method, "GET", "The method should be GET");
    t.equal(url, host + "/me", "The URL should be OK");
    t.deepEqual(headers, {
      "Authorization": getAuthorization(token)
    });

    return Bacon.constant(user);
  }

  getUser(send, token).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.equal(ev.value(), user, "The value returned should be user data");
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.getPlaylists should return the user playlists", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";

  const responses = {
    "https://api.spotify.com/v1/users/294729/playlists?limit=50": {
      items: _.range(0, 50),
      next: "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=50"
    },
    "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=50": {
      items: _.range(50, 100),
      next: "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=100"
    },
    "https://api.spotify.com/v1/users/294729/playlists?limit=50&offset=100": {
      items: _.range(100, 130),
      next: null
    }
  };

  function send({method, url, headers}) {
    t.equal(method, "GET", "The method should be GET");
    t.equal(typeof responses[url], "object", "The URL should be correct");
    t.deepEqual(headers, {
      "Authorization": getAuthorization(token)
    });

    return Bacon.constant(responses[url]);
  }

  getPlaylists(send, token, userId).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.deepEqual(
      ev.value(),
      _.range(0, 130),
      "The value returned should be all the user playlists"
    );
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.createPlaylist should create a playlist", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "29729";
  const name = "playlist";
  const isPublic = false;

  function send({method, url, headers, body}) {
    t.equal(method, "POST", "The method should be POST");
    t.equal(url, host + "/users/29729/playlists", "The URL should be OK");

    t.deepEqual(headers, {
      "Authorization": getAuthorization(token),
      "Content-Type": "application/json"
    });

    t.equal(body, JSON.stringify({
      "name": name,
      "public": isPublic
    }));

    return Bacon.constant({
      "id": "blablablabla",
      "name": name,
      "public": isPublic
    });
  }

  createPlaylist(send, token, userId, name, isPublic).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.getOrCreatePlaylist should create a playlist when it does not already exists", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "29729";
  const name = "playlist";
  const playlist = {
    "id" : "blablablabla",
    "name" : name,
    "public" : false
  };

  function getPlaylists({url, headers}) {
    t.equal(url, host + "/users/29729/playlists?limit=50", "The URL should be correct");

    t.deepEqual(headers, {
      "Authorization": getAuthorization(token)
    });

    return Bacon.constant({
      items: [],
      next: null
    });
  }

  function createPlaylist({url, headers, body}) {
    t.equal(url, host + "/users/29729/playlists", "The URL should be correct");

    t.deepEqual(headers, {
      "Authorization": getAuthorization(token),
      "Content-Type": "application/json"
    });

    t.deepEqual(body, JSON.stringify({
      "name": name,
      "public": false
    }));

    return Bacon.constant(playlist);
  }

  function send({method, url, headers, body}) {
    switch(method) {
      case "GET":
        return getPlaylists({url, headers});
      case "POST":
        return createPlaylist({url, headers, body});
      default:
        t.fail("The method should be GET or POST");
    }
  }

  getOrCreatePlaylist(send, token, userId, name).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.deepEqual(ev.value(), playlist, "The returned value should be the newly created playlist");
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.getOrCreatePlaylist should not create a playlist when it already exists", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "29729";
  const name = "playlist";
  const playlist = {
    "id" : "blablablabla",
    "name" : name,
    "public" : false
  };

  function getPlaylists({url, headers}) {
    t.equal(url, host + "/users/29729/playlists?limit=50", "The URL should be correct");

    t.deepEqual(headers, {
      "Authorization": getAuthorization(token)
    });

    return Bacon.constant({
      items: [playlist],
      next: null
    });
  }

  function send({method, url, headers, body}) {
    switch(method) {
      case "GET":
        return getPlaylists({url, headers});
      case "POST":
        t.fail("It should not create a playlist");
      default:
        t.fail("The method should be GET or POST");
    }
  }

  getOrCreatePlaylist(send, token, userId, name).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.deepEqual(ev.value(), playlist, "The returned value should be the newly created playlist");
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.getPlaylistTracks should return the tracks of a playlist", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";
  const playlistId = "9274920";

  const trackFromN = n => ({
    track: {
      id: n,
      name: n + "-title",
      artists: [{name: n + "-artist"}],
      album: {
        name: n + "-album",
        images: [{url: n + "-image"}]
      },
      external_urls: {
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
      next: "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=50"
    },
    "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=50": {
      items: _.range(50, 100).map(trackFromN),
      next: "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=100"
    },
    "https://api.spotify.com/v1/users/294729/playlists/9274920/tracks?limit=50&offset=100": {
      items: _.range(100, 130).map(trackFromN),
      next: null
    }
  };

  function send({method, url, headers}) {
    t.equal(method, "GET", "The method should be GET");
    t.equal(typeof responses[url], "object", "The URL should be correct");
    t.deepEqual(headers, {
      "Authorization": getAuthorization(token)
    });

    return Bacon.constant(responses[url]);
  }

  getPlaylistTracks(send, token, userId, playlistId).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.deepEqual(
      ev.value(),
      _.range(0, 130).map(songFromN),
      "The value returned should be all the playlist's tracks"
    );
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.setPlaylistTracks should update the track list of the playlist", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";
  const playlistId = "2983";
  const tracks = ["1", "2", "3"];

  function send({method, url, headers, body}) {
    t.equal(method, "PUT", "The method should be PUT");
    t.equal(url, host + "/users/294729/playlists/2983/tracks", "The URL should be correct");
    t.deepEqual(headers, {
      "Authorization": getAuthorization(token),
      "Content-Type": "application/json"
    });

    t.equal(body, JSON.stringify({
      uris: ["spotify:track:1", "spotify:track:2", "spotify:track:3"]
    }), "The body should contained all the track ids");

    return Bacon.constant();
  }

  setPlaylistTracks(send, token, userId, playlistId, tracks).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.end();

    return Bacon.noMore;
  });
});

test("Spotify.sync should return a sync object", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const userId = "294729";
  const playlistId = "2983";

  const trackFromN = n => ({
    track: {
      id: n,
      name: n + "-title",
      artists: [{name: n + "-artist"}],
      album: {
        name: n + "-album",
        images: [{url: n + "-image"}]
      },
      external_urls: {
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
      items: _.range(0, 30).map(trackFromN),
      next: null
    });
  }

  function setPlaylistTracks(body) {
    t.equal(body, JSON.stringify({
      uris: ["spotify:track:1", "spotify:track:2", "spotify:track:3"]
    }), "The body should contained all the track ids");

    return Bacon.constant();
  }

  function send({method, url, headers, body}) {
    switch(method) {
      case "GET":
        t.equal(url, host + "/users/294729/playlists/2983/tracks?limit=50", "The URL should be correct");
        t.deepEqual(headers, {
          "Authorization": getAuthorization(token)
        });

        return getPlaylistTracks();
      case "PUT":
        t.equal(url, host + "/users/294729/playlists/2983/tracks");
        t.deepEqual(headers, {
          "Authorization": getAuthorization(token),
          "Content-Type": "application/json"
        });
        return setPlaylistTracks(body);
      default:
        t.fail("Invalid method: " + method);
        return Bacon.once(new Bacon.Error("Invalid Method"));
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
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.deepEqual(ev.value(), {
      p_get: _.range(0, 30).map(songFromN),
      p_set: undefined
    });

    t.end();

    return Bacon.noMore;
  });
});
