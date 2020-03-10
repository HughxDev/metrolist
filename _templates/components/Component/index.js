import React from 'react';
import PropTypes from 'prop-types';

function Component( props ) {
  return (
    <div>
      <b>Hello World</b>
      <p>{ props.children }</p>
    </div>
  );
}

Component.propTypes = {
  "children": PropTypes.node,
};
