import React from "react";
import SyncSection from "./index";

export default {
  title: "SyncSection"
};

export const Sync = () => <SyncSection />;
export const Unsync = () => (
  <SyncSection user={{ display_name: "Rodolphe Belouin" }} />
);
