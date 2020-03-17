import React from 'react';
import PropTypes from 'prop-types';

import './Filters.scss';

function Filters( props ) {
  return (
    <div className={ `cob-filters${props.className ? ` ${props.className}` : ''}` }>
      <b>Filters</b>
    </div>
  );
}

Filters.propTypes = {
  "className": PropTypes.string,
};

export default Filters;
