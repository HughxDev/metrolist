import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import './Stack.scss';

const Stack = forwardRef( ( props, ref ) => {
  const {
    className, space, indent, reverseAt, children, align, alignAt,
  } = props;
  const attributes = { ...props };
  let stackClasses = '';
  delete attributes.indent;

  if ( space ) {
    delete attributes.space;
    stackClasses += ` ml-stack--space-${space.replace( '.', '_' )}`;
  }

  if ( indent ) {
    delete attributes.indent;
    stackClasses += ` ml-stack--indent-${indent}`;
  }

  if ( align && alignAt ) {
    delete attributes.align;
    delete attributes.alignAt;
    align.forEach( ( alignment, index ) => {
      stackClasses += ` ml-stack--align-${alignment}-${alignAt[index]}`;
    } );
  }

  if ( reverseAt ) {
    delete attributes.reverseAt;
    stackClasses += ` ml-stack--reverse-${reverseAt}`;
  }

  return (
    <div ref={ ref } { ...attributes } className={ `ml-stack${stackClasses}${className ? ` ${className}` : ''}` }>
      { children }
    </div>
  );
} );

Stack.displayName = 'Stack';

Stack.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "space": PropTypes.string,
  "indent": PropTypes.oneOfType( [PropTypes.string, PropTypes.bool] ),
  "alignAt": PropTypes.arrayOf( PropTypes.oneOf( ['xsmall', 'small', 'medium', 'large', 'xlarge'] ) ),
  "align": PropTypes.arrayOf( PropTypes.oneOf( ['beginning', 'middle', 'end'] ) ),
  "reverseAt": PropTypes.oneOf( ['xsmall', 'small', 'medium', 'large', 'xlarge'] ),
};

export default Stack;
