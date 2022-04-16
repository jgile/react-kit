import React from 'react';
interface Keyable {
    [key: string]: any;
}
interface FlexItemProps {
    flex?: boolean;
    stretch?: boolean;
    grow?: boolean;
    shrink?: boolean;
    first?: boolean;
    right?: boolean;
    left?: boolean;
    center?: boolean;
    last?: boolean;
    nth?: number | null;
    style?: Keyable | null;
    children?: React.ReactNode | null;
    [x: string]: any;
}
declare function FlexItem({ flex, right, left, shrink, center, stretch, first, last, grow, nth, style, children, ...rest }: FlexItemProps): JSX.Element;
export default FlexItem;
