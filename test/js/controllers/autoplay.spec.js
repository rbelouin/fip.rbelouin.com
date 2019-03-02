import test from "tape";
import Bacon from "baconjs";

import {
  getAutoplayRadio,
  setAutoplayRadio
} from "../../../src/js/controllers/autoplay.js";

test("The Autoplay controller should get the radio to autoplay from the Storage", function(t) {
  const Storage = {
    get: function(key) {
      return key === "autoplay" ? "radio-to-autoplay" : null;
    }
  };

  t.deepEqual(getAutoplayRadio(Storage), "radio-to-autoplay");
  t.end();
});

test("The Autoplay controller should set the radio to autoplay to the Storage", function(t) {
  const Storage = {
    store: {},
    set: function(key, value) {
      this.store[key] = value;
    }
  };

  setAutoplayRadio(Storage, "radio-to-autoplay");

  t.deepEqual(Storage.store, { autoplay: "radio-to-autoplay" });
  t.end();
});
