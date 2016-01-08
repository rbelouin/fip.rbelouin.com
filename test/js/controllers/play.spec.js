import test from "tape";
import Bacon from "baconjs";

import {
  getCurrentRadio,
  getBroadcastedSong,
  getSongHistory,
  getSongBeingPlayed
} from "../../../src/js/controllers/play.js";

test("The Play controller should extract the radio name from the current path", function(t) {
  const p_route = Bacon.fromArray([{
    params: {
      radio: "radio1"
    }
  },{
    params: {
      radio: "radio2"
    }
  },{
    params: {
      radio: "radio2"
    }
  }]);

  getCurrentRadio(p_route)
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), ["radio1", "radio2"]);

      t.end();
      return Bacon.noMore;
    });
});

test("The Play controller should get the song the current radio is broadcasting", function(t) {
  const s_route = new Bacon.Bus();
  const s_radios = new Bacon.Bus();

  getBroadcastedSong(s_route.toProperty(), s_radios.toProperty())
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), [{
        type: "loading"
      },{
        type: "song",
        song: {
          id: "ONE"
        }
      },{
        type: "song",
        song: {
          id: "THREE"
        }
      }]);

      t.end();
      return Bacon.noMore;
    });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    }
  });

  s_route.push({
    params: {
      radio: "radio1"
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "TWO"
        }
      },
      pastSongs: []
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "THREE"
        }
      },
      pastSongs: [{
        type: "song",
        song: {
          id: "TWO"
        }
      }]
    }
  });

  s_route.push({
    params: {
      radio: "radio2"
    }
  });

  s_route.push({
    params: {
      radio: "radio2"
    }
  });

  s_route.end();
  s_radios.end();
});

test("The Play controller should get the song history of the current radio", function(t) {
  const s_route = new Bacon.Bus();
  const s_radios = new Bacon.Bus();

  getSongHistory(s_route.toProperty(), s_radios.toProperty())
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), [
        [],
        [{
          id: "TWO"
        }],
        [{
          id: "ONE"
        }]
      ]);

      t.end();
      return Bacon.noMore;
    });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    }
  });

  s_route.push({
    params: {
      radio: "radio1"
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "TWO"
        }
      },
      pastSongs: []
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "THREE"
        }
      },
      pastSongs: [{
        type: "song",
        song: {
          id: "TWO"
        }
      }]
    }
  });

  s_route.push({
    params: {
      radio: "radio2"
    }
  });

  s_route.push({
    params: {
      radio: "radio2"
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "FOUR"
        }
      },
      pastSongs: [{
        type: "song",
        song: {
          id: "ONE"
        }
      }]
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "THREE"
        }
      },
      pastSongs: [{
        type: "song",
        song: {
          id: "TWO"
        }
      }]
    }
  });

  s_route.push({
    params: {
      radio: "radio1"
    }
  });

  s_route.end();
  s_radios.end();
});

test("The Play controller should get the song being played", function(t) {
  const s_playBus = new Bacon.Bus();
  const s_radios = new Bacon.Bus();

  const p_playBus = s_playBus.toProperty({
    type: "radio",
    radio: "radio1"
  });

  getSongBeingPlayed(s_radios.toProperty(), p_playBus)
    .fold([], (items, item) => items.concat([item]))
    .subscribe(function(ev) {
      t.ok(ev.hasValue());

      t.deepEqual(ev.value(), [{
        type: "loading"
      },{
        type: "song",
        song: {
          id: "TWO"
        }
      },{
        type: "song",
        song: {
          id: "THREE"
        }
      },{
        type: "spotify",
        song: {
          id: "TWO"
        }
      },{
        type: "song",
        song: {
          id: "ONE"
        }
      }]);

      t.end();
      return Bacon.noMore;
    });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    }
  });

  s_playBus.push({
    type: "radio",
    radio: "radio1"
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "loading"
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "TWO"
        }
      },
      pastSongs: []
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    }
  });

  s_radios.push({
    radio1: {
      nowPlaying: {
        type: "song",
        song: {
          id: "THREE"
        }
      },
      pastSongs: [{
        type: "song",
        song: {
          id: "TWO"
        }
      }]
    },
    radio2: {
      nowPlaying: {
        type: "song",
        song: {
          id: "ONE"
        }
      },
      pastSongs: []
    }
  });

  s_playBus.push({
    type: "spotify",
    song: {
      id: "TWO"
    }
  });

  s_playBus.push({
    type: "radio",
    radio: "radio2"
  });

  s_playBus.end();
  s_radios.end();
});
