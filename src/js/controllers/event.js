import _ from "lodash";
import Bacon from "baconjs";

export function watchBrowseEvents(Storage, uuid, intl, w, p_route) {
  return p_route.map(function() {
    const browserId = Storage.get("browserId") || uuid.v4();
    Storage.set("browserId", browserId);

    return {
      type: "browse",
      browserId: browserId,
      path: w.location.pathname,
      language: intl.locales,
      screen: {
        x: w.screen.width,
        y: w.screen.height
      }
    };
  });
}

export function sendEvent(send, url, ev) {
  const req = {
    method: "POST",
    url: url,
    body: JSON.stringify(ev),
    headers: {
      "Content-Type": "application/json"
    }
  };

  const p_res = send(req);
  p_res.onError(error => console.error(error));
}

export default (Storage, Http, uuid, intl, w) => ({
  watchBrowseEvents: _.partial(watchBrowseEvents, Storage, uuid, intl, w),
  sendEvent: _.partial(sendEvent, Http.send)
})
