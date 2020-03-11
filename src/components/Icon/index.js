import React from 'react';
import PropTypes from 'prop-types';

import './Icon.scss';

// const iconEndpoint = 'https://assets.boston.gov/icons/';
const iconsManifest = __ICONS_MANIFEST__; // eslint-disable-line no-undef

function Icon( props ) {
  const attributes = {
    "className": "cob-icon",
    ...props,
  };

  if ( props.icon ) {
    attributes.className += ` cob-icon--${props.icon}`;
    delete attributes.icon;

    // attributes.src =
  }

  console.log( 'iconsManifest', iconsManifest );

  return (
    <img { ...attributes } />
  );
}

Icon.propTypes = {
  "icon": (
    ( process.env.NODE_ENV === 'development' )
      ? function validateIconType( props, propName, componentName ) {
        return (
          new Error(
            `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`,
          )
        );
      }
      : PropTypes.string
  ),
  "width": PropTypes.number,
  "height": PropTypes.number,
  "alt": PropTypes.string,
};

export default Icon;
