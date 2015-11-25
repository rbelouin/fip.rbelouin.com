import test from "tape";
import Bacon from "baconjs";

import {
  parseResponse,
  send
} from "../../../src/js/models/http.js";

test("Http.parseResponse should parse a JSON response", function(t) {
  const body = {a: 1, b: 2};
  const res = {
    ok: true,
    headers: new Map()
      .set("Content-Type", "application/json; charset=utf-8"),
    json: function() {
      return Promise.resolve(body);
    }
  };

  parseResponse(res).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.equal(ev.value(), body, "The returned value should be the parsed body");
    t.end();

    return Bacon.noMore;
  });
});

test("Http.parseResponse should not parse response that does not have any content type", function(t) {
  const body = {a: 1, b: 2};
  const res = {
    ok: true,
    headers: new Map(),
    json: function() {
      return Promise.resolve(body);
    }
  };

  parseResponse(res).subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.equal(ev.value(), res, "The returned value should be the response");
    t.end();

    return Bacon.noMore;
  });
});

test("Http.parseResponse should return the response when it fails parsing the body", function(t) {
  const body = {a: 1, b: 2};
  const res = {
    ok: false,
    headers: new Map()
      .set("Content-Type", "application/json; charset=utf-8"),
    json: function() {
      return Promise.resolve(body);
    }
  };

  parseResponse(res).subscribe(function(ev) {
    t.ok(ev.isError(), "The event should be an error");
    t.equal(ev.error, res, "The returned error should be the response");
    t.end();

    return Bacon.noMore;
  });
});

test("Http.send should return a property containing the response body", function(t) {
  const reqUrl = "/api/songs/current";
  const reqMethod = "GET";
  const reqHeaders = { "Content-Type": "application/json" };
  const reqBody = JSON.stringify({c: 42});
  const resBody = {a: 1, b: 2};

  function fetch(url, {method, headers, body}) {
    t.equal(url, reqUrl, "The URL should be the same");
    t.equal(method, reqMethod, "The method should be the same");
    t.deepEqual(headers, reqHeaders, "The headers should be the same");
    t.equal(body, reqBody, "The body should be the same");

    return Promise.resolve({
      ok: true,
      headers: new Map()
        .set("Content-Type", "application/json; charset=utf-8"),
      json: function() {
        return Promise.resolve(resBody);
      }
    });
  }

  const p_res = send(fetch, {
    url: reqUrl,
    method: reqMethod,
    headers: reqHeaders,
    body: reqBody
  });

  t.ok(Bacon.Property.prototype.isPrototypeOf(p_res), "p_res should be a Bacon.Property");

  p_res.subscribe(function(ev) {
    t.ok(ev.hasValue(), "The event should not be an error nor an end");
    t.equal(ev.value(), resBody, "The event value should be the parsed body");
    t.end();

    return Bacon.noMore;
  });
});

test("Http.send should return the response when the request fails", function(t) {
  const reqUrl = "/api/songs/current";
  const reqMethod = "GET";
  const reqHeaders = { "Content-Type": "application/json" };
  const reqBody = JSON.stringify({c: 42});
  const error = new TypeError("NetworkError when attempting to fetch resource.");

  function fetch(url, {method, headers, body}) {
    t.equal(url, reqUrl, "The URL should be the same");
    t.equal(method, reqMethod, "The method should be the same");
    t.deepEqual(headers, reqHeaders, "The headers should be the same");
    t.equal(body, reqBody, "The body should be the same");

    return Promise.reject(error);
  }

  const p_res = send(fetch, {
    url: reqUrl,
    method: reqMethod,
    headers: reqHeaders,
    body: reqBody
  });

  t.ok(Bacon.Property.prototype.isPrototypeOf(p_res), "p_res should be a Bacon.Property");

  p_res.subscribe(function(ev) {
    t.ok(ev.isError(), "The event should be an error");
    t.equal(ev.error, error, "The event error should be the thrown error");
    t.end();

    return Bacon.noMore;
  });
});

test("Http.send should accept a headers Map()", function(t) {
  function fetch(url, {method, headers, body}) {
    t.notOk(Map.prototype.isPrototypeOf(headers), "Headers should not be a Map()");
    t.end();
  }

  send(fetch, {
    method: "POST",
    url: "/api/songs",
    headers: new Map()
      .set("Content-Type", "application/json"),
    body: JSON.stringify({
      plop: "blah"
    })
  });
});
