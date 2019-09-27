import { getStation } from "./index";

test("fip/client - getStation should return a start time", function(done) {
  getStation(7).then(data => {
    const startTime =
      data &&
      data.now &&
      data.now.playing_item &&
      data.now.playing_item.start_time;

    expect(typeof startTime).toBe("number");
    done();
  });
});

test("fip/client - getStation should return a title", function(done) {
  getStation(7).then(data => {
    const title = data && data.now && data.now.song && data.now.song.title;

    expect(typeof title).toBe("string");
    done();
  });
});
