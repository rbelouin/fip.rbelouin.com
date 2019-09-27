import Bacon from "baconjs";

import { fetchFipSongs, fetchFipRadios } from "../../../src/js/models/fip.js";

test("Fip.fetchFipSongs should return played songs", function(done) {
  const url = "ws://localhost/";

  function connectForever(_url) {
    expect(_url).toStrictEqual(url);

    return Bacon.fromArray([
      {
        type: "song",
        song: {
          id: "song1",
          startTime: 1
        }
      },
      {
        type: "song",
        song: {
          id: "song2",
          startTime: 2
        }
      },
      {
        type: "song",
        song: {
          id: "song1",
          startTime: 1
        }
      },
      {
        type: "song",
        song: {
          id: "song2",
          startTime: 2
        }
      },
      {
        type: "song",
        song: {
          id: "song3",
          startTime: 3
        }
      },
      {
        type: "song",
        song: {
          id: "song3",
          startTime: 3
        }
      }
    ]);
  }

  const p_songs = fetchFipSongs(connectForever, url);

  expect(p_songs).toBeInstanceOf(Bacon.Property);

  p_songs
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      expect(ev.hasValue()).toBeTruthy();
      expect(ev.value()).toStrictEqual([
        {
          id: "song1",
          startTime: 1
        },
        {
          id: "song2",
          startTime: 2
        },
        {
          id: "song3",
          startTime: 3
        }
      ]);

      done();

      return Bacon.noMore;
    });
});

test("Fip.fetchFipRadios should return data for each radio", function(done) {
  const url = "ws://localhost/";

  function connectForever(_url) {
    expect(_url).toStrictEqual(url);

    return Bacon.fromArray([
      {
        radio1: {
          type: "song",
          song: {
            id: "song1-1",
            startTime: 100
          }
        },
        radio2: {
          type: "song",
          song: {
            id: "song2-1",
            startTime: 110
          }
        },
        radio3: {
          type: "song",
          song: {
            id: "song3-1",
            startTime: 120
          }
        }
      },
      {
        radio1: {
          type: "song",
          song: {
            id: "song1-1",
            startTime: 100
          }
        },
        radio2: {
          type: "song",
          song: {
            id: "song2-1",
            startTime: 110
          }
        },
        radio3: {
          type: "song",
          song: {
            id: "song3-1",
            startTime: 120
          }
        }
      },
      {
        radio1: {
          type: "song",
          song: {
            id: "song1-2",
            startTime: 200
          }
        },
        radio2: {
          type: "song",
          song: {
            id: "song2-1",
            startTime: 110
          }
        },
        radio3: {
          type: "song",
          song: {
            id: "song3-1",
            startTime: 120
          }
        }
      },
      {
        radio1: {
          type: "song",
          song: {
            id: "song1-3",
            startTime: 300
          }
        },
        radio2: {
          type: "song",
          song: {
            id: "song2-1",
            startTime: 110
          }
        },
        radio3: {
          type: "song",
          song: {
            id: "song3-1",
            startTime: 120
          }
        }
      },
      {
        radio1: {
          type: "song",
          song: {
            id: "song1-3",
            startTime: 300
          }
        },
        radio2: {
          type: "song",
          song: {
            id: "song2-2",
            startTime: 310
          }
        },
        radio3: {
          type: "song",
          song: {
            id: "song3-1",
            startTime: 120
          }
        }
      },
      {
        radio1: {
          type: "song",
          song: {
            id: "song1-3",
            startTime: 300
          }
        },
        radio2: {
          type: "song",
          song: {
            id: "song2-2",
            startTime: 310
          }
        },
        radio3: {
          type: "song",
          song: {
            id: "song3-2",
            startTime: 320
          }
        }
      }
    ]).delay(50);
  }

  const data = fetchFipRadios(connectForever, url, [
    "radio1",
    "radio2",
    "radio4"
  ]);

  expect(data.radio1).toBeInstanceOf(Bacon.EventStream);
  expect(data.radio2).toBeInstanceOf(Bacon.EventStream);
  expect(data.radio4).toBeInstanceOf(Bacon.EventStream);

  expect(data.radio3).not.toBeInstanceOf(Bacon.EventStream);

  const p_radio1 = data.radio1.fold([], (items, item) => items.concat([item]));

  const p_radio2 = data.radio2.fold([], (items, item) => items.concat([item]));

  const p_radio4 = data.radio4
    .skipErrors()
    .fold([], (items, item) => items.concat([item]));

  Bacon.zipAsArray([p_radio1, p_radio2, p_radio4]).subscribe(function(ev) {
    expect(ev.hasValue()).toBeTruthy();

    const [radio1, radio2, radio4] = ev.value();

    expect(radio1).toStrictEqual([
      {
        type: "song",
        song: {
          id: "song1-1",
          startTime: 100
        }
      },
      {
        type: "song",
        song: {
          id: "song1-2",
          startTime: 200
        }
      },
      {
        type: "song",
        song: {
          id: "song1-3",
          startTime: 300
        }
      }
    ]);

    expect(radio2).toStrictEqual([
      {
        type: "song",
        song: {
          id: "song2-1",
          startTime: 110
        }
      },
      {
        type: "song",
        song: {
          id: "song2-2",
          startTime: 310
        }
      }
    ]);

    expect(radio4).toStrictEqual([]);

    done();

    return Bacon.noMore;
  });
});
