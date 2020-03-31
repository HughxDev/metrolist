import React from 'react';
import PropTypes from 'prop-types';

import './Stack.scss';

function Stack( {
  className, space, indent, toppleAt, toppleUntil, children, align, alignAt,
} ) {
  let stackClasses = '';

  if ( space ) {
    stackClasses += ` ml-stack--space-${space.replace( '.', '_' )}`;
  }

  if ( toppleAt ) {
    stackClasses += ` ml-stack--topple-at ml-stack--topple-at-${toppleAt}`;
  } else if ( toppleUntil ) {
    stackClasses += ` ml-stack--topple-until ml-stack--topple-until-${toppleUntil}`;
  }

  if ( indent ) {
    stackClasses += ` ml-stack--indent-${indent}`;
  }

  if ( align && alignAt ) {
    align.forEach( ( alignment, index ) => {
      stackClasses += ` ml-stack--align-${alignment}-${alignAt[index]}`;
    } );
  }

  return (
    <div className={ `ml-stack${stackClasses}${className ? ` ${className}` : ''}` }>
      { children }
    </div>
  );
}

Stack.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "space": PropTypes.string,
  "indent": PropTypes.oneOfType( [PropTypes.string, PropTypes.bool] ),
  "toppleAt": PropTypes.string,
  "toppleUntil": PropTypes.string,
  "alignAt": PropTypes.arrayOf( PropTypes.oneOf( ['xsmall', 'small', 'medium', 'large', 'xlarge'] ) ),
  "align": PropTypes.arrayOf( PropTypes.oneOf( ['beginning', 'middle', 'end'] ) ),
};

export default Stack;
