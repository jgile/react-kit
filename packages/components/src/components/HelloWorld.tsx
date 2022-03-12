import React, {ReactNode} from 'react';
// import PropTypes from 'prop-types';

const defaultProps = {
    name: 'John'
};

function HelloWorld(props: { name: string, children?: ReactNode } = defaultProps) {
    return (
        <div>
            Hello {props.name}
            {props.children}
        </div>
    );
}

HelloWorld.defaultProps = defaultProps;

export default HelloWorld;