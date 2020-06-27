import React from "react";
import { Song } from "../types";

export type PlayEvent =
  | { type: "stop" }
  | { type: "radio"; radio: string }
  | { type: "spotify"; song: Song };

export type FavEvent = { type: "add" | "remove"; song: Song };

export type SyncEvent = boolean;

export type Events = {
  play: PlayEvent;
  fav: FavEvent;
  sync: SyncEvent;
};

export type Dispatcher = <K extends keyof Events>(
  name: K,
  data: Events[K]
) => void;

export const loggingDispatcher: Dispatcher = (name, data) =>
  console.log("Dispatched event", name, data);

export type StoredCommands = {
  [K in keyof Events]?: Array<Events[K]>;
};

export type ArrayDispatcher = Dispatcher & {
  storedCommands: Readonly<StoredCommands>;
};

export function createArrayDispatcher(): ArrayDispatcher {
  const storedCommands: StoredCommands = {};
  const dispatcher: Dispatcher = (name, data) => {
    if (!Array.isArray(storedCommands[name])) {
      storedCommands[name] = [];
    }

    (storedCommands[name] as Array<any>).push(data);
  };

  const arrayDispatcher: ArrayDispatcher = Object.assign(dispatcher, {
    storedCommands
  });

  return arrayDispatcher;
}

export const DispatchContext = React.createContext(loggingDispatcher);

export default DispatchContext;
