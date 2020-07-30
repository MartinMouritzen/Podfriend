// @flow

import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const h1Theme = {
    color: variables.headerColor,
    fontSize: variables.fontSizeH1,
    lineHeight: variables.lineHeightH1
  };

  return h1Theme;
};
