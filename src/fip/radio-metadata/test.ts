import test from "tape";
import Bacon from "baconjs";
import { Response } from "request";
import http from "http";
import _ from "lodash";

import {
  fetchRadios,
  fetchRadio,
  parseLiveMeta,
  extractStep,
  toSong
} from "./index";
import { FipLiveMeta, FipStep } from "./types";
import { Song, Radio, NowPlaying, NowPlayingByRadio } from "./../../types";

import fipRadioRawLiveMeta from "./test/fipradio.raw-livemeta.json";
import fipRadioLiveMeta from "./test/fipradio.livemeta.json";
import fipElectroRawLiveMeta from "./test/fipelectro.raw-livemeta.json";
import fipElectroLiveMeta from "./test/fipelectro.livemeta.json";
import flashFipStep from "./test/flash.fipstep.json";
import flashSong from "./test/flash.song.json";
import drivingInMyCarFipStep from "./test/drivingInMyCar.fipstep.json";
import drivingInMyCarSong from "./test/drivingInMyCar.song.json";
import tiDeFipStep from "./test/tiDe.fipstep.json";
import tiDeSong from "./test/tiDe.song";
import zouzouFipStep from "./test/zouzou.fipstep.json";
import zouzouSong from "./test/zouzou.song.json";
import marriageIsForOldFolksSong from "./test/marriageIsForOldFolks.song.json";

type SongIdByRadioId = { [radioId: string]: string };

test("fip/radio-metadata: fetchRadios", function(t) {
  const fetch = (() => {
    let count = 0;
    return (radio: Radio) =>
      Bacon.once<Error, Song>({
        ...flashSong,
        id: `${radio.id}-${count++}`
      }).toProperty();
  })();

  const unsubscribe = fetchRadios(
    100,
    [
      {
        id: "fip-radio",
        audioSource: "source",
        metadataHref: "href",
        picture: "pic"
      },
      {
        id: "fip-jazz",
        audioSource: "source",
        metadataHref: "href",
        picture: "pic"
      }
    ],
    fetch
  )
    .takeUntil(Bacon.later(250, "value"))
    .map(nowPlayingByRadio => _.mapValues(nowPlayingByRadio, x => x.song.id))
    .fold(
      [] as SongIdByRadioId[],
      (acc: SongIdByRadioId[], item: SongIdByRadioId) => [...acc, item]
    )
    .subscribe((event: any) => {
      unsubscribe();
      t.ok(event instanceof Bacon.Next);

      t.deepEqual(event.value(), [
        {
          "fip-radio": "fip-radio-0",
          "fip-jazz": "fip-jazz-1"
        },
        {
          "fip-radio": "fip-radio-2",
          "fip-jazz": "fip-jazz-1"
        },
        {
          "fip-radio": "fip-radio-2",
          "fip-jazz": "fip-jazz-3"
        },
        {
          "fip-radio": "fip-radio-4",
          "fip-jazz": "fip-jazz-3"
        },
        {
          "fip-radio": "fip-radio-4",
          "fip-jazz": "fip-jazz-5"
        }
      ]);
      t.end();
    });
});

test("fip/radio-metadata: fetchRadio", function(t) {
  const server = http.createServer(function(req, res) {
    res.end(req.url === "/livemeta" ? JSON.stringify(fipRadioLiveMeta) : "");
  });

  server.listen(54321);

  const unsubscribe = fetchRadio({
    id: "fip-radio",
    audioSource: "source",
    metadataHref: "http://127.0.0.1:54321/livemeta",
    picture: "picture"
  }).subscribe(function(event: any) {
    unsubscribe();
    server.close();
    t.ok(event instanceof Bacon.Next, `should be an instance of Bacon.Next`);
    t.deepEqual(event.value(), marriageIsForOldFolksSong);
    t.end();
  });
});

test("fip/radio-metadata: parseLiveMeta", function(t) {
  const scenarios: Array<{ input: Response; output: FipLiveMeta }> = [
    {
      input: { body: JSON.stringify(fipRadioRawLiveMeta) } as Response,
      output: fipRadioLiveMeta
    },
    {
      input: { body: JSON.stringify(fipElectroRawLiveMeta) } as Response,
      output: fipElectroLiveMeta
    }
  ];

  scenarios.forEach(({ input, output }) =>
    t.deepEqual(parseLiveMeta(input), output, `should parse live meta`)
  );
  t.end();
});

test("fip/radio-metadata: parseLiveMeta (errors)", function(t) {
  const scenarios: Array<{ input: Response }> = [
    {
      input: { body: "Unparsable string" } as Response
    },
    {
      input: { body: "Cannot parse" } as Response
    }
  ];

  scenarios.forEach(({ input }) =>
    t.ok(parseLiveMeta(input) instanceof Bacon.Error)
  );
  t.end();
});

test("fip/radio-metadata: extractStep", function(t) {
  const scenarios: Array<{ input: FipLiveMeta; output: FipStep }> = [
    {
      input: {
        steps: {
          A: flashFipStep as FipStep
        },
        levels: [
          {
            items: ["A"],
            position: 0
          }
        ]
      },
      output: flashFipStep as FipStep
    },
    {
      input: {
        steps: {
          A: flashFipStep as FipStep,
          B: drivingInMyCarFipStep as FipStep
        },
        levels: [
          {
            items: ["A"],
            position: 0
          },
          {
            items: ["A", "B"],
            position: 1
          }
        ]
      },
      output: drivingInMyCarFipStep as FipStep
    }
  ];

  scenarios.forEach(({ input, output }) =>
    t.deepEqual(
      extractStep(input),
      output,
      `should return the step matching the position of the last level`
    )
  );
  t.end();
});

test("fip/radio-metadata: toSong", function(t) {
  const scenarios: Array<{ input: FipStep; output: Song }> = [
    {
      input: flashFipStep as FipStep,
      output: flashSong
    },
    {
      input: drivingInMyCarFipStep as FipStep,
      output: drivingInMyCarSong
    },
    {
      input: tiDeFipStep as FipStep,
      output: tiDeSong
    },
    {
      input: zouzouFipStep as FipStep,
      output: zouzouSong
    }
  ];

  scenarios.forEach(({ input, output }) =>
    t.deepEqual(
      toSong("fallback.png")(input),
      output,
      `should successfully transform ${input.title}`
    )
  );
  t.end();
});
