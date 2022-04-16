import React from 'react';
interface Keyable {
    [x: string]: any;
}
interface FlexProps {
    vertical?: boolean;
    reverse?: boolean;
    right?: boolean;
    left?: boolean;
    bottom?: boolean;
    top?: boolean;
    yCenter?: boolean;
    xCenter?: boolean;
    center?: boolean;
    wrap?: boolean;
    between?: boolean;
    grow?: boolean;
    style?: Keyable;
    children?: React.ReactNode;
    [x: string]: any;
}
declare function Flex({ vertical, reverse, right, left, bottom, top, yCenter, xCenter, center, wrap, between, grow, style, children, ...rest }: FlexProps): JSX.Element;
export default Flex;
