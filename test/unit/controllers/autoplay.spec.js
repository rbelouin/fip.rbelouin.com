import Bacon from "baconjs";

import {
  getAutoplayRadio,
  setAutoplayRadio
} from "../../../src/js/controllers/autoplay.js";

test("The Autoplay controller should get the radio to autoplay from the Storage", function(done) {
  const Storage = {
    get: function(key) {
      return key === "autoplay" ? "radio-to-autoplay" : null;
    }
  };

  expect(getAutoplayRadio(Storage)).toStrictEqual("radio-to-autoplay");
  done();
});

test("The Autoplay controller should set the radio to autoplay to the Storage", function(done) {
  const Storage = {
    store: {},
    set: function(key, value) {
      this.store[key] = value;
    }
  };

  setAutoplayRadio(Storage, "radio-to-autoplay");

  expect(Storage.store).toStrictEqual({ autoplay: "radio-to-autoplay" });
  done();
});
