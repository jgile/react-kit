import React from 'react';

interface Keyable {
    [key: string]: any;
}

interface FlexItemProps {
    flex?: boolean
    stretch?: boolean
    grow?: boolean
    shrink?: boolean
    first?: boolean
    right?: boolean,
    left?: boolean,
    center?: boolean,
    last?: boolean,
    nth?: number | null,
    style?: Keyable | null,
    children?: React.ReactNode | null,
    [x: string]: any
}

function FlexItem(
    {
        flex = false,
        right = false,
        left = false,
        shrink = false,
        center = false,
        stretch = false,
        first = false,
        last = false,
        grow = false,
        nth = null,
        style = {},
        children = null,
        ...rest
    }: FlexItemProps
) {
    const styles = {};

    if (flex) {
        styles['display'] = 'flex';
    }

    if (right) {
        styles['alignSelf'] = 'flex-end';
    }

    if (left) {
        styles['alignSelf'] = 'flex-start';
    }

    if (stretch) {
        styles['alignSelf'] = 'stretch';
    }

    if (center) {
        styles['alignSelf'] = 'center';
    }

    if (grow) {
        styles['flexGrow'] = 1;
    }

    if (shrink) {
        styles['flexShrink'] = 1;
    }

    if (first) {
        styles['order'] = '-9999';
    }

    if (last) {
        styles['order'] = '9999';
    }

    if (nth) {
        styles['order'] = nth;
    }

    return (
        <div {...rest} style={{...styles, ...style}}>
            {children}
        </div>
    );
}

export default FlexItem;
