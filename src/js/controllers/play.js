import _ from "lodash";
import Bacon from "baconjs";

export function getCurrentRadio(s_route) {
  return s_route.map(".params.radio").skipDuplicates();
}

export default (s_route) => ({
  getCurrentRadio: _.partial(getCurrentRadio, s_route)
})
