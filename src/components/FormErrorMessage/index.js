import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

// import './FormErrorMessage.scss';

const FormErrorMessage = forwardRef( ( props, ref ) => (
    <div
      ref={ ref }
      id={ props.id }
      className={ `t--subinfo t--err m-t100${props.className ? ` ${props.className}` : ''}` }
      aria-live="polite"
    >{ props.children }</div>
) );

FormErrorMessage.displayName = 'FormErrorMessage';

FormErrorMessage.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "id": PropTypes.string.isRequired,
};

export default FormErrorMessage;
