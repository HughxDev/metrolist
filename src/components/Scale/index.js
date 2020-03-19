import React from 'react';
import PropTypes from 'prop-types';

import './Scale.scss';

function Scale( props ) {
  return (
    <div className={ `ml-scale${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </div>
  );
}

Scale.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Scale;
