import _ from "lodash";
import Bacon from "baconjs";

export function get(storage, name) {
  return storage[name] ? JSON.parse(storage[name]) : null;
}

export function set(storage, name, value) {
  storage[name] = JSON.stringify(value);
}

export function sync(storage, name) {
  return {
    get: function() {
      return Bacon.constant(get(storage, name) || []);
    },
    set: function(songs) {
      return Bacon.constant(set(storage, name, songs));
    }
  };
}

export default (localStorage) => ({
  get: _.partial(get, localStorage),
  set: _.partial(set, localStorage),
  sync: _.partial(sync, localStorage)
})
