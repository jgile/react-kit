import React from 'react';

function Flex(props = {
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
    style: {}
}) {
    const styles = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    };
    if (props.vertical) {
        styles['flexDirection'] = 'column';

        if (props.reverse) {
            styles['flexDirection'] = 'column-reverse';
        }

        if (props.right) {
            styles['alignItems'] = 'flex-end';
        }

        if (props.left) {
            styles['alignItems'] = 'flex-start';
        }

        if (props.bottom) {
            styles['justifyContent'] = 'flex-end';
        }

        if (props.top) {
            styles['justifyContent'] = 'flex-start';
        }

        if (props.yCenter) {
            styles['justifyContent'] = 'center';
        }

        if (props.xCenter || props.center) {
            styles['alignItems'] = 'center';
        }
    } else {
        if (props.reverse) {
            styles['flexDirection'] = 'row-reverse';
        }

        if (props.right) {
            styles['justifyContent'] = 'flex-end';
        }

        if (props.left) {
            styles['justifyContent'] = 'flex-start';
        }

        if (props.bottom) {
            styles['alignItems'] = 'flex-end';
        }

        if (props.top) {
            styles['alignItems'] = 'flex-start';
        }

        if (props.xCenter) {
            styles['justifyContent'] = 'center';
        }

        if (props.yCenter || props.center) {
            styles['alignItems'] = 'center';
        }
    }

    if (props.wrap) {
        styles['flexWrap'] = 'wrap';
    }

    return (
        <div style={{...styles, ...props.style}}>
            {props.children}
        </div>
    );
}

export default Flex;