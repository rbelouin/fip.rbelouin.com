import test from "tape";
import Bacon from "baconjs";

import {
  watchBrowseEvents
} from "../../../src/js/controllers/event.js";

test("The Event controller should collect the necessary data to build a browse event", function(t) {
  const browserId = "c639cd8d-0673-40ad-a715-eee000ad8baf";

  const Storage = {
    items: {},
    get: function(name) {
      return Storage.items[name] || null;
    },
    set: function(name, value) {
      Storage.items[name] = value;
    }
  };

  const uuid = {
    v4: function() {
      return browserId;
    }
  };

  const intl = {
    locales: "en-US"
  };

  const w = {
    location: {
      pathname: "/path"
    },
    screen: {
      width: 1440,
      height: 900
    }
  };

  const p_route = new Bacon.Bus();

  watchBrowseEvents(Storage, uuid, intl, w, p_route)
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), [{
        type: "browse",
        browserId: browserId,
        path: "/path",
        language: "en-US",
        screen: {
          x: 1440,
          y: 900
        }
      },{
        type: "browse",
        browserId: browserId,
        path: "/path2",
        language: "en-US",
        screen: {
          x: 1440,
          y: 900
        }
      }]);

      t.equal(Storage.get("browserId"), browserId);

      t.end();

      return Bacon.noMore;
    });

  p_route.push();
  w.location.pathname = "/path2";
  p_route.push();
  p_route.end();
});
