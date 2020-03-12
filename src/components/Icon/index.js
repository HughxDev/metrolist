import React from 'react';
import PropTypes from 'prop-types';
import { numericString } from 'airbnb-prop-types';
import { hasOwnProperty } from '@util/objects';

// import 'whatwg-fetch';
import './Icon.scss';
import iconsManifest from './icons_manifest.json';

class Icon extends React.Component {
  constructor( props ) {
    super();

    this.state = {
      "attributes": {
        "className": "cob-icon",
        ...props,
      },
    };

    if ( props.icon ) {
      this.state.attributes.className += ` cob-icon--${props.icon}`;
      delete this.state.attributes.icon;

      if ( hasOwnProperty( iconsManifest, props.icon ) ) {
        this.state.attributes.src = `https://assets.boston.gov${iconsManifest[props.icon].url}`;
      } else {
        console.error( `Could not find an icon definition for \`${props.icon}\`.` );
      }
    }
  }

  render() {
    return <img { ...this.state.attributes } />;
  }
}

Icon.propTypes = {
  "icon": PropTypes.string,
  "width": numericString(),
  "height": numericString(),
  "alt": PropTypes.string,
};

export default Icon;
