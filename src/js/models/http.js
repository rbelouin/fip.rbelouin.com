import _ from "lodash";
import Bacon from "baconjs";

export function parseResponse(res) {
  const contentType = res.headers.get("Content-Type");
  const mimeType = contentType && contentType.split(";")[0];
  const isJson = mimeType === "application/json";

  return res.ok && isJson
    ? Bacon.fromPromise(res.json())
    : res.ok
    ? Bacon.once(res)
    : Bacon.once(new Bacon.Error(res));
}

export function send(fetch, { url, method, headers, body }) {
  const s_res = Bacon.fromPromise(
    fetch(url, {
      method,
      // We trust that Map.prototype is defined.
      // eslint-disable-next-line no-prototype-builtins
      headers: Map.prototype.isPrototypeOf(headers)
        ? _.zipObject(Array.from(headers.entries()))
        : headers || {},
      body
    })
  );

  const s_body = s_res.flatMapLatest(parseResponse);

  return s_body.toProperty();
}

export default fetch => ({
  parseResponse,
  send: _.partial(send, fetch)
});
