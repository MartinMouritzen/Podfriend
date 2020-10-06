/** @jsx jsx */
import * as React from "react";
import { StyleFunction, LoaderSizeProps, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderSizeProps> {
    static defaultProps: Required<LoaderSizeProps>;
    style: StyleFunctionWithIndex;
    wrapper: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
