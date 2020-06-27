import React from "react";
import PropTypes, { InferProps } from "prop-types";
const style = require("./style.css");

export const appSectionPropTypes = {
  children: PropTypes.node
};

export type AppSectionPropTypes = InferProps<typeof appSectionPropTypes>;

export const AppSection: React.FunctionComponent<AppSectionPropTypes> = ({
  children
}) => <section className={style.section}>{children}</section>;

AppSection.propTypes = appSectionPropTypes;

export default AppSection;
