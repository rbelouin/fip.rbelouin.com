import Bacon from "baconjs";

import { get, set, sync } from "../../../src/js/models/storage.js";

test("Storage.get should parse and return an item from the storage", function(done) {
  const storage = {};
  const object = {
    a: "b",
    c: "d"
  };

  expect(get(storage, "item")).toStrictEqual(null);

  storage.item = JSON.stringify(object);

  expect(get(storage, "item")).toStrictEqual(object);
  done();
});

test("Storage.set should save a stringified value to the storage", function(done) {
  const storage = {};
  const object = {
    a: "b",
    c: "d"
  };

  set(storage, "item", object);
  expect(storage).toStrictEqual({
    item: JSON.stringify(object)
  });

  set(storage, "item", null);
  expect(storage).toStrictEqual({
    item: "null"
  });

  done();
});

test("Storage.sync should return a sync object for the storage", function(done) {
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
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual({
      p_initial: [],
      p_storage: { favorite: JSON.stringify([1, 2]) },
      p_final: [1, 2]
    });

    done();

    return Bacon.noMore;
  });
});
