/** @jsx jsx */
import * as React from "react";
import { StyleFunction, LoaderSizeProps } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderSizeProps> {
    static defaultProps: Required<LoaderSizeProps>;
    wrapper: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
