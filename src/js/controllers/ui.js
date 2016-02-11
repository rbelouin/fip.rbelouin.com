import _ from "lodash";
import Bacon from "baconjs";

export function getLoadEvent(win) {
  return Bacon.fromEvent(win, "load");
}

export function getLoadProperty(win) {
  return getLoadEvent(win).map(true).toProperty(false);
}

// true => open
// false => closed
export function getPaneStatus(p_loaded) {
  const s_load = p_loaded.toEventStream()
    .skipWhile(loaded => !loaded)
    .first();

  const s_click = s_load.flatMapLatest(() => {
    return Bacon.fromEvent(
      win.document.querySelector(".navbar .navbar-brand a"),
      "click"
    );
  });

  return s_click.doAction(".preventDefault").scan(false, (acc, elem) => {
    return !acc;
  });
}

// true => bottom
// false => default
export function getPlayerPosition() {
  return Bacon.fromBinder(sink => {
    const mediaQuery = matchMedia("(max-width: 991px)");

    mediaQuery.addListener(sink);
    sink(mediaQuery);

    return () => mediaQuery.removeListener(sink);
  })
  .map(".matches");
}

export default (win) => ({
  getLoadEvent: _.partial(getLoadEvent, win),
  getLoadProperty: _.partial(getLoadProperty, win),
  getPaneStatus,
  getPlayerPosition
})
