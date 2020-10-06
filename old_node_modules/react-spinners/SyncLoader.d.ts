/** @jsx jsx */
import * as React from "react";
import { LoaderSizeMarginProps, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderSizeMarginProps> {
    static defaultProps: LoaderSizeMarginProps;
    style: StyleFunctionWithIndex;
    render(): JSX.Element | null;
}
export default Loader;
