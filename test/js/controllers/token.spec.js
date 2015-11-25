import test from "tape";
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

test("The Token controller should be able to retrieve a token from the querysring", function(t) {
  const location1 = {
    search: ""
  };

  t.deepEqual(getTokenFromQS(location1), null);

  const location2 = {
    search: "?access_token=access_token&refresh_token=refresh_token&expires_in=3600&token_type=type"
  };

  t.deepEqual(getTokenFromQS(location2), {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  });

  const location3 = {
    search: "?access_token=access_token&expires_in=3600&token_type=type&a=b&c=d"
  };

  t.deepEqual(getTokenFromQS(location3), {
    access_token: "access_token",
    expires_in: "3600",
    token_type: "type"
  });

  t.end();
});

test("The Token controller should be able to retrieve a token from the localStorage", function(t) {
  const Storage1 = {
    get: function(name) {
      t.equal(name, "token");
      return null;
    }
  };

  t.deepEqual(getTokenFromLS(Storage1), null);

  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const Storage2 = {
    get: function(name) {
      t.equal(name, "token");
      return token;
    }
  };

  t.deepEqual(getTokenFromLS(Storage2), token);

  t.end();
});

test("The Token controller should be able to retrieve a token from the localStorage if it has not already found it in the querystring", function(t) {
  const Storage1 = {
    get: function(name) {
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "3600",
        token_type: "type"
      };
    }
  };

  const location1 = {
    search: "?access_token=a&refresh_token=b&expires_in=c&token_type=d"
  };

  t.deepEqual(getToken(Storage1, location1), {
    access_token: "a",
    refresh_token: "b",
    expires_in: "c",
    token_type: "d"
  });

  const Storage2 = {
    get: function(name) {
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "3600",
        token_type: "type"
      };
    }
  };

  const location2 = {
    search: "?access_token=a&expires_in=c&token_type=d"
  };

  t.deepEqual(getToken(Storage2, location2), {
    access_token: "a",
    refresh_token: "refresh_token",
    expires_in: "c",
    token_type: "d"
  });

  const Storage3 = {
    get: function(name) {
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "3600",
        token_type: "type"
      };
    }
  };

  const location3 = {
    search: ""
  };

  t.deepEqual(getToken(Storage3, location3), {
    access_token: "access_token",
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

  t.deepEqual(getToken(Storage4, location4), null);

  t.end();
});

test("The Token controller should be able to save a token in the localStorage", function(t) {
  const token = {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "3600",
    token_type: "type"
  };

  const Storage = {
    set: function(name, value) {
      t.equal(name, "token");
      t.deepEqual(value, token);
      t.end();
    }
  };

  setToken(Storage, token);
});

test("The Token controller should be able to remove the query params that are related to a token", function(t) {
  const location1 = {
    search: "?access_token=a&refresh_token=b&expires_in=3&token_type=d&e=f&g=h"
  };

  const history1 = {
    pushState: function($, $$, href) {
      t.equal(href, "?e=f&g=h");
    }
  };

  removeTokenFromQS(location1, history1);

  const location2 = {
    search: "?access_token=a&refresh_token=b&expires_in=3&token_type=d"
  };

  const history2 = {
    pushState: function($, $$, href) {
      t.equal(href, "");
      t.end();
    }
  };

  removeTokenFromQS(location2, history2);
});

