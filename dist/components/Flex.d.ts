import React from 'react';
interface Keyable {
    [key: string]: any;
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
    style?: Keyable;
    children?: React.ReactNode;
}
declare function Flex(props?: FlexProps): JSX.Element;
export default Flex;
