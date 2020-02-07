import qs from "querystring";

export type SpotifyToken = {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  token_type: string;
};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: (() => void) | undefined;
  }
}
declare const Spotify: { Player: any } | undefined;
type SpotifyPlayer = NonNullable<typeof Spotify>["Player"];
let playerInstance: SpotifyPlayer | undefined;

export const host = "https://api.spotify.com/v1";

export function requestToken(redirect_uri: string, scope: string[]): void {
  location.href = "/api/login?" + qs.stringify({ redirect_uri, scope });
}

export function refreshToken(redirect_uri: string, token: SpotifyToken): void {
  location.href =
    "/api/login?" +
    qs.stringify({ redirect_uri, refresh_token: token.refresh_token });
}

export function getOAuthToken(): SpotifyToken | undefined {
  const {
    access_token,
    refresh_token,
    expires_in,
    token_type,
    ...rest
  } = qs.parse(window.location.search.slice(1));
  const token = { access_token, refresh_token, expires_in, token_type };

  if (isSpotifyToken(token)) {
    const newQuery = qs.stringify(rest);
    window.history.pushState(null, "", `${window.location.pathname}?${rest}`);
    localStorage.setItem("token", JSON.stringify(token));
    return token;
  } else {
    const localToken = localStorage.getItem("token");
    return localToken ? JSON.parse(localToken) : undefined;
  }
}

export function play(songId: string): void {
  if (!playerInstance) {
    return;
  }

  const {
    _options: { getOAuthToken, id }
  } = playerInstance;

  getOAuthToken((token: string) => {
    fetch(`${host}/me/player/play?device_id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [`spotify:track:${songId}`] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
  });
}

export function getPlayer(): SpotifyPlayer | undefined {
  return playerInstance;
}

function isSpotifyToken(token: {
  access_token: any;
  refresh_token: any;
  expires_in: any;
  token_type: any;
}): token is SpotifyToken {
  return Object.keys(token).every(
    (key: string) => typeof token[key as keyof typeof token] === "string"
  );
}

export function initializePlayer() {
  window.onSpotifyWebPlaybackSDKReady = () => {
    if (typeof Spotify === "undefined") {
      return;
    }

    const scopes = [
      "playlist-modify-private",
      "playlist-read-private",
      "streaming",
      "user-library-read",
      "user-read-email",
      "user-read-private"
    ];

    const player = new Spotify.Player({
      name: "FIP Player",
      getOAuthToken: (callback: any) => {
        const token = getOAuthToken();
        if (token) {
          callback(token.access_token);
        } else {
          requestToken(window.location.href, scopes);
        }
      }
    });

    player.addListener("authentication_error", () => {
      console.log("megaplop");
      const token = getOAuthToken();
      if (token) {
        refreshToken(window.location.href, token);
      } else {
        requestToken(window.location.href, scopes);
      }
    });

    player &&
      getOAuthToken() &&
      player.connect().then((success: boolean) => {
        if (success) {
          playerInstance = player;
        }
      });
  };
}
