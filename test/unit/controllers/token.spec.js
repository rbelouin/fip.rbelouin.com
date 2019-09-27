import _ from "lodash";
import Bacon from "baconjs";

import {
  getTokenFromQS,
  getTokenFromLS,
  getToken,
  setToken,
  removeTokenFromQS,
  getOrRequestToken,
  getTokenProperty
} from "../../../src/js/controllers/token.js";

test("The Token controller should be able to retrieve a token from the querysring", function(done) {
  const location1 = {
    search: ""
  };

  expect(getTokenFromQS(location1)).toStrictEqual(null);

  const location2 = {
    search:
      "?access_token=access_token&refresh_token=refresh_token&expires_in=3600&token_type=type"
  };

  expect(getTokenFromQS(location2)).toStrictEqual({
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  });

  const location3 = {
    search: "?access_token=access_token&expires_in=3600&token_type=type&a=b&c=d"
  };

  expect(getTokenFromQS(location3)).toStrictEqual({
    access_token: "access_token",
    expires_in: "3600",
    token_type: "type"
  });

  done();
});

test("The Token controller should be able to retrieve a token from the localStorage", function(done) {
  const Storage1 = {
    get: function(name) {
      expect(name).toStrictEqual("token");
      return null;
    }
  };

  expect(getTokenFromLS(Storage1)).toStrictEqual(null);

  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const Storage2 = {
    get: function(name) {
      expect(name).toStrictEqual("token");
      return token;
    }
  };

  expect(getTokenFromLS(Storage2)).toStrictEqual(token);

  done();
});

test("The Token controller should be able to retrieve a token from the localStorage if it has not already found it in the querystring", function(done) {
  const Storage1 = {
    get: function(name) {
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "3600",
        token_type: "type"
      };
    }
  };

  const location1 = {
    search: "?access_token=a&refresh_token=b&expires_in=c&token_type=d"
  };

  expect(getToken(Storage1, location1)).toStrictEqual({
    access_token: "a",
    refresh_token: "b",
    expires_in: "c",
    token_type: "d"
  });

  const Storage2 = {
    get: function(name) {
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "3600",
        token_type: "type"
      };
    }
  };

  const location2 = {
    search: "?access_token=a&expires_in=c&token_type=d"
  };

  expect(getToken(Storage2, location2)).toStrictEqual({
    access_token: "a",
    refresh_token: "refresh_token",
    expires_in: "c",
    token_type: "d"
  });

  const Storage3 = {
    get: function(name) {
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "3600",
        token_type: "type"
      };
    }
  };

  const location3 = {
    search: ""
  };

  expect(getToken(Storage3, location3)).toStrictEqual({
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  });

  const Storage4 = {
    get: function(name) {
      return null;
    }
  };

  const location4 = {
    search: ""
  };

  expect(getToken(Storage4, location4)).toStrictEqual(null);

  done();
});

test("The Token controller should be able to save a token in the localStorage", function(done) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const Storage = {
    set: function(name, value) {
      expect(name).toStrictEqual("token");
      expect(value).toStrictEqual(token);
      done();
    }
  };

  setToken(Storage, token);
});

test("The Token controller should be able to remove the query params that are related to a token", function(done) {
  const location1 = {
    pathname: "/",
    search: "?access_token=a&refresh_token=b&expires_in=3&token_type=d&e=f&g=h"
  };

  const history1 = {
    pushState: function($, $$, href) {
      expect(href).toStrictEqual("?e=f&g=h");
    }
  };

  removeTokenFromQS(location1, history1);

  const location2 = {
    pathname: "/",
    search: "?access_token=a&refresh_token=b&expires_in=3&token_type=d"
  };

  const history2 = {
    pushState: function($, $$, href) {
      expect(href).toStrictEqual("/");
      done();
    }
  };

  removeTokenFromQS(location2, history2);
});

