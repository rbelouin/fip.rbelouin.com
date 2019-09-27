import Bacon from "baconjs";

import { parseResponse, send } from "../../../src/js/models/http.js";

test("Http.parseResponse should parse a JSON response", function(done) {
  const body = { a: 1, b: 2 };
  const res = {
    ok: true,
    headers: new Map().set("Content-Type", "application/json; charset=utf-8"),
    json: function() {
      return Promise.resolve(body);
    }
  };

  parseResponse(res).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(body);
    done();

    return Bacon.noMore;
  });
});

test("Http.parseResponse should not parse response that does not have any content type", function(done) {
  const body = { a: 1, b: 2 };
  const res = {
    ok: true,
    headers: new Map(),
    json: function() {
      return Promise.resolve(body);
    }
  };

  parseResponse(res).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(res);
    done();

    return Bacon.noMore;
  });
});

test("Http.parseResponse should return the response when it fails parsing the body", function(done) {
  const body = { a: 1, b: 2 };
  const res = {
    ok: false,
    headers: new Map().set("Content-Type", "application/json; charset=utf-8"),
    json: function() {
      return Promise.resolve(body);
    }
  };

  parseResponse(res).subscribe(function(ev) {
    expect(ev.isError()).toBeTruthy();
    expect(ev.error).toStrictEqual(res);
    done();

    return Bacon.noMore;
  });
});

test("Http.send should return a property containing the response body", function(done) {
  const reqUrl = "/api/songs/current";
  const reqMethod = "GET";
  const reqHeaders = { "Content-Type": "application/json" };
  const reqBody = JSON.stringify({ c: 42 });
  const resBody = { a: 1, b: 2 };

  function fetch(url, { method, headers, body }) {
    expect(url).toStrictEqual(reqUrl);
    expect(method).toStrictEqual(reqMethod);
    expect(headers).toStrictEqual(reqHeaders);
    expect(body).toStrictEqual(reqBody);

    return Promise.resolve({
      ok: true,
      headers: new Map().set("Content-Type", "application/json; charset=utf-8"),
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

  expect(p_res).toBeInstanceOf(Bacon.Property);

  p_res.subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();
    expect(ev.value()).toStrictEqual(resBody);
    done();

    return Bacon.noMore;
  });
});

test("Http.send should return the response when the request fails", function(done) {
  const reqUrl = "/api/songs/current";
  const reqMethod = "GET";
  const reqHeaders = { "Content-Type": "application/json" };
  const reqBody = JSON.stringify({ c: 42 });
  const error = new TypeError(
    "NetworkError when attempting to fetch resource."
  );

  function fetch(url, { method, headers, body }) {
    expect(url).toStrictEqual(reqUrl);
    expect(method).toStrictEqual(reqMethod);
    expect(headers).toStrictEqual(reqHeaders);
    expect(body).toStrictEqual(reqBody);

    return Promise.reject(error);
  }

  const p_res = send(fetch, {
    url: reqUrl,
    method: reqMethod,
    headers: reqHeaders,
    body: reqBody
  });

  expect(p_res).toBeInstanceOf(Bacon.Property);

  p_res.subscribe(function(ev) {
    expect(ev.isError()).toBeTruthy();
    expect(ev.error).toStrictEqual(error);
    done();

    return Bacon.noMore;
  });
});

test("Http.send should accept a headers Map()", function(done) {
  function fetch(url, { method, headers, body }) {
    expect(headers).not.toBeInstanceOf(Map);
    done();
  }

  send(fetch, {
    method: "POST",
    url: "/api/songs",
    headers: new Map().set("Content-Type", "application/json"),
    body: JSON.stringify({
      plop: "blah"
    })
  });
});
