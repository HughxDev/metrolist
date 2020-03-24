import React from 'react';
import PropTypes from 'prop-types';

import './Column.scss';

function Column( props ) {
  return <div className={ `ml-column${props.jumbotron ? ' ml-column--jumbotron' : ''}` }>{ props.children }</div>;
}

Column.propTypes = {
  "children": PropTypes.node,
  "jumbotron": PropTypes.bool,
};

export default Column;
