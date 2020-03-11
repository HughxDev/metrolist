import React from 'react';
import PropTypes from 'prop-types';

import './Component.scss';

function Component( props ) {
  return (
    <div className="cob-component">
      <b>Hello World</b>
      <p>{ props.children || 'Child nodes go here' }</p>
    </div>
  );
}

Component.propTypes = {
  "children": PropTypes.node,
};

export default Component;
