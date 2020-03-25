import React from 'react';
import PropTypes from 'prop-types';

import './Stack.scss';

function Stack( {
  className, space, toppleAt, children,
} ) {
  if ( space ) {
    className = `ml-stack--space-${space.replace( '.', '_' )}${className ? ` ${className}` : ''}`;
  }

  return (
    <div className={ `ml-stack${className ? ` ${className}` : ''}` }>
      { children }
    </div>
  );
}

Stack.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "space": PropTypes.string,
  "toppleAt": PropTypes.string,
};

export default Stack;
