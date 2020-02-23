import Bacon from "baconjs";

import { getState } from "../../../src/js/controllers/state.js";

import {
  getFavSongsStream,
  mergeFavsAndSongs
} from "../../../src/js/controllers/song.js";

import { getCurrentRoute } from "../../../src/js/controllers/route.js";

import {
  getSongBeingPlayed,
  getCurrentRadio,
  getBroadcastedSong,
  getSongHistory
} from "../../../src/js/controllers/play.js";

test("getState should return a valid state", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  // Build a partial TokenController mock
  // getState only needs the getTokenProperty method
  const TokenController = {
    getTokenProperty: function(history, syncBus) {
      return Bacon.constant(token);
    }
  };

  const sync = {
    songs: [
      {
        id: "3",
        spotifyId: "3",
        favorite: true
      }
    ],
    get: function() {
      return Bacon.constant(sync.songs);
    },
    set: function(songs) {
      sync.songs = songs;
      return Bacon.constant();
    }
  };

  const radios = {
    radioA: new Bacon.Bus(),
    radioB: new Bacon.Bus()
  };

  // Build a partial SongController mock
  const SongController = {
    getSpotifyPrint: function(token) {
      return Bacon.constant({
        user: { id: "userId" },
        playlist: { id: "playlistId" },
        token: token
      });
    },
    getSyncs: function(print) {
      return [sync];
    },
    getFavSongsStream,
    mergeFavsAndSongs,
    getFipSongLists: function() {
      return radios;
    },
    setFavoriteSongs: function() {
      return Bacon.never();
    }
  };

  const routes = {
    radio: new Bacon.Bus(),
    home: new Bacon.Bus(),
    errors: new Bacon.Bus()
  };

  // Build a partial RouteController mock
  const RouteController = {
    getRoutes: function() {
      return routes;
    },
    getCurrentRoute,
    redirectRoute: function() {}
  };

  // Build a partial PlayController mock
  const PlayController = {
    getSongBeingPlayed,
    getCurrentRadio,
    getBroadcastedSong,
    getSongHistory,
    getCurrentSource: function(playBus) {
      return playBus.map(cmd => {
        return cmd.type === "radio" && radios[cmd.radio] ? cmd.radio : null;
      });
    }
  };

  const history = {
    pushState: function() {}
  };

  const favBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();
  const playBus = new Bacon.Bus();

  const state = getState(
    TokenController,
    SongController,
    RouteController,
    PlayController,
    history,
    favBus,
    syncBus,
    playBus
  );

  const append = (acc, elem) => acc.concat([elem]);

  const stateUser = state.user.fold([], append);
  const stateFavSongs = state.favSongs.fold([], append);
  const stateRoute = state.route.fold([], append);
  const stateRadio = state.radio.fold([], append);
  const stateBSong = state.bsong.fold([], append);
  const statePSong = state.psong.fold([], append);
  const stateSrc = state.src.fold([], append);
  const stateHistory = state.history.fold([], append);

  Bacon.combineAsArray([
    stateUser,
    stateFavSongs,
    stateRoute,
    stateRadio,
    stateBSong,
    statePSong,
    stateSrc,
    stateHistory
  ]).subscribe(ev => {
    expect(ev.hasValue()).toBeTruthy();

    const [
      user,
      favSongs,
      route,
      radio,
      bsong,
      psong,
      src,
      history
    ] = ev.value();

    expect(user).toStrictEqual([
      {
        id: "userId"
      }
    ]);

    expect(favSongs).toStrictEqual([
      [{ id: "3", spotifyId: "3", favorite: true }],
      [
        { id: "3", spotifyId: "3", favorite: true },
        { id: "1", spotifyId: "1", favorite: true }
      ]
    ]);

    expect(route).toStrictEqual(["radio", "radio", "radio"]);

    expect(radio).toStrictEqual(["radioA", "radioB", "radioA"]);

    expect(bsong).toStrictEqual([
      {
        type: "song",
        song: { id: "1", spotifyId: "1", favorite: false }
      },
      {
        type: "song",
        song: { id: "2", spotifyId: "2", favorite: false }
      },
      {
        type: "song",
        song: { id: "3", spotifyId: "3", favorite: true }
      }
    ]);

    expect(psong).toStrictEqual([
      {
        type: "song",
        song: { id: "1", spotifyId: "1", favorite: false }
      },
      {
        type: "song",
        song: { id: "2", spotifyId: "2", favorite: false }
      }
    ]);

    expect(src).toStrictEqual(["radioB"]);

    expect(history).toStrictEqual([
      [],
      [{ id: "1", spotifyId: "1", favorite: false }],
      [{ id: "1", spotifyId: "1", favorite: true }]
    ]);

    done();
    return Bacon.noMore;
  });

  routes.radio.push({
    params: {
      radio: "radioA"
    }
  });

  radios.radioA.push([
    {
      type: "song",
      song: { id: "1", spotifyId: "1" }
    }
  ]);

  radios.radioB.push([
    {
      type: "song",
      song: { id: "2", spotifyId: "2" }
    }
  ]);

  routes.radio.push({
    params: {
      radio: "radioB"
    }
  });

  playBus.push({
    type: "radio",
    radio: "radioB"
  });

  radios.radioA.push([
    {
      type: "song",
      song: { id: "3", spotifyId: "3" }
    },
    {
      type: "song",
      song: { id: "1", spotifyId: "1" }
    }
  ]);

  routes.radio.push({
    params: {
      radio: "radioA"
    }
  });

  favBus.push({
    type: "add",
    song: { id: "1", spotifyId: "1" }
  });

  radios.radioA.end();
  radios.radioB.end();

  routes.radio.end();
  routes.home.end();
  routes.errors.end();

  favBus.end();
  syncBus.end();
  playBus.end();
});
