import React from 'react';
import PropTypes from 'prop-types';

import './Wizard.scss';

function Wizard( props ) {
  return (
    <div className={ `ml-wizard${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </div>
  );
}

Wizard.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Wizard;
