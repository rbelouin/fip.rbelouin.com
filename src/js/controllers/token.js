import _ from "lodash";
import qs from "querystring";

export function getTokenFromQS(location) {
  const params = qs.parse(location.search.slice(1));

  const keys = [
    "access_token",
    "refresh_token",
    "expires_in",
    "token_type"
  ];

  const token = _.reduce(keys, (acc, key) => {
    if(params[key]) {
      acc[key] = params[key];
    }

    return acc;
  }, {});

  return _.isEmpty(token) ? null : token;
}

export function getTokenFromLS(Storage) {
  return Storage.get("token");
}

export function getToken(Storage, location) {
  const tokenQS = getTokenFromQS(location);
  const tokenLS = getTokenFromLS(Storage);

  const token = _.extend({}, tokenLS, tokenQS);

  return _.isEmpty(token) ? null : token;
}

export function setToken(Storage, token) {
  Storage.set("token", token);
}

export function removeTokenFromQS(location, history) {
  const params = _.omit(qs.parse(location.search.slice(1)), [
    "access_token",
    "refresh_token",
    "expires_in",
    "token_type"
  ]);

  const pathname = location.pathname;
  const href = _.isEmpty(params) ? pathname : "?" + qs.stringify(params);

  history.pushState(null, null, href);
}

export function getOrRequestToken(Storage, Spotify, location, history) {
  const token = getToken(Storage, location);

  if(token) {
    removeTokenFromQS(location, history);
    setToken(Storage, token);
    return token;
  }
  else {
    Spotify.requestToken([
      "user-library-read",
      "playlist-read-private",
      "playlist-modify-private"
    ]);
    return null;
  }
}

export function getTokenProperty(Storage, Spotify, location, history, s_sync) {
  const token = getToken(Storage, location);
  removeTokenFromQS(location, history);
  setToken(Storage, token);

  return s_sync.map(function(sync) {
    if(sync) {
      return getOrRequestToken(Storage, Spotify, location, history);
    }
    else {
      setToken(Storage, null);
      return null;
    }
  }).toProperty(token);
}

export default (Storage, Spotify, location) => ({
  getTokenFromQS: _.partial(getTokenFromQS, location),
  getTokenFromLS: _.partial(getTokenFromLS, Storage),
  getToken: _.partial(getToken, Storage, location),
  setToken: _.partial(setToken, Storage),
  removeTokenFromQS: _.partial(removeTokenFromQS, location),
  getOrRequestToken: _.partial(
    getOrRequestToken,
    Storage,
    Spotify,
    location
  ),
  getTokenProperty: _.partial(
    getTokenProperty,
    Storage,
    Spotify,
    location
  )
});
