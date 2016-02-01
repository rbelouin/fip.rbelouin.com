import test from "tape";
import Bacon from "baconjs";

import {
  getCurrentRoute,
  browseTo,
  redirectRoute
} from "../../../src/js/controllers/route.js";

test("redirectRoute should perform a redirection", function(t) {
  const routes = {
    a: new Bacon.Bus(),
    b: new Bacon.Bus(),
    errors: new Bacon.Bus()
  };

  const B = {
    history: {
      pushState: function(n, m, path) {
        switch(path) {
          case "/a":
            routes.a.push();
            break;
          case "/b":
            routes.b.push();
            break;
          default:
            routes.errors.push();
            break;
        }
      }
    }
  };

  redirectRoute(B, routes, "b", "/a");
  redirectRoute(B, routes, "errors", "/b");

  const p_route = Bacon.mergeAll([
    routes.a.map("a"),
    routes.b.map("b"),
    routes.errors.map("errors")
  ]);

  p_route
    .fold([], (acc, elem) => acc.concat([elem]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), [
        "a",
        "b",
        "a",
        "errors",
        "b",
        "a"
      ]);

      t.end();

      return Bacon.noMore;
    });

  B.history.pushState(null, null, "/a");
  B.history.pushState(null, null, "/b");
  B.history.pushState(null, null, "/c");

  routes.a.end();
  routes.b.end();
  routes.errors.end();
});

test("browseTo should trigger an event in the corresponding route", function(t) {
  const routes = {
    a: new Bacon.Bus(),
    b: new Bacon.Bus(),
    errors: new Bacon.Bus()
  };

  const B = {
    history: {
      pushState: function(n, m, path) {
        switch(path) {
          case "/a":
            routes.a.push();
            break;
          case "/b":
            routes.b.push();
            break;
          default:
            routes.errors.push();
            break;
        }
      }
    }
  };

  const p_route = Bacon.mergeAll([
    routes.a.map("a"),
    routes.b.map("b"),
    routes.errors.map("errors")
  ]);

  p_route
    .fold([], (acc, elem) => acc.concat([elem]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), [
        "a",
        "b",
        "errors"
      ]);

      t.end();

      return Bacon.noMore;
    });

  browseTo(B, "/a");
  browseTo(B, "/b");
  browseTo(B, "/c");

  routes.a.end();
  routes.b.end();
  routes.errors.end();
});

test("getCurrentRoute should return a property containing the name of the current route", function(t) {
  const routes = {
    a: new Bacon.Bus(),
    b: new Bacon.Bus(),
    errors: new Bacon.Bus()
  };

  const p_route = getCurrentRoute(routes);

  p_route
    .fold([], (acc, item) => acc.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), [
        "a",
        "a",
        "b",
        "a"
      ]);

      t.end();

      return Bacon.noMore;
    });

  routes.a.push();
  routes.a.push();
  routes.b.push();
  routes.errors.push();
  routes.a.push();

  routes.a.end();
  routes.b.end();
  routes.errors.end();
});
