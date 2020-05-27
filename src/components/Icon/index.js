import React from 'react';
import PropTypes from 'prop-types';
import { numericString } from 'airbnb-prop-types';
import { hasOwnProperty } from '@util/objects';

// import 'whatwg-fetch';
import './Icon.scss';
import iconsManifest from './icons_manifest.json';

class Icon extends React.Component {
  getReferencedSvgDimensions( idSelector ) {
    if ( !idSelector ) {
      console.error( new Error( `\`getReferencedSvgDimensions\` is missing the required parameter \`idSelector\`` ) );
    }

    const $svgElement = document.getElementById( idSelector.substring( 1 ) );
    // const nodeName = $svgElement.nodeName.toLowerCase();
    const dimensions = {
      "width": null,
      "height": null,
    };

    if ( !$svgElement ) {
      // console.warn( `Could not find an element with the id \`${idSelector}\`.` );
      return dimensions;
    }

    const hasWidth = $svgElement.hasAttribute( 'width' );
    const hasHeight = $svgElement.hasAttribute( 'height' );
    const hasViewBox = $svgElement.hasAttribute( 'viewBox' );

    if ( hasWidth || hasHeight ) {
      if ( hasWidth ) {
        dimensions.width = $svgElement.getAttribute( 'width' );
      }

      if ( hasHeight ) {
        dimensions.height = $svgElement.getAttribute( 'height' );
      }
    } else if ( hasViewBox ) {
      // 0 0 11 19 ->
      //  [0]: 0, // x
      //  [1]: 0, // y
      //  [2]: 11, // width
      //  [3]: 19, // height
      const viewBox = $svgElement.getAttribute( 'viewBox' ).split( ' ' );

      [,, dimensions.width, dimensions.height] = viewBox;
    }

    return dimensions;
  }

  constructor( props ) {
    super();

    this.state = {
      "attributes": {
        "className": `ml-icon${props.use ? ' ml-icon--svg-use' : ''}`,
        ...props,
      },
    };

    delete this.state.attributes.isMetrolistIcon;

    const oneSourcePropertyErrorMessage = `Icon component must have only one of \`icon\`, \`src\`, or \`use\` properties.`;

    if ( props.use ) {
      if ( props.icon || props.src ) {
        console.error( oneSourcePropertyErrorMessage );
      }

      if ( !props.width && !props.height ) {
        const dimensions = this.getReferencedSvgDimensions( props.use );

        this.state.attributes.width = Math.round( dimensions.width );
        this.state.attributes.height = Math.round( dimensions.height );
      }

      delete this.state.attributes.use;
    }

    if ( props.icon ) {
      if ( props.use || props.src ) {
        console.error( oneSourcePropertyErrorMessage );
      }

      this.state.attributes.className += ` ml-icon--${props.icon}`;
      delete this.state.attributes.icon;

      if ( !props.isMetrolistIcon ) {
        if ( hasOwnProperty( iconsManifest, props.icon ) ) {
          this.state.attributes.src = `https://assets.boston.gov${iconsManifest[props.icon].url}`;
        } else {
          console.error( `Could not find an icon definition for \`${props.icon}\`.` );
        }
      }
    }
  }

  render() {
    if ( this.props.use ) {
      return (
        <svg { ...this.state.attributes }>
          <use xlinkHref={ this.props.use } />
        </svg>
      );
    }

    if ( this.props.isMetrolistIcon ) {
      return (
        <picture>
          <source type="image/svg+xml" srcSet={ `/images/${this.props.icon}.sv\g` } />
          <img
            { ...this.state.attributes }
            src={ `/images/${this.props.icon}.png` }
            srcSet={ `/images/${this.props.icon}.png 1x, /images/${this.props.icon}@2x.png 2x, /images/${this.props.icon}@3x.png 3x` }
            alt={ this.props.alt }
          />
        </picture>
      );
    }

    return <img { ...this.state.attributes } />;
  }
}

Icon.propTypes = {
  "icon": PropTypes.string,
  "src": PropTypes.string,
  "use": PropTypes.string,
  "width": PropTypes.string, // numericString(),
  "height": PropTypes.string, // numericString(),
  "alt": PropTypes.string,
  "isMetrolistIcon": PropTypes.bool,
};

Icon.defaultProps = {
  "isMetrolistIcon": false,
};

export default Icon;
