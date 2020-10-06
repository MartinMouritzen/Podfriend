/** @jsx jsx */
import * as React from "react";
import { Keyframes } from "@emotion/serialize";
import { StyleFunction, LoaderSizeMarginProps, CalcFunction, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderSizeMarginProps> {
    static defaultProps: LoaderSizeMarginProps;
    ball: CalcFunction<Keyframes>;
    ballStyle: StyleFunctionWithIndex;
    s1: CalcFunction<string>;
    s2: CalcFunction<string>;
    pacmanStyle: StyleFunctionWithIndex;
    wrapper: StyleFunction;
    pac: StyleFunction;
    man: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
