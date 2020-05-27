import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import './Alert.scss';

const Alert = forwardRef( ( props, ref ) => (
    <div
      { ...props }
      ref={ ref }
      className={ `ml-alert${props.variant && ` ml-alert--${props.variant}`}${props.className ? ` ${props.className}` : ''}` }
      role="alert"
      aria-live="assertive"
      hidden
    >
      { props.children }
    </div>
) );

Alert.displayName = 'Alert';

Alert.propTypes = {
  "id": PropTypes.string,
  "variant": PropTypes.string,
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Alert;
