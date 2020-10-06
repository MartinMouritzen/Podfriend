/** @jsx jsx */
import * as React from "react";
import { Keyframes } from "@emotion/serialize";
import { StyleFunction, LoaderSizeProps, CalcFunction, StyleFunctionWithIndex } from "./interfaces";
declare class Loader extends React.PureComponent<LoaderSizeProps> {
    static defaultProps: LoaderSizeProps;
    thickness: CalcFunction<number>;
    lat: CalcFunction<number>;
    offset: CalcFunction<number>;
    color: CalcFunction<string>;
    before: CalcFunction<Keyframes>;
    after: CalcFunction<Keyframes>;
    style: StyleFunctionWithIndex;
    wrapper: StyleFunction;
    render(): JSX.Element | null;
}
export default Loader;
