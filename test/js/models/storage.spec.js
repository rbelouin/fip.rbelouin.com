import test from "tape";
import Bacon from "baconjs";

import { get, set, sync } from "../../../src/js/models/storage.js";

test("Storage.get should parse and return an item from the storage", function(t) {
  const storage = {};
  const object = {
    a: "b",
    c: "d"
  };

  t.equal(get(storage, "item"), null);

  storage.item = JSON.stringify(object);

  t.deepEqual(get(storage, "item"), object);
  t.end();
});

test("Storage.set should save a stringified value to the storage", function(t) {
  const storage = {};
  const object = {
    a: "b",
    c: "d"
  };

  set(storage, "item", object);
  t.deepEqual(storage, {
    item: JSON.stringify(object)
  });

  set(storage, "item", null);
  t.deepEqual(storage, {
    item: "null"
  });

  t.end();
});

test("Storage.sync should return a sync object for the storage", function(t) {
  const storage = {};
  const s = sync(storage, "favorite");

  const p_initial = s.get();

  const p_storage = p_initial
    .flatMapLatest(() => s.set([1, 2]).map(() => storage))
    .toProperty();

  const p_final = p_storage.flatMapLatest(() => s.get()).toProperty();

  const property = Bacon.combineTemplate({
    p_initial,
    p_storage,
    p_final
  });

  property.subscribe(function(ev) {
    t.ok(ev.hasValue());
    t.deepEqual(ev.value(), {
      p_initial: [],
      p_storage: { favorite: JSON.stringify([1, 2]) },
      p_final: [1, 2]
    });

    t.end();

    return Bacon.noMore;
  });
});
