import React from 'react';
interface Keyable {
    [key: string]: any;
}
interface FlexItemProps {
    flex: boolean;
    stretch: boolean;
    grow: boolean;
    shrink: boolean;
    first: boolean;
    right: boolean;
    left: boolean;
    center: boolean;
    last: boolean;
    nth: number | null;
    style: Keyable | null;
    children: React.ReactNode | null;
}
declare function FlexItem(props?: FlexItemProps): JSX.Element;
export default FlexItem;
