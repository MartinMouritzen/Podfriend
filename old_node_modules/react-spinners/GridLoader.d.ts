/** @jsx jsx */
import * as React from "react";
import { StyleFunction, LoaderSizeMarginProps, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderSizeMarginProps> {
    static defaultProps: LoaderSizeMarginProps;
    style: StyleFunctionWithIndex;
    wrapper: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
