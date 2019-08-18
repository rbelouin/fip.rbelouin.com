import test from "tape";
import Bacon from "baconjs";

import { connect, connectForever } from "../../../src/js/models/websocket.js";

test("WebSocket.connect should use the right URL", function(t) {
  const path = "/api/ws";
  const location = {
    protocol: "https:",
    host: "localhost:8080"
  };

  function FakeWebSocket(_url) {
    t.equal(_url, "wss://localhost:8080/api/ws", "The URL should be the same");
    t.end();
  }

  connect(
    FakeWebSocket,
    location,
    path
  ).onValue();
});

test("WebSocket.connect should forward all messages and errors", function(t) {
  const path = "/api/ws";
  const location = {
    protocol: "https:",
    host: "localhost:8080"
  };

  function FakeWebSocket(_url) {
    this.close = function() {};

    setTimeout(
      function() {
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
            type: "error",
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
      }.bind(this),
      50
    );
  }

  connect(
    FakeWebSocket,
    location,
    path
  )
    .map(data => ({ success: data }))
    .mapError(data => ({ failure: data }))
    .fold([], (acc, item) => acc.concat([item]))
    .onValue(function(items) {
      t.deepEqual(items, [
        {
          success: {
            type: "data",
            id: 1
          }
        },
        {
          success: {
            type: "data",
            id: 2
          }
        },
        {
          failure: {
            type: "error",
            id: 3
          }
        },
        {
          success: {
            type: "data",
            id: 4
          }
        }
      ]);

      t.end();
    });
});

test("WebSocket.connectForever should reconnect when the connection closes", function(t) {
  const path = "/api/ws";
  const location = {
    protocol: "https:",
    host: "localhost:8080"
  };
  let index = 0;

  function FakeWebSocket(_url) {
    this.close = function() {};

    setTimeout(
      function() {
        switch (index) {
          case 0:
            this.onmessage({
              data: JSON.stringify({
                type: "data",
                id: 1
              })
            });
            this.onerror(new Error("Connection Error"));
            break;
          case 1:
            this.onmessage({
              data: JSON.stringify({
                type: "data",
                id: 1
              })
            });

            this.onmessage({
              data: JSON.stringify({
                type: "error",
                id: 3
              })
            });

            this.onclose();
            break;
          case 2:
            this.onmessage({
              data: JSON.stringify({
                type: "error",
                id: 3
              })
            });

            this.onmessage({
              data: JSON.stringify({
                type: "data",
                id: 4
              })
            });
            break;
        }
        index++;
      }.bind(this),
      50
    );
  }

  connectForever(FakeWebSocket, location, path)
    .map(data => ({ success: data }))
    .mapError(data => ({ failure: data }))
    .take(5)
    .fold([], (acc, item) => acc.concat([item]))
    .onValue(function(items) {
      t.deepEqual(items, [
        {
          success: {
            type: "data",
            id: 1
          }
        },
        {
          success: {
            type: "data",
            id: 1
          }
        },
        {
          failure: {
            type: "error",
            id: 3
          }
        },
        {
          failure: {
            type: "error",
            id: 3
          }
        },
        {
          success: {
            type: "data",
            id: 4
          }
        }
      ]);

      t.end();
    });
});
