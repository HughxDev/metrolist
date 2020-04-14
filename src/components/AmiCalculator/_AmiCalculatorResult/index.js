import React from 'react';
import PropTypes from 'prop-types';

import './AmiCalculatorResult.scss';

function AmiCalculatorResult( props ) {
  return (
    <div className={ `ml-ami-calculator__result${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </div>
  );
}

AmiCalculatorResult.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default AmiCalculatorResult;
