import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

function Button( props ) {
  let htmlElement;
  const attributes = { ...props };

  switch ( props.as ) {
    case 'a':
    case 'link':
      htmlElement = 'a';
      break;
    case 'button':
    default:
      htmlElement = 'button';
  }

  delete attributes.as;
  delete attributes.children;

  return (
    React.createElement(
      htmlElement,
      {
        ...attributes,
        "className": `btn btn--metrolist${props.className ? ` ${props.className}` : ''}`,
      },
      props.children,
    )
  );
}

Button.propTypes = {
  "as": PropTypes.string,
  "href": PropTypes.string,
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Button;
