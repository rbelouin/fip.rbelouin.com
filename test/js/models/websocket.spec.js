import test from "tape";
import Bacon from "baconjs";

import {
  connect,
  connectForever
} from "../../../src/js/models/websocket.js";

test("WebSocket.connect should use the right URL", function(t) {
  const url = "ws://localhost:8080";

  function FakeWebSocket(_url) {
    t.equal(_url, url, "The URL should be the same");
    t.end();
  };

  connect(FakeWebSocket, url).onValue();
});

test("WebSocket.connect should forward all messages and errors", function(t) {
  const url = "ws://localhost:8080";

  function FakeWebSocket(_url) {
    this.close = function() {};

    setTimeout(function() {
      this.onmessage({
        data: JSON.stringify({
          type: "data",
          id: 1
        })
      });

      this.onmessage({
        data: JSON.stringify({
          type: "data",
          id: 2
        })
      });

      this.onmessage({
        data: JSON.stringify({
          type: "error",
          id: 3
        })
      });

      this.onmessage({
        data: JSON.stringify({
          type: "data",
          id: 4
        })
      });

      this.onerror(new Error("Connection Error"));

      this.onclose();
    }.bind(this), 50);
  }

  connect(FakeWebSocket, url)
    .map(data => ({success: data}))
    .mapError(data => ({failure: data}))
    .fold([], (acc, item) => acc.concat([item]))
    .onValue(function(items) {
      t.deepEqual(items, [{
        success: {
          type: "data",
          id: 1
        }
      },{
        success: {
          type: "data",
          id: 2
        }
      },{
        failure: {
          type: "error",
          id: 3
        }
      },{
        success: {
          type: "data",
          id: 4
        }
      },{
        failure: new Error("Connection Error")
      }]);

      t.end();
    });
});

test("WebSocket.connectForever should reconnect when the connection closes", function(t) {
  const url = "https://localhost:8080";

  function FakeWebSocket(_url) {
    this.close = function() {};

    setTimeout(function() {
      this.onmessage({
        data: JSON.stringify({
          type: "data",
          id: 1
        })
      });

      this.onerror(new Error("Connection Error"));

      this.onmessage({
        data: JSON.stringify({
          type: "error",
          id: 3
        })
      });

      this.onclose();

      this.onmessage({
        data: JSON.stringify({
          type: "data",
          id: 4
        })
      });
    }.bind(this), 50);
  }

  connectForever(FakeWebSocket, url)
    .map(data => ({success: data}))
    .mapError(data => ({failure: data}))
    .take(7)
    .fold([], (acc, item) => acc.concat([item]))
    .onValue(function(items) {
      t.deepEqual(items, [{
        success: {
          type: "data",
          id: 1
        }
      },{
        failure: new Error("Connection Error")
      },{
        failure: {
          type: "error",
          id: 3
        }
      },{
        success: {
          type: "data",
          id: 1
        }
      },{
        failure: new Error("Connection Error")
      },{
        failure: {
          type: "error",
          id: 3
        }
      },{
        success: {
          type: "data",
          id: 1
        }
      }]);

      t.end();
    });
});
