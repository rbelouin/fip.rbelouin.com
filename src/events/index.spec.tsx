import React, { useContext } from "react";
import { render } from "@testing-library/react";
import { DispatchContext, createArrayDispatcher } from ".";

describe("DispatchContext", () => {
  describe("default (loggingDispatcher)", () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log");
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it("should log the dispatched events with console.log", () => {
      const song = { id: "id", title: "title", icons: {} };
      const Component = () => {
        const dispatch = useContext(DispatchContext);
        dispatch("play", { type: "spotify", song });

        return <div>component</div>;
      };

      render(<Component />);

      expect(consoleSpy).toHaveBeenCalledWith("Dispatched event", "play", {
        type: "spotify",
        song
      });
    });
  });

  describe("createArrayDispatcher", () => {
    it("should store the dispatched events in an array", () => {
      const dispatch = createArrayDispatcher();

      dispatch("play", { type: "stop" });
      dispatch("sync", false);
      dispatch("play", { type: "radio", radio: "radio-name" });

      expect(dispatch.storedCommands).toEqual({
        play: [{ type: "stop" }, { type: "radio", radio: "radio-name" }],
        sync: [false]
      });
    });
  });
});
