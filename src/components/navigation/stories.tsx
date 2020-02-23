import React from "react";
import Navigation from "./index";
import { Radio } from "../../types";

export default {
  title: "Navigation"
};

export const Default = () => (
  <Navigation
    route="radio"
    radio="fip-autour-du-jazz"
    radios={[radioOne, radioTwo]}
  />
);

export const WithManyItems = () => (
  <Navigation
    route="radio"
    radio="fip-radio"
    radios={[
      radioOne,
      radioTwo,
      radioTwo,
      radioTwo,
      radioTwo,
      radioTwo,
      radioTwo
    ]}
  />
);

const radioOne: Radio = {
  id: "fip-radio",
  stationId: 0,
  metadataHref: "metadata",
  audioSource: "audioSource",
  picture: "picture",
  color: "#ff9999"
};

const radioTwo: Radio = {
  id: "fip-autour-du-jazz",
  stationId: 0,
  metadataHref: "metadata",
  audioSource: "audioSource",
  picture: "picture",
  color: "#99ff99"
};
