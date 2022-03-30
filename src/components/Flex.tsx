import React from 'react';

interface Keyable {
    [key: string]: any;
}

interface FlexProps {
    vertical: boolean,
    reverse: boolean,
    right: boolean,
    left: boolean,
    bottom: boolean,
    top: boolean,
    yCenter: boolean,
    xCenter: boolean,
    center: boolean,
    wrap: boolean,
    between: boolean,
    style: Keyable,
    children: React.ReactNode
}

function Flex(props: FlexProps = {
    vertical: false,
    reverse: false,
    right: false,
    left: false,
    bottom: false,
    top: false,
    yCenter: false,
    xCenter: false,
    center: false,
    wrap: false,
    between: false,
    style: {},
    children: null
}) {
    const styles: Keyable = {
        display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'
    };

    if (props.vertical) {
        styles.flexDirection = 'column';

        if (props.reverse) {
            styles.flexDirection = 'column-reverse';
        }

        if (props.right) {
            styles.alignItems = 'flex-end';
        }

        if (props.left) {
            styles.alignItems = 'flex-start';
        }

        if (props.bottom) {
            styles.justifyContent = 'flex-end';
        }

        if (props.top) {
            styles.justifyContent = 'flex-start';
        }

        if (props.yCenter) {
            styles.justifyContent = 'center';
        }

        if (props.xCenter || props.center) {
            styles.alignItems = 'center';
        }
    } else {
        if (props.reverse) {
            styles.flexDirection = 'row-reverse';
        }

        if (props.right) {
            styles.justifyContent = 'flex-end';
        }

        if (props.left) {
            styles.justifyContent = 'flex-start';
        }

        if (props.bottom) {
            styles.alignItems = 'flex-end';
        }

        if (props.top) {
            styles.alignItems = 'flex-start';
        }

        if (props.xCenter) {
            styles.justifyContent = 'center';
        }

        if (props.yCenter || props.center) {
            styles.alignItems = 'center';
        }
    }

    if (props.between) {
        styles.justifyContent = 'space-between';
    }

    if (props.wrap) {
        styles.flexWrap = 'wrap';
    }

    return (
        <div style={{ ...styles, ...props.style }}>
            {props.children}
        </div>
    );
}

export default Flex;
