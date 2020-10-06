/** @jsx jsx */
import * as React from "react";
import { StyleFunction, LoaderSizeMarginProps, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderSizeMarginProps> {
    static defaultProps: LoaderSizeMarginProps;
    style: StyleFunctionWithIndex;
    ball: StyleFunction;
    wrapper: StyleFunction;
    long: StyleFunction;
    short: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
