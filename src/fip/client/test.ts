import test from "tape";
import { getStation } from "./index";

test("fip/client - getStation should return a start time", function(t) {
  getStation(7).then(data => {
    const startTime =
      data &&
      data.now &&
      data.now.playing_item &&
      data.now.playing_item.start_time;

    t.ok(startTime, "The returned data has a start time");
    t.equal(typeof startTime, "number");
    t.end();
  });
});

test("fip/client - getStation should return a title", function(t) {
  getStation(7).then(data => {
    const title = data && data.now && data.now.song && data.now.song.title;

    t.ok(title, "The returned data has a start time");
    t.equal(typeof title, "string");
    t.end();
  });
});
