/** @jsx jsx */
import * as React from "react";
import { StyleFunction, PrecompiledCss, LoaderSizeProps, CalcFunction } from "./interfaces";
declare type BallStyleFunction = (size: number) => PrecompiledCss;
declare class Loader extends React.PureComponent<LoaderSizeProps> {
    static defaultProps: LoaderSizeProps;
    moonSize: CalcFunction<number>;
    ballStyle: BallStyleFunction;
    wrapper: StyleFunction;
    ball: CalcFunction<PrecompiledCss>;
    circle: CalcFunction<PrecompiledCss>;
    render(): JSX.Element | null;
}
export default Loader;
