/** @jsx jsx */
import * as React from "react";
import { LoaderHeightWidthRadiusProps, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderHeightWidthRadiusProps> {
    static defaultProps: LoaderHeightWidthRadiusProps;
    style: StyleFunctionWithIndex;
    render(): JSX.Element | null;
}
export default Loader;
