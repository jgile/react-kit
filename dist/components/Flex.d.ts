import React from 'react';
import PropTypes from 'prop-types';
interface Keyable {
    [key: string]: any;
}
interface FlexProps {
    vertical: boolean;
    reverse: boolean;
    right: boolean;
    left: boolean;
    bottom: boolean;
    top: boolean;
    yCenter: boolean;
    xCenter: boolean;
    center: boolean;
    wrap: boolean;
    between: boolean;
    style: Keyable;
    children: React.ReactNode;
}
declare function Flex(props: FlexProps): JSX.Element;
declare namespace Flex {
    var defaultProps: {
        vertical: boolean;
        reverse: boolean;
        right: boolean;
        left: boolean;
        bottom: boolean;
        top: boolean;
        yCenter: boolean;
        xCenter: boolean;
        center: boolean;
        wrap: boolean;
        between: boolean;
        style: {};
        children: null;
    };
    var propTypes: {
        vertical: PropTypes.Requireable<boolean>;
        reverse: PropTypes.Requireable<boolean>;
        right: PropTypes.Requireable<boolean>;
        left: PropTypes.Requireable<boolean>;
        bottom: PropTypes.Requireable<boolean>;
        top: PropTypes.Requireable<boolean>;
        yCenter: PropTypes.Requireable<boolean>;
        xCenter: PropTypes.Requireable<boolean>;
        center: PropTypes.Requireable<boolean>;
        wrap: PropTypes.Requireable<boolean>;
        between: PropTypes.Requireable<boolean>;
        style: PropTypes.Requireable<object>;
    };
}
export default Flex;