test("The Token controller should be able to request Spotify tokens if no token is found", function(done) {
  const Storage1 = {
    token: null,
    get: function(item) {
      expect(item).toStrictEqual("token");
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "expires_in",
        token_type: "type"
      };
    },
    set: function(item, value) {
      Storage1[item] = value;
    }
  };

  const location1 = {
    pathname: "/",
    search: "?access_token=a&refresh_token=b&expires_in=c&token_type=d"
  };

  const history1 = {
    pushState: function($, $$, href) {
      expect(href).toStrictEqual("/");
    }
  };

  const Spotify1 = {
    requestToken: function() {
      throw new Error("Spotify should not be called");
    }
  };

  const token1 = getOrRequestToken(Storage1, Spotify1, location1, history1);

  expect(token1).toStrictEqual({
    access_token: "a",
    refresh_token: "b",
    expires_in: "c",
    token_type: "d"
  });

  expect(Storage1.token).toStrictEqual({
    access_token: "a",
    refresh_token: "b",
    expires_in: "c",
    token_type: "d"
  });

  const Storage2 = {
    token: null,
    get: function(item) {
      expect(item).toStrictEqual("token");
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "expires_in",
        token_type: "type"
      };
    },
    set: function(item, value) {
      Storage2[item] = value;
    }
  };

  const location2 = {
    pathname: "/",
    search: ""
  };

  const history2 = {
    pushState: function($, $$, href) {
      expect(href).toStrictEqual("/");
    }
  };

  const Spotify2 = {
    requestToken: function() {
      throw new Error("Spotify should not be called");
    }
  };

  const token2 = getOrRequestToken(Storage2, Spotify2, location2, history2);

  expect(token2).toStrictEqual({
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  });

  expect(Storage2.token).toStrictEqual({
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  });

  const Storage3 = {
    token: null,
    get: function(item) {
      expect(item).toStrictEqual("token");
      return null;
    },
    set: function(item, value) {
      Storage3[item] = value;
    }
  };

  const location3 = {
    pathname: "/",
    search: ""
  };

  const history3 = {
    pushState: function($, $$, href) {
      throw new Error("History pushState should not be called");
    }
  };

  const Spotify3 = {
    requestToken: function(scopes) {
      expect(scopes).toBeInstanceOf(Array);
      expect(_.every(scopes, scope => typeof scope === "string")).toBeTruthy();
    }
  };

  const token3 = getOrRequestToken(Storage3, Spotify3, location3, history3);

  expect(token3).toStrictEqual(null);
  expect(Storage3.token).toStrictEqual(null);

  done();
});

test("The Token controller should request a token everytime a user wants to sync his Spotify account", function(done) {
  const Storage1 = {
    token: null,
    get: function(item) {
      expect(item).toStrictEqual("token");
      return Storage1[item];
    },
    set: function(item, value) {
      Storage1[item] = value;
    }
  };

  const location1 = {
    pathname: "/",
    search: ""
  };

  const history1 = {
    pushState: function($, $$, href) {
      expect(href).toStrictEqual("/");
      location1.search = href;
    }
  };

  const Spotify1 = {
    requestToken: function(scopes) {
      expect(scopes).toBeInstanceOf(Array);
      expect(_.every(scopes, scope => typeof scope === "string")).toBeTruthy();
    }
  };

  const s_sync1 = new Bacon.Bus();

  const p_tokens1 = getTokenProperty(
    Storage1,
    Spotify1,
    location1,
    history1,
    s_sync1
  ).fold([], (items, item) => items.concat([item]));

  p_tokens1.subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual([null, null]);

    return Bacon.noMore;
  });

  s_sync1.push(true);
  s_sync1.end();

  const Storage2 = {
    token: null,
    get: function(item) {
      expect(item).toStrictEqual("token");
      return Storage2[item];
    },
    set: function(item, value) {
      Storage2[item] = value;
    }
  };

  const location2 = {
    pathname: "/",
    search: "?access_token=a&refresh_token=b&expires_in=c&token_type=d"
  };

  const history2 = {
    pushState: function($, $$, href) {
      expect(href).toStrictEqual("/");
      location2.search = href;
    }
  };

  const Spotify2 = {
    requestToken: function(scopes) {
      throw new Error("Spotify should not be called");
    }
  };

  const s_sync2 = new Bacon.Bus();

  const p_tokens2 = getTokenProperty(
    Storage2,
    Spotify2,
    location2,
    history2,
    s_sync2
  ).fold([], (items, item) => items.concat([item]));

  p_tokens2.subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual([
      {
        access_token: "a",
        refresh_token: "b",
        expires_in: "c",
        token_type: "d"
      },
      null
    ]);

    done();

    return Bacon.noMore;
  });

  s_sync2.push(false);
  s_sync2.end();
});
