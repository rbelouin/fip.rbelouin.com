import * as React from "react";
import AppSection from "./index";

export default {
  title: "AppSection"
};

export const Empty = () => <AppSection />;
export const OneSection = () => (
  <AppSection>
    <div style={{ background: "#dd6666", height: "50px" }} />
  </AppSection>
);
export const TwoSections = () => (
  <>
    <AppSection>
      <div style={{ background: "#dd6666", height: "50px" }} />
    </AppSection>
    <AppSection>
      <div style={{ background: "#66dd66", height: "50px" }} />
    </AppSection>
  </>
);
export const ThreeSections = () => (
  <>
    <AppSection>
      <div style={{ background: "#dd6666", height: "50px" }} />
    </AppSection>
    <AppSection>
      <div style={{ background: "#66dd66", height: "50px" }} />
    </AppSection>
    <AppSection>
      <div style={{ background: "#6666dd", height: "100vh" }} />
    </AppSection>
  </>
);
