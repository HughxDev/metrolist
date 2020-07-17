import React from 'react';
import PropTypes from 'prop-types';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
  switchToGoogleTranslateBaseIfNeeded,
  // switchBackToMetrolistBaseIfNeeded,
} from '@util/translation';

import './Link.scss';

function handleClick( event ) {
  switchToGoogleTranslateBaseIfNeeded();
}

function Link( props ) {
  return (
    <ReactRouterLink
      data-testid="ml-link"
      // className={ `ml-link${props.className ? ` ${props.className}` : ''}` }
      { ...props }
      onClick={ ( event ) => {
        handleClick( event );
        if ( props.onClick ) {
          props.onClick( event );
        }
      } }
    >
      { props.children }
    </ReactRouterLink>
  );
}

Link.displayName = 'Link';

Link.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "onClick": PropTypes.func,
};

export default Link;
