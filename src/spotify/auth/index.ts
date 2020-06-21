import Url from "url";
import QueryString from "querystring";
import { Request, RequestHandler } from "express";
import fetch from "cross-fetch";
import * as uuid from "uuid";

export type SpotifyCredentials = {
  clientId: string;
  clientSecret: string;
};

export type SpotifyConfig = SpotifyCredentials & {
  callbackPath: string;
};

export type SpotifyToken = {
  access_token: string;
  refresh_token: string | undefined;
  expires_in: number;
  token_type: string;
};

const SPOTIFY_API_TOKEN = "https://accounts.spotify.com/api/token";
const SPOTIFY_AUTHORIZE = "https://accounts.spotify.com/authorize";

const callbackUrls: { [state: string]: string } = {};

export const spotifyLogin = (config: SpotifyConfig): RequestHandler => (
  req,
  res
) => {
  const redirectUri = req.query.redirect_uri;
  const token = req.query.refresh_token;
  const scope = Array.prototype.isPrototypeOf(req.query.scope)
    ? req.query.scope
    : typeof req.query.scope === "string"
    ? [req.query.scope]
    : [];

  if (token) {
    const url = Url.parse(redirectUri);
    refreshToken(config, token).then(newToken => {
      url.search = QueryString.stringify({
        ...QueryString.parse(url.search || ""),
        ...newToken
      });
      res.redirect(Url.format(url));
    });
  } else {
    const state = uuid.v4();
    callbackUrls[state] = redirectUri;
    const callbackUrl = getCallbackUrl(req, config.callbackPath);

    const url = Url.parse(SPOTIFY_AUTHORIZE);
    url.search = QueryString.stringify({
      ...QueryString.parse(url.search || ""),
      response_type: "code",
      client_id: config.clientId,
      scope: scope.join(" "),
      redirect_uri: callbackUrl,
      state
    });

    res.redirect(Url.format(url));
  }
};

export const spotifyCallback = (config: SpotifyConfig): RequestHandler => (
  req,
  res
) => {
  const code = req.query.code || "";
  const redirect_uri = callbackUrls[req.query.state || ""];
  const callbackUrl = getCallbackUrl(req, config.callbackPath);

  createToken(config, callbackUrl, req.query.code).then(token => {
    const url = Url.parse(redirect_uri);
    url.search = QueryString.stringify({
      ...QueryString.parse(url.search || ""),
      ...token
    });
    res.redirect(Url.format(url));
  });
};

export const getCallbackUrl = (req: Request, callbackPath: string): string => {
  const protocol =
    req.headers["x-forwarded-proto"] === "https" ? "https" : req.protocol;
  return `${protocol}://${req.headers["host"]}${callbackPath}`;
};

export const createToken = (
  creds: SpotifyCredentials,
  callbackUrl: string,
  code: string
): Promise<SpotifyToken> =>
  requestToken(creds, {
    grant_type: "authorization_code",
    code,
    redirect_uri: callbackUrl
  });

export const refreshToken = (
  creds: SpotifyCredentials,
  token: string
): Promise<SpotifyToken> =>
  requestToken(creds, {
    grant_type: "refresh_token",
    refreshToken: token
  });

export const requestToken = (
  creds: SpotifyCredentials,
  body: any
): Promise<SpotifyToken> =>
  fetch(SPOTIFY_API_TOKEN, {
    headers: {
      authorization: getAuthorization(creds),
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    body: QueryString.stringify(body)
  }).then(res => res.json());

export const getAuthorization = (creds: SpotifyCredentials): string => {
  const auth = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString(
    "base64"
  );
  return `Basic ${auth}`;
};
