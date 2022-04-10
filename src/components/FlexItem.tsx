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
    children?: React.ReactNode | null
}

function FlexItem(props: FlexItemProps = {
    flex: false,
    right: false,
    left: false,
    shrink: false,
    center: false,
    stretch: false,
    first: false,
    last: false,
    grow: false,
    nth: null,
    style: {},
    children: null
}) {
    const styles = {};

    if (props.flex) {
        styles['display'] = 'flex';
    }

    if (props.right) {
        styles['alignSelf'] = 'flex-end';
    }

    if (props.left) {
        styles['alignSelf'] = 'flex-start';
    }

    if (props.stretch) {
        styles['alignSelf'] = 'stretch';
    }

    if (props.center) {
        styles['alignSelf'] = 'center';
    }

    if (props.grow) {
        styles['flexGrow'] = 1;
    }

    if (props.shrink) {
        styles['flexShrink'] = 1;
    }

    if (props.first) {
        styles['order'] = '-9999';
    }

    if (props.nth) {
        styles['order'] = props.nth;
    }

    return (
        <div style={{...styles, ...props.style}}>
            {props.children}
        </div>
    );
}

export default FlexItem;
