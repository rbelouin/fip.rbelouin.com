import React from "react";
import { addDecorator } from "@storybook/react";

import { IntlProvider } from "react-intl";

import Intl from "../src/js/models/intl.js";

addDecorator(storyFn => {
  const intl = Intl.getIntlData();
  return (
    <IntlProvider locale={intl.locales} messages={intl.messages}>
      {storyFn()}
    </IntlProvider>
  );
});
