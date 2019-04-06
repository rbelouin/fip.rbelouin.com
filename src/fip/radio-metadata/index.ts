import * as Bacon from "baconjs";
import request, { Response } from "request";
import { Song, Radio, NowPlaying, NowPlayingByRadio } from "../../types";
import { FipLiveMeta, FipStep } from "./types";

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
    // TODO: stop assuming fip data has the right structure?
    return JSON.parse(response.body);
  } catch (e) {
    return new Bacon.Error(e);
  }
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
