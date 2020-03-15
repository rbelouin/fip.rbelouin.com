import React from "react";
import Bacon from "baconjs";
import SyncSection from "./index";

export default {
  title: "SyncSection"
};

export const Sync = () => <SyncSection syncBus={new Bacon.Bus()} />;
export const Unsync = () => (
  <SyncSection
    syncBus={new Bacon.Bus()}
    user={{ display_name: "Rodolphe Belouin" }}
  />
);
