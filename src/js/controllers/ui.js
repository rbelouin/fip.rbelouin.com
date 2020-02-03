import _ from "lodash";
import Bacon from "baconjs";

// true => open
// false => closed
export function getPaneStatus(win) {
  const s_click = Bacon.fromEvent(win.document.body, "click").filter(
    event =>
      event.target &&
      event.target.matches &&
      (event.target.matches("#menu-toggle") ||
        event.target.matches("#menu-toggle *"))
  );

  return s_click.doAction(".preventDefault").scan(false, acc => {
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
  }).map(".matches");
}

export default win => ({
  getPaneStatus: _.partial(getPaneStatus, win),
  getPlayerPosition
});
