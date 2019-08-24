import * as Bacon from "baconjs";
import _ from "lodash";
import {
  Song,
  Radio,
  NowPlaying,
  NowPlayingByRadio,
  FipClientError
} from "../../types";
import { FipNow, FipTimelineItem, FipSongOnAir } from "./types";
import { getStation } from "../client";

export function fetchRadios(
  interval: number,
  radios: Radio[],
  fetch: (radio: Radio) => Bacon.Property<Error, Song> = fetchRadio
): Bacon.Property<Error, NowPlayingByRadio> {
  return Bacon.combineTemplate(
    radios.reduce(
      (template, radio) => ({
        ...template,
        [radio.id]: repeat(interval, () =>
          fetch(radio).map(song => ({ radio, song }))
        )
      }),
      {}
    )
  );
}

function repeat<E, A>(
  interval: number,
  f: () => Bacon.Property<E, A>
): Bacon.Property<E, A> {
  return Bacon.mergeAll(
    f().toEventStream(),
    Bacon.repeat(() => Bacon.later<E, boolean>(interval, true).flatMap(f))
  ).toProperty();
}

export function fetchRadio(radio: Radio): Bacon.Property<FipClientError, Song> {
  const p_radioData = requestRadioData(radio);
  const p_fipNow = p_radioData.flatMap(parseRadioData).flatMapError(e => {
    e.data = { ...e.data, radio: JSON.stringify(radio) };
    return new Bacon.Error(e) as (FipNow | Bacon.Error<FipClientError>);
  });

  return p_fipNow.map(toSong(radio.picture)).toProperty();
}

export function requestRadioData(
  radio: Radio
): Bacon.Property<FipClientError, any> {
  return Bacon.fromPromise(getStation(radio.stationId)).toProperty() as any;
}

export function parseRadioData(
  data: any
): FipNow | Bacon.Error<FipClientError> {
  try {
    return isFipNow(data);
  } catch (e) {
    e.data = { ...e.data, response: JSON.stringify(data) };
    return new Bacon.Error(e);
  }
}

type Validator<T> = (value: any) => T;

export function isFipNow(value: any): FipNow {
  const data = isObject({
    now: isObject({
      playing_item: isFipTimelineItem,
      song: isFipSongOnAir
    })
  })(value);

  return data.now;
}

export function isFipTimelineItem(value: any): FipTimelineItem {
  return isObject({
    start_time: isNumber,
    end_time: isNumber
  })(value);
}

export function isFipSongOnAir(value: any): FipSongOnAir {
  return isObject({
    title: isString,
    cover: isOptional(isString),
    interpreters: isOptional(isArray(isString)),
    label: isOptional(isString),
    album: isOptional(isString)
  })(value);
}

export function isRecord<V>(
  validator: Validator<V>
): Validator<Record<string, V>> {
  return (value: any) => {
    if (!_.isObject(value)) {
      throw new Error(`Not a record: ${JSON.stringify(value)}`);
    }

    return _.mapValues(value as any, (v, k) => {
      try {
        return validator(v);
      } catch (e) {
        throw new Error(`For key ${k}: ${e.message}`);
      }
    });
  };
}

export function isArray<V>(validator: Validator<V>): Validator<Array<V>> {
  return (value: any) => {
    if (!_.isArray(value)) {
      throw new Error(`Not an array: ${JSON.stringify(value)}`);
    }

    return _.map(value, (v, i) => {
      try {
        return validator(v);
      } catch (e) {
        throw new Error(`For index ${i}: ${e.message}`);
      }
    });
  };
}

export function isObject<O>(
  validators: { [K in keyof O]: Validator<O[K]> }
): Validator<O> {
  return (value: any) => {
    if (!_.isObject(value)) {
      throw new Error(`Not an object: ${JSON.stringify(value)}`);
    }

    let validatedObject: Partial<O> = {};

    for (let key in validators) {
      if (validators.hasOwnProperty(key)) {
        try {
          validatedObject[key] = validators[key]((value as any)[key]);
        } catch (e) {
          throw new Error(`For key ${key}: ${e.message}`);
        }
      }
    }

    return validatedObject as O;
  };
}

export function isOptional<V>(
  validator: Validator<V>
): Validator<V | undefined> {
  return (value: any) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    return validator(value);
  };
}

export function isString(value: any): string {
  if (typeof value !== "string") {
    throw new Error(`Not a string: ${JSON.stringify(value)}`);
  }

  return value;
}

export function isNumber(value: any): number {
  if (typeof value !== "number") {
    throw new Error(`Not a number: ${JSON.stringify(value)}`);
  }

  return value;
}

export const toSong = (defaultIcon: string) => (now: FipNow): Song => {
  return {
    id: "",
    startTime: now.playing_item.start_time,
    endTime: now.playing_item.end_time,
    title: sanitize(now.song.title),
    album: mapUndefined(now.song.album, sanitize),
    artist: mapUndefined(now.song.interpreters, interpreters =>
      interpreters.map(sanitize).join(", ")
    ),
    year: undefined,
    label: mapUndefined(now.song.label, sanitize),
    icons: {
      medium: now.song.cover || defaultIcon
    }
  };
};

function sanitize(input: string): string {
  return input.replace(
    /(\w)(\w+)/g,
    (...args) => args[1].toUpperCase() + args[2].toLowerCase()
  );
}

function mapUndefined<A, B>(
  value: A | undefined,
  f: (a: A) => B
): B | undefined {
  if (value === undefined) {
    return undefined;
  }

  return f(value);
}
