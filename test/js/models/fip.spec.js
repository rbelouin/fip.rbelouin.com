import test from "tape";
import Bacon from "baconjs";

import {
  fetchFipSongs
} from "../../../src/js/models/fip.js";

test("Fip.fetchFipSongs should return played songs", function(t) {
  const url = "ws://localhost/";

  function connectForever(_url) {
    t.equal(_url, url, "URL should be OK");

    return Bacon.fromArray([{
      type: "song",
      song: {
        id: "song1",
        startTime: 1
      }
    },{
      type: "song",
      song: {
        id: "song2",
        startTime: 2
      }
    },{
      type: "song",
      song: {
        id: "song1",
        startTime: 1
      }
    },{
      type: "song",
      song: {
        id: "song2",
        startTime: 2
      }
    },{
      type: "song",
      song: {
        id: "song3",
        startTime: 3
      }
    },{
      type: "song",
      song: {
        id: "song3",
        startTime: 3
      }
    }]);
  }

  const p_songs = fetchFipSongs(connectForever, url);

  t.ok(Bacon.Property.prototype.isPrototypeOf(p_songs));

  p_songs
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());
      t.deepEqual(ev.value(), [{
        id: "song1",
        startTime: 1
      },{
        id: "song2",
        startTime: 2
      },{
        id: "song3",
        startTime: 3
      }]);

      t.end();

      return Bacon.noMore;
    });
});
