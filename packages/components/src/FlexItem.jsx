import React from 'react';
import PropTypes from "prop-types";

function FlexItem(props) {
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

FlexItem.defaultProps = {
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
};

FlexItem.propTypes = {
    right: PropTypes.bool,
    left: PropTypes.bool,
    shrink: PropTypes.bool,
    center: PropTypes.bool,
    stretch: PropTypes.bool,
    first: PropTypes.bool,
    last: PropTypes.bool,
    grow: PropTypes.bool,
    nth: PropTypes.any,
    style: PropTypes.object
};

export default FlexItem;