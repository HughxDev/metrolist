import React from 'react';
import PropTypes from 'prop-types';

import './Column.scss';

function Column( props ) {
  return <div className="cob-column">{ props.children }</div>;
}

Column.propTypes = {
  "children": PropTypes.node,
};

export default Column;
