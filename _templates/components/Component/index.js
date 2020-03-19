import React from 'react';
import PropTypes from 'prop-types';

import './Component.scss';

function Component( props ) {
  return (
    <div className={ `ml-component${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </div>
  );
}

Component.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Component;
