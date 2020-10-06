/** @jsx jsx */
import * as React from "react";
import { LoaderHeightWidthProps, StyleFunction, StyleFunctionWithIndex } from "./interfaces";
export declare class Loader extends React.PureComponent<LoaderHeightWidthProps> {
    static defaultProps: LoaderHeightWidthProps;
    style: StyleFunctionWithIndex;
    wrapper: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
