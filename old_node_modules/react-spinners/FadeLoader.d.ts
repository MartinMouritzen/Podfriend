/** @jsx jsx */
import * as React from "react";
import { StyleFunction, LoaderHeightWidthRadiusProps, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderHeightWidthRadiusProps> {
    static defaultProps: LoaderHeightWidthRadiusProps;
    radius: () => number;
    quarter: () => number;
    style: StyleFunctionWithIndex;
    wrapper: StyleFunction;
    a: StyleFunction;
    b: StyleFunction;
    c: StyleFunction;
    d: StyleFunction;
    e: StyleFunction;
    f: StyleFunction;
    g: StyleFunction;
    h: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
