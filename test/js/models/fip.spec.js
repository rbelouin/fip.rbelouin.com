import test from "tape";
import Bacon from "baconjs";

import {
  fetchFipSongs,
  fetchFipRadios
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

test("Fip.fetchFipRadios should return data for each radio", function(t) {
  const url = "ws://localhost/";

  function connectForever(_url) {
    t.equal(_url, url, "URL should be OK");

    return Bacon.fromArray([{
      "radio1": {
        "type": "song",
        "song": {
          "id": "song1-1",
          "startTime": 100
        }
      },
      "radio2": {
        "type": "song",
        "song": {
          "id": "song2-1",
          "startTime": 110
        }
      },
      "radio3": {
        "type": "song",
        "song": {
          "id": "song3-1",
          "startTime": 120
        }
      }
    }, {
      "radio1": {
        "type": "song",
        "song": {
          "id": "song1-1",
          "startTime": 100
        }
      },
      "radio2": {
        "type": "song",
        "song": {
          "id": "song2-1",
          "startTime": 110
        }
      },
      "radio3": {
        "type": "song",
        "song": {
          "id": "song3-1",
          "startTime": 120
        }
      }
    },{
      "radio1": {
        "type": "song",
        "song": {
          "id": "song1-2",
          "startTime": 200
        }
      },
      "radio2": {
        "type": "song",
        "song": {
          "id": "song2-1",
          "startTime": 110
        }
      },
      "radio3": {
        "type": "song",
        "song": {
          "id": "song3-1",
          "startTime": 120
        }
      }
    },{
      "radio1": {
        "type": "song",
        "song": {
          "id": "song1-3",
          "startTime": 300
        }
      },
      "radio2": {
        "type": "song",
        "song": {
          "id": "song2-1",
          "startTime": 110
        }
      },
      "radio3": {
        "type": "song",
        "song": {
          "id": "song3-1",
          "startTime": 120
        }
      }
    },{
      "radio1": {
        "type": "song",
        "song": {
          "id": "song1-3",
          "startTime": 300
        }
      },
      "radio2": {
        "type": "song",
        "song": {
          "id": "song2-2",
          "startTime": 310
        }
      },
      "radio3": {
        "type": "song",
        "song": {
          "id": "song3-1",
          "startTime": 120
        }
      }
    },{
      "radio1": {
        "type": "song",
        "song": {
          "id": "song1-3",
          "startTime": 300
        }
      },
      "radio2": {
        "type": "song",
        "song": {
          "id": "song2-2",
          "startTime": 310
        }
      },
      "radio3": {
        "type": "song",
        "song": {
          "id": "song3-2",
          "startTime": 320
        }
      }
    }]).delay(50);
  }

  const data = fetchFipRadios(connectForever, url, [
    "radio1",
    "radio2",
    "radio4"
  ]);

  t.ok(Bacon.EventStream.prototype.isPrototypeOf(data.radio1));
  t.ok(Bacon.EventStream.prototype.isPrototypeOf(data.radio2));
  t.ok(Bacon.EventStream.prototype.isPrototypeOf(data.radio4));

  t.notOk(Bacon.EventStream.prototype.isPrototypeOf(data.radio3));

  const p_radio1 = data.radio1
    .fold([], (items, item) => items.concat([item]));

  const p_radio2 = data.radio2
    .fold([], (items, item) => items.concat([item]));

  const p_radio4 = data.radio4
    .skipErrors()
    .fold([], (items, item) => items.concat([item]));

  Bacon.zipAsArray([p_radio1, p_radio2, p_radio4])
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      const [radio1, radio2, radio4] = ev.value();

      t.deepEqual(radio1, [{
        "type": "song",
        "song": {
          "id": "song1-1",
          "startTime": 100
        }
      },{
        "type": "song",
        "song": {
          "id": "song1-2",
          "startTime": 200
        }
      },{
        "type": "song",
        "song": {
          "id": "song1-3",
          "startTime": 300
        }
      }]);

      t.deepEqual(radio2, [{
        "type": "song",
        "song": {
          "id": "song2-1",
          "startTime": 110
        }
      },{
        "type": "song",
        "song": {
          "id": "song2-2",
          "startTime": 310
        }
      }]);

      t.deepEqual(radio4, []);

      t.end();

      return Bacon.noMore;
    });
});
