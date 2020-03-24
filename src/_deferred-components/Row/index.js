import React from 'react';
import PropTypes from 'prop-types';

import './Row.scss';

function Row( props ) {
  let RowElement;
  const targetProps = { ...props };

  if ( props.as ) {
    delete targetProps.as;
    RowElement = React.createElement( props.as, { "className": "ml-row", ...targetProps }, props.children );
  } else {
    RowElement = React.createElement( 'div', { "className": "ml-row", ...targetProps }, props.children );
  }

  return RowElement;
}

Row.propTypes = {
  "as": PropTypes.oneOfType( [PropTypes.string, PropTypes.node] ),
  "children": PropTypes.node,
};

export default Row;
