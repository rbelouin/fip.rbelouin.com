import Bacon from "baconjs";
import { ignoreNonRecurringErrors } from "./index";

test("ignoreNonRecurringErrors should ignore errors if less than `threshold`", done => {
  const stream = new Bacon.Bus();

  const unsubscribe = ignoreNonRecurringErrors(20, 5, stream).subscribe(
    event => {
      unsubscribe();
      expect(event.isEnd()).toBeTruthy();
      done();
    }
  );

  stream.error(1);
  stream.error(2);
  stream.error(3);
  stream.error(4);
  stream.end();
});

test("ignoreNonRecurringErrors should ignore errors if less than `threshold` in `interval`", done => {
  const stream = new Bacon.Bus();

  const unsubscribe = ignoreNonRecurringErrors(20, 5, stream).subscribe(
    event => {
      unsubscribe();
      expect(event.isEnd()).toBeTruthy();
      done();
    }
  );

  stream.error(1);
  stream.error(2);
  stream.error(3);
  stream.error(4);

  setTimeout(() => {
    stream.error(5);
    stream.error(6);
    stream.end();
  }, 30);
});

test("ignoreNonRecurringErrors should throw last error if `threshold` is met within `interval`", done => {
  const stream = new Bacon.Bus();

  const unsubscribe = ignoreNonRecurringErrors(20, 5, stream).subscribe(
    event => {
      unsubscribe();
      expect(event.isError()).toBeTruthy();

      expect((event as Bacon.Error<any>).error).toStrictEqual(7);
      done();
    }
  );

  stream.error(1);
  stream.error(2);
  stream.error(3);
  stream.error(4);

  setTimeout(() => {
    stream.error(5);
    stream.error(6);
    stream.error(7);
  }, 10);

  setTimeout(() => {
    stream.error(8);
    stream.error(9);
    stream.end();
  }, 30);
});

test("ignoreNonRecurringErrors should not block values", done => {
  const stream = new Bacon.Bus();

  const unsubscribe = ignoreNonRecurringErrors(20, 5, stream).subscribe(
    event => {
      unsubscribe();
      expect(event.hasValue()).toBeTruthy();
      expect(event.value()).toStrictEqual(42);
      done();
    }
  );

  stream.push(42);
  stream.end();
});
