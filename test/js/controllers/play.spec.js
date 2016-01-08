import test from "tape";
import Bacon from "baconjs";

import {
  getCurrentRadio
} from "../../../src/js/controllers/play.js";

test("The Play controller should extract the radio name from the current path", function(t) {
  const s_route = Bacon.fromArray([{
    params: {
      radio: "radio1"
    }
  },{
    params: {
      radio: "radio2"
    }
  },{
    params: {
      radio: "radio2"
    }
  }]);

  getCurrentRadio(s_route)
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), ["radio1", "radio2"]);

      t.end();
      return Bacon.noMore;
    });
});
