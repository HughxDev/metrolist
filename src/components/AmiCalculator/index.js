import React from 'react';
import PropTypes from 'prop-types';

import './AmiCalculator.scss';

function AmiCalculator( props ) {
  return (
    <article className={ `ml-ami-calculator${props.className ? ` ${props.className}` : ''}` }>
      <h2>AMI Calculator</h2>
      { props.children }
    </article>
  );
}

AmiCalculator.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default AmiCalculator;
