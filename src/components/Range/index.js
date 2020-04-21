import React from 'react';
import PropTypes from 'prop-types';

import './Range.scss';

function Range( props ) {
  addEventListener( 'input', ( e ) => {
    const _t = e.target;
    _t.parentNode.style.setProperty( `--${_t.id}`, +_t.value );
  }, false );

  return (
    <div
      className="wrap" role="group" aria-labelledby="multi-lbl"
      style={ {
        "--value-1": "-15",
        "--value-2": "20",
        "--min": "-50",
        "--max": "50",
        "--fill": `
          linear-gradient(
            90deg,
            red calc( var( --radius ) + ( var( --value-1 ) - var( --min ) ) / var( --min-max-difference ) * var( --useful-width ) ),
            transparent 0
          ),
          linear-gradient(
            90deg,
            red calc( var( --radius ) + ( var( --value-2 ) - var( --min ) ) / var( --min-max-difference ) * var( --useful-width ) ),
            transparent 0
          )
        `,
      } }
    >
      <div id="multi-lbl">Multi thumb slider:</div>

      <label className="sr-only" htmlFor="v0">Value A</label>
      <input type="range" id="value-1" min="-50" defaultValue="-15" max="50" />
      <output htmlFor="v0" style={ { "--value": "var( --value-1 )" } }></output>

      <label className="sr-only" htmlFor="v1">Value B</label>
      <input type="range" id="value-2" min="-50" defaultValue="20" max="50" />
      <output htmlFor="v1" style={ { "--value": "var( --value-2 )" } }></output>
    </div>
  );
}

Range.displayName = 'Range';

Range.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Range;
