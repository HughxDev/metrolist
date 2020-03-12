import React from 'react';
import PropTypes from 'prop-types';

import './Row.scss';

function Row( props ) {
  return <div className="cob-row">{ props.children }</div>;
}

Row.propTypes = {
  "children": PropTypes.node,
};

export default Row;