test("The Token controller should be able to request Spotify tokens if no token is found", function(t) {
  const Storage1 = {
    token: null,
    get: function(item) {
      t.equal(item, "token");
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "expires_in",
        token_type: "type"
      };
    },
    set: function(item, value) {
      Storage1[item] = value;
    }
  };

  const location1 = {
    search: "?access_token=a&refresh_token=b&expires_in=c&token_type=d"
  };

  const history1 = {
    pushState: function($, $$, href) {
      t.equal(href, "");
    }
  };

  const Spotify1 = {
    requestToken: function() {
      t.fail("Spotify should not be called");
    }
  };

  const token1 = getOrRequestToken(Storage1, Spotify1, location1, history1);

  t.deepEqual(token1, {
    access_token: "a",
    refresh_token: "b",
    expires_in: "c",
    token_type: "d"
  });

  t.deepEqual(Storage1.token, {
    access_token: "a",
    refresh_token: "b",
    expires_in: "c",
    token_type: "d"
  });

  const Storage2 = {
    token: null,
    get: function(item) {
      t.equal(item, "token");
      return {
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: "expires_in",
        token_type: "type"
      };
    },
    set: function(item, value) {
      Storage2[item] = value;
    }
  };

  const location2 = {
    search: ""
  };

  const history2 = {
    pushState: function($, $$, href) {
      t.equal(href, "");
    }
  };

  const Spotify2 = {
    requestToken: function() {
      t.fail("Spotify should not be called");
    }
  };

  const token2 = getOrRequestToken(Storage2, Spotify2, location2, history2);

  t.deepEqual(token2, {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  });

  t.deepEqual(Storage2.token, {
    access_token: "access_token",
    refresh_token: "refresh_token",
    expires_in: "expires_in",
    token_type: "type"
  });

  const Storage3 = {
    token: null,
    get: function(item) {
      t.equal(item, "token");
      return null;
    },
    set: function(item, value) {
      Storage3[item] = value;
    }
  };

  const location3 = {
    search: ""
  };

  const history3 = {
    pushState: function($, $$, href) {
      t.fail("History pushState should not be called");
    }
  };

  const Spotify3 = {
    requestToken: function(scopes) {
      t.ok(Array.prototype.isPrototypeOf(scopes));
      t.ok(_.all(scopes, scope => typeof scope === "string"));
    }
  };

  const token3 = getOrRequestToken(Storage3, Spotify3, location3, history3);

  t.deepEqual(token3, null);
  t.deepEqual(Storage3.token, null);

  t.end();
});

test("The Token controller should request a token everytime a user wants to sync his Spotify account", function(t) {
  const Storage1 = {
    token: null,
    get: function(item) {
      t.equal(item, "token");
      return Storage[item];
    },
    set: function(item, value) {
      Storage[item] = value;
    }
  };

  const location1 = {
    search: ""
  };

  const history1 = {
    pushState: function($, $$, href) {
      t.equal(href, "");
      location1.search = href;
    }
  };

  const Spotify1 = {
    requestToken: function(scopes) {
      t.ok(Array.prototype.isPrototypeOf(scopes));
      t.ok(_.all(scopes, scope => typeof scope === "string"));
    }
  };

  const s_sync1 = new Bacon.Bus();

  const p_tokens1 = getTokenProperty(Storage1, Spotify1, location1, history1, s_sync1).fold([], (items, item) => items.concat([item]));

  p_tokens1.subscribe(function(ev) {
    t.ok(ev.hasValue());
    t.deepEqual(ev.value(), [null, null]);

    return Bacon.noMore;
  });

  s_sync1.push(true);
  s_sync1.end();

  const Storage2 = {
    token: null,
    get: function(item) {
      t.equal(item, "token");
      return Storage[item];
    },
    set: function(item, value) {
      Storage[item] = value;
    }
  };

  const location2 = {
    search: "?access_token=a&refresh_token=b&expires_in=c&token_type=d"
  };

  const history2 = {
    pushState: function($, $$, href) {
      t.equal(href, "");
      location2.search = href;
    }
  };

  const Spotify2 = {
    requestToken: function(scopes) {
      t.fail("Spotify should not be called");
    }
  };

  const s_sync2 = new Bacon.Bus();

  const p_tokens2 = getTokenProperty(Storage2, Spotify2, location2, history2, s_sync2).fold([], (items, item) => items.concat([item]));

  p_tokens2.subscribe(function(ev) {
    t.ok(ev.hasValue());
    t.deepEqual(ev.value(), [{
      access_token: "a",
      refresh_token: "b",
      expires_in: "c",
      token_type: "d"
    }, null]);

    t.end();

    return Bacon.noMore;
  });

  s_sync2.push(false);
  s_sync2.end();
});
