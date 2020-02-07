import Bacon from "baconjs";

export const getAllEvents = (() => {
  let stream: Bacon.EventStream<string, Uint8Array> | undefined;

  return (): Bacon.EventStream<string, Uint8Array> => {
    if (!stream) {
      stream = Bacon.fromBinder(sink => {
        if (typeof navigator.requestMIDIAccess !== "function") {
          sink(new Bacon.Error("The Web MIDI API is not available"));
          sink(new Bacon.End());
          return () => {};
        }

        const listener = (message: WebMidi.MIDIMessageEvent) =>
          sink(message.data);

        const p_inputs = navigator
          .requestMIDIAccess()
          .then(access => Array.from(access.inputs.values()));

        p_inputs
          .then(inputs => {
            inputs.forEach(input =>
              input.addEventListener("midimessage", listener)
            );
          })
          .catch(error => {
            sink(new Bacon.Error(error));
            sink(new Bacon.End());
          });

        return () => {
          p_inputs.then(inputs => {
            inputs.forEach(input =>
              input.removeEventListener(
                "midimessage",
                listener as EventListener
              )
            );
          });
        };
      });
    }

    return stream;
  };
})();

export const getVolumeEvents = () =>
  getAllEvents()
    .filter(
      ([statusByte, byte2, byte3]) =>
        Math.floor(statusByte / 0xf) === 0xb && byte2 === 0x7
    )
    .map(([statusByte, byte2, byte3]) => byte3);

export const getNoteOffEvents = () =>
  getAllEvents()
    .filter(
      ([statusByte, byte2, byte3]) => Math.floor(statusByte / 0xf) === 0x8
    )
    .map(([statusByte, byte2, byte3]) => byte2);

export const getNoteOnEvents = () =>
  getAllEvents()
    .filter(
      ([statusByte, byte2, byte3]) => Math.floor(statusByte / 0xf) === 0x9
    )
    .map(([statusByte, byte2, byte3]) => byte2);
