import React from 'react';
import PropTypes from 'prop-types';
import { numericString } from 'airbnb-prop-types';

// import 'whatwg-fetch';
import './Icon.scss';

class Icon extends React.Component {
  constructor( props ) {
    super();

    console.log( 'props', props );

    this.state = {
      "attributes": {
        "className": "cob-icon",
        ...props,
      },
    };

    if ( props.icon ) {
      this.state.attributes.className += ` cob-icon--${props.icon}`;
      delete this.state.attributes.icon;

      import( './icons_manifest.json' )
        .then( ( iconsManifest ) => {
          // console.log( 'typeof iconsManifest', typeof iconsManifest );

          if ( iconsManifest[props.icon] ) { // TODO: Object.prototype.hasOwnProperty.call(foo, "bar");
            this.setState( {
              ...this.state,
              "attributes": {
                ...this.state.attributes,
                "src": `https://assets.boston.gov${iconsManifest[props.icon].url}`,
              },
            } );
          } else {
            console.error( `Could not find an icon definition for ${props.icon}.` );
          }
        } );
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
