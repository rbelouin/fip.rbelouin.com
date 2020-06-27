import React from "react";
import { Warning, NoAudioWarning, NoMPEGWarning } from "./index";

export default {
  title: "Warning"
};

export const Empty = () => <Warning />;
export const WithMessage = () => <Warning>Oops, something went wrong.</Warning>;
export const WithNoAudio = () => <NoAudioWarning />;
export const WithNoMPEG = () => <NoMPEGWarning />;
