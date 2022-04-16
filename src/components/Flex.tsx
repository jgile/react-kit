import React from 'react';

interface Keyable {
    [x: string]: any;
}

interface FlexProps {
    vertical?: boolean,
    reverse?: boolean,
    right?: boolean,
    left?: boolean,
    bottom?: boolean,
    top?: boolean,
    yCenter?: boolean,
    xCenter?: boolean,
    center?: boolean,
    wrap?: boolean,
    between?: boolean,
    grow?: boolean,
    style?: Keyable,
    children?: React.ReactNode,
    [x: string]: any;
}

function Flex(
    {
        vertical = false,
        reverse = false,
        right = false,
        left = false,
        bottom = false,
        top = false,
        yCenter = false,
        xCenter = false,
        center = false,
        wrap = false,
        between = false,
        grow = false,
        style = {},
        children = null,
        ...rest
    }: FlexProps
) {
    const styles: Keyable = {
        display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'
    };

    if (vertical) {
        styles.flexDirection = 'column';

        if (reverse) {
            styles.flexDirection = 'column-reverse';
        }

        if (right) {
            styles.alignItems = 'flex-end';
        }

        if (left) {
            styles.alignItems = 'flex-start';
        }

        if (bottom) {
            styles.justifyContent = 'flex-end';
        }

        if (top) {
            styles.justifyContent = 'flex-start';
        }

        if (yCenter) {
            styles.justifyContent = 'center';
        }

        if (xCenter || center) {
            styles.alignItems = 'center';
        }
    } else {
        if (reverse) {
            styles.flexDirection = 'row-reverse';
        }

        if (right) {
            styles.justifyContent = 'flex-end';
        }

        if (left) {
            styles.justifyContent = 'flex-start';
        }

        if (bottom) {
            styles.alignItems = 'flex-end';
        }

        if (top) {
            styles.alignItems = 'flex-start';
        }

        if (xCenter) {
            styles.justifyContent = 'center';
        }

        if (yCenter || center) {
            styles.alignItems = 'center';
        }
    }

    if (grow) {
        styles['flexGrow'] = 1;
    }

    if (between) {
        styles.justifyContent = 'space-between';
    }

    if (wrap) {
        styles.flexWrap = 'wrap';
    }

    return (
        <div {...rest} style={{...styles, ...style}}>
            {children}
        </div>
    );
}

export default Flex;
