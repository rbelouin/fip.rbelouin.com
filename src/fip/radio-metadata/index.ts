import * as Bacon from "baconjs";
import _ from "lodash";
import request, { Response } from "request";
import { Song, Radio, NowPlaying, NowPlayingByRadio } from "../../types";
import { FipLiveMeta, FipStep, FipLevel } from "./types";

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

export function fetchRadio(radio: Radio): Bacon.Property<Error, Song> {
  const p_response = requestRadioLiveMeta(radio.metadataHref);
  const p_liveMeta = p_response.flatMap(parseLiveMeta);
  const p_step = p_liveMeta.flatMap(extractStep);

  return p_step.map(toSong).toProperty();
}

export function requestRadioLiveMeta(
  radioUrl: string
): Bacon.Property<Error, Response> {
  const requestWithCallback = (
    callback: (error: Error, response: Response) => void
  ) => request.get(radioUrl, callback);

  return Bacon.fromNodeCallback(requestWithCallback)
    .flatMap(filterSuccessfulResponse)
    .toProperty();
}

function filterSuccessfulResponse(
  response: Response
): Response | Bacon.Error<Error> {
  if (response.statusCode !== 200) {
    return new Bacon.Error(new Error("Failure when fetching radio metadata"));
  }

  return response;
}

export function parseLiveMeta(
  response: Response
): FipLiveMeta | Bacon.Error<Error> {
  try {
    return isFipLiveMeta(JSON.parse(response.body));
  } catch (e) {
    return new Bacon.Error(e);
  }
}

type Validator<T> = (value: any) => T;

export function isFipLiveMeta(value: any): FipLiveMeta {
  return isObject({
    steps: isRecord(isFipStep),
    levels: isArray(isFipLevel)
  })(value);
}

export function isFipStep(value: any): FipStep {
  return isObject({
    uuid: isString,
    start: isNumber,
    end: isNumber,
    title: isString,
    titreAlbum: isString,
    authors: isString,
    anneeEditionMusique: isNumber,
    label: isString,
    visual: isString
  })(value);
}

export function isFipLevel(value: any): FipLevel {
  return isObject({
    items: isArray(isString),
    position: isNumber
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

export function extractStep(
  liveMeta: FipLiveMeta
): FipStep | Bacon.Error<Error> {
  try {
    const level = liveMeta.levels[liveMeta.levels.length - 1];
    const stepId = level.items[level.position];
    return liveMeta.steps[stepId];
  } catch (e) {
    return new Bacon.Error(e);
  }
}

export function toSong(step: FipStep): Song {
  return {
    id: step.uuid,
    startTime: step.start,
    endTime: step.end,
    title: sanitize(step.title),
    album: sanitize(step.titreAlbum),
    artist: sanitize(step.authors),
    year: step.anneeEditionMusique.toString(),
    label: sanitize(step.label),
    icons: {
      medium: step.visual
    }
  };
}

function sanitize(input: string): string {
  return input.replace(
    /(\w)(\w+)/g,
    (...args) => args[1].toUpperCase() + args[2].toLowerCase()
  );
}
