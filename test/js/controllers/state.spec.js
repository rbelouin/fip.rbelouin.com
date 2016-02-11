import test from "tape";
import Bacon from "baconjs";

import {
  getState
} from "../../../src/js/controllers/state.js";

import {
  getFavSongsStream,
  mergeFavsAndSongs
} from "../../../src/js/controllers/song.js";

import {
  getCurrentRoute
} from "../../../src/js/controllers/route.js";

import {
  getSongBeingPlayed, 
  getCurrentRadio,
  getBroadcastedSong,
  getSongHistory
} from "../../../src/js/controllers/play.js";

test("getState should return a valid state", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
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
    songs: [{
      id: "3",
      spotifyId: "3",
      favorite: true
    }],
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
        user: {id: "userId"},
        playlist: {id: "playlistId"},
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
    redirectRoute: function() {
    }
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

  // Build a partial EventController mock
  const EventController = {
    watchBrowseEvents: function() {
      return Bacon.never();
    }
  };

  // Build a partial UIController mock
  const UIController = {
    getLoadProperty: function() {
      return Bacon.constant(true);
    },
    getPaneStatus: function(p_loaded) {
      return Bacon.constant(true);
    },
    getPlayerPosition: function() {
      return Bacon.constant(false);
    }
  };

  const history = {
    pushState: function(){}
  };

  const eventUrl = "eventUrl";

  const favBus = new Bacon.Bus();
  const syncBus = new Bacon.Bus();
  const playBus = new Bacon.Bus();

  const state = getState(
    TokenController,
    SongController,
    RouteController,
    PlayController,
    EventController,
    UIController,
    history,
    eventUrl,
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
  const statePaneIsOpen = state.paneIsOpen.fold([], append);
  const statePlayerOnBottom = state.playerOnBottom.fold([], append);

  Bacon.combineAsArray([
    stateUser,
    stateFavSongs,
    stateRoute,
    stateRadio,
    stateBSong,
    statePSong,
    stateSrc,
    stateHistory,
    statePaneIsOpen,
    statePlayerOnBottom
  ]).subscribe(ev => {
    t.ok(ev.hasValue());

    const [user, favSongs, route, radio, bsong, psong, src, history, paneIsOpen, playerOnBottom] = ev.value();

    t.deepEqual(user, [{
      id: "userId"
    }]);

    t.deepEqual(favSongs, [[
      {id: "3", spotifyId: "3", favorite: true}
    ],[
      {id: "3", spotifyId: "3", favorite: true},
      {id: "1", spotifyId: "1", favorite: true}
    ]]);

    t.deepEqual(route, [
      "radio",
      "radio",
      "radio"
    ]);

    t.deepEqual(radio, [
      "radioA",
      "radioB",
      "radioA"
    ]);

    t.deepEqual(bsong, [{
      type: "song",
      song: {id: "1", spotifyId: "1", favorite: false}
    },{
      type: "song",
      song: {id: "2", spotifyId: "2", favorite: false}
    },{
      type: "song",
      song: {id: "3", spotifyId: "3", favorite: true}
    }]);

    t.deepEqual(psong, [{
      type: "song",
      song: {id: "1", spotifyId: "1", favorite: false}
    },{
      type: "song",
      song: {id: "2", spotifyId: "2", favorite: false}
    }]);

    t.deepEqual(src, [
      "radioB"
    ]);

    t.deepEqual(history, [[
    ],[
      {id: "1", spotifyId: "1", favorite: false}
    ],[
      {id: "1", spotifyId: "1", favorite: true}
    ]]);

    t.deepEqual(paneIsOpen, [true]);

    t.deepEqual(playerOnBottom, [false]);

    t.end();
    return Bacon.noMore;
  });

  routes.radio.push({
    params: {
      radio: "radioA"
    }
  });

  radios.radioA.push([{
    type: "song",
    song: {id: "1", spotifyId: "1"}
  }]);

  radios.radioB.push([{
    type: "song",
    song: {id: "2", spotifyId: "2"}
  }]);

  routes.radio.push({
    params: {
      radio: "radioB"
    }
  });

  playBus.push({
    type: "radio",
    radio: "radioB"
  });

  radios.radioA.push([{
    type: "song",
    song: {id: "3", spotifyId: "3"}
  },{
    type: "song",
    song: {id: "1", spotifyId: "1"}
  }]);

  routes.radio.push({
    params: {
      radio: "radioA"
    }
  });

  favBus.push({
    type: "add",
    song: {id: "1", spotifyId: "1"}
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
